import pool from '../database.js';

export const createBooking = async (req, res) => {
  const { customer_id, worker_id, service_id, description, booking_date } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO Bookings (customer_id, worker_id, service_id, description, booking_date, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [customer_id, worker_id, service_id || 1, description, booking_date, 'Pending']
    );
    res.status(201).json({ message: 'Booking created successfully', bookingId: result.rows[0]?.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCustomerBookings = async (req, res) => {
  try {
    const customers = await pool.query('SELECT id FROM Customers WHERE user_id = $1', [req.user.id]);
    if (customers.rows.length === 0) return res.status(404).json({ message: 'Customer not found' });
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
