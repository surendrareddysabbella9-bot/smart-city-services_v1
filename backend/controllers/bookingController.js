import pool from '../database.js';

export const createBooking = async (req, res) => {
  const { worker_id, service_id, description, start_time, end_time } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const start = new Date(start_time);
    const end = new Date(end_time);
    if (start < new Date()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, error: 'Booking cannot be placed strictly in the past.' });
    }
    if (end <= start) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, error: 'End time boundary must exceed start time interval.' });
    }

    // Isolate targeting row-level bounds via "FOR UPDATE" explicit execution
    const workerCheck = await client.query('SELECT id FROM Workers WHERE id = $1 FOR UPDATE', [worker_id]);
    if (workerCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Target Worker context absent block failed.' });
    }

    // Mathematical Conflict Resolution
    const conflictCheck = await client.query(`
      SELECT 1 FROM Bookings
      WHERE worker_id = $1 
      AND status IN ('Pending', 'Accepted') 
      AND is_deleted = false
      AND (start_time < $3 AND end_time > $2)
    `, [worker_id, start, end]);

    if (conflictCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ success: false, error: 'Time slot overlaps directly intersecting existing locked logic block.' });
    }

    let executing_customer_id;
    const fallbackCheck = await client.query('SELECT id FROM Customers WHERE user_id = $1', [req.user.id]);
    if (fallbackCheck.rows.length > 0) {
        executing_customer_id = fallbackCheck.rows[0].id;
    } else {
        const newCustomerNode = await client.query('INSERT INTO Customers (user_id, location) VALUES ($1, $2) RETURNING id', [req.user.id, 'Dual-Role Operations']);
        executing_customer_id = newCustomerNode.rows[0].id;
    }

    const result = await client.query(
      'INSERT INTO Bookings (customer_id, worker_id, service_id, description, start_time, end_time, status, booking_date) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
      [executing_customer_id, worker_id, service_id || 1, description, start, end, 'Pending']
    );

    await client.query('COMMIT');
    res.status(201).json({ success: true, data: result.rows[0], message: 'Booking isolated successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
};

export const getCustomerBookings = async (req, res) => {
  try {
    const customers = await pool.query('SELECT id FROM Customers WHERE user_id = $1', [req.user.id]);
    if (customers.rows.length === 0) return res.json([]);
    const customerId = customers.rows[0].id;

    const bookings = await pool.query(`
      SELECT b.*, w.category, u.name as worker_name 
      FROM Bookings b 
      JOIN Workers w ON b.worker_id = w.id 
      JOIN Users u ON w.user_id = u.id 
      WHERE b.customer_id = $1
    `, [customerId]);
    res.json(bookings.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWorkerBookings = async (req, res) => {
  try {
    const workers = await pool.query('SELECT id FROM Workers WHERE user_id = $1', [req.user.id]);
    if (workers.rows.length === 0) return res.status(404).json({ message: 'Worker not found' });
    const workerId = workers.rows[0].id;

    const bookings = await pool.query(`
      SELECT b.*, u.name as customer_name, u.phone as customer_phone
      FROM Bookings b 
      JOIN Customers c ON b.customer_id = c.id 
      JOIN Users u ON c.user_id = u.id 
      WHERE b.worker_id = $1
    `, [workerId]);
    res.json(bookings.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE Bookings SET status = $1 WHERE id = $2', [status, id]);

    if (status === 'Completed') {
      const bookingRes = await pool.query(`
        SELECT b.worker_id, w.category as service_type
        FROM Bookings b
        JOIN Workers w ON b.worker_id = w.id
        WHERE b.id = $1
      `, [id]);
      const booking = bookingRes.rows[0];

      if (booking) {
        await pool.query(`
          INSERT INTO job_history (worker_id, booking_id, service_type)
          VALUES ($1, $2, $3)
        `, [booking.worker_id, id, booking.service_type]);

        const totalAcceptedRes = await pool.query(`SELECT COUNT(*) as count FROM Bookings WHERE worker_id = $1 AND status != 'Pending'`, [booking.worker_id]);
        const totalCompletedRes = await pool.query(`SELECT COUNT(*) as count FROM Bookings WHERE worker_id = $1 AND status = 'Completed'`, [booking.worker_id]);
        
        const totalAccepted = parseInt(totalAcceptedRes.rows[0].count) || 1;
        const totalCompleted = parseInt(totalCompletedRes.rows[0].count) || 0;
        const completionRate = (totalCompleted / totalAccepted) * 100;

        const trustChange = (completionRate >= 90) ? 5 : (completionRate > 50 ? 1 : -5);
        
        await pool.query(`
          UPDATE Workers 
          SET total_jobs = $1, completion_rate = $2, trust_score = LEAST(trust_score + $3, 100)
          WHERE id = $4
        `, [totalCompleted, completionRate, trustChange, booking.worker_id]);
      }
    }

    res.json({ message: 'Booking status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
