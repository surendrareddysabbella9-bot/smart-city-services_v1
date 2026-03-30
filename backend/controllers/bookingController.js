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
    res.json({ message: 'Booking status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
