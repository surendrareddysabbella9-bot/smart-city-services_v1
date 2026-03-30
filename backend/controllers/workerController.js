import pool from '../database.js';

export const getWorkers = async (req, res) => {
  const { category } = req.query;
  try {
    let query = `
      SELECT w.id, u.name, w.category, w.experience, w.location, w.verification_status 
      FROM Workers w 
      JOIN Users u ON w.user_id = u.id 
      WHERE w.verification_status = 'Verified'
    `;
    const params = [];
    if (category) {
      query += ' AND w.category = $1';
      params.push(category);
    }
    const workersResult = await pool.query(query, params);
    const workers = workersResult.rows;

    for (let worker of workers) {
      const ratingsResult = await pool.query(`
        SELECT AVG(r.rating) as avgRating 
        FROM Ratings r 
        JOIN Bookings b ON r.booking_id = b.id 
        WHERE b.worker_id = $1
      `, [worker.id]);
      const ratings = ratingsResult.rows;
      worker.averageRating = ratings[0]?.avgrating ? parseFloat(ratings[0].avgrating).toFixed(1) : 0;
    }

    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWorkerById = async (req, res) => {
  try {
    const workersResult = await pool.query(`
      SELECT w.id, u.name, w.category, w.experience, w.location, w.verification_status, u.phone, u.email 
      FROM Workers w 
      JOIN Users u ON w.user_id = u.id 
      WHERE w.id = $1
    `, [req.params.id]);

    if (workersResult.rows.length === 0) return res.status(404).json({ message: 'Worker not found' });
    const worker = workersResult.rows[0];

    const ratingsResult = await pool.query(`
      SELECT r.rating, r.review, u.name as customer_name 
      FROM Ratings r 
      JOIN Bookings b ON r.booking_id = b.id 
      JOIN Customers c ON b.customer_id = c.id
      JOIN Users u ON c.user_id = u.id
      WHERE b.worker_id = $1
    `, [worker.id]);

    const ratings = ratingsResult.rows;
    worker.reviews = ratings;
    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / (ratings.length || 1);
    worker.averageRating = avg ? avg.toFixed(1) : 0;

    res.json(worker);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
