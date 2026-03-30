import pool from '../database.js';

export const getWorkers = async (req, res) => {
  const { category } = req.query;
  try {
    let query = `
      SELECT w.id, u.name, w.category, w.experience, w.location, w.verification_status,
             w.trust_score, w.total_jobs, w.completion_rate
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
      
      const avgRatingNum = parseFloat(worker.averageRating) || 0;
      const trustScoreNum = parseFloat(worker.trust_score) || 0;
      const expNum = parseInt(worker.experience) || 0;
      worker.matchScore = ((avgRatingNum * 10) + (trustScoreNum * 0.4) + (expNum * 1.5)).toFixed(2);
    }
    
    // Sort intelligently by MatchScore desc
    workers.sort((a, b) => parseFloat(b.matchScore) - parseFloat(a.matchScore));

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

export const getWorkerHistory = async (req, res) => {
  try {
    const historyRes = await pool.query(`
      SELECT j.*, u.name as customer_name 
      FROM job_history j
      JOIN bookings b ON j.booking_id = b.id
      JOIN customers c ON b.customer_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE j.worker_id = $1
      ORDER BY j.completed_date DESC
    `, [req.params.id]);
    res.json(historyRes.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWorkerCertifications = async (req, res) => {
  try {
    const certsRes = await pool.query(`
      SELECT * FROM worker_certifications 
      WHERE worker_id = $1
    `, [req.params.id]);
    res.json(certsRes.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addCertification = async (req, res) => {
  const { worker_id, certification_name } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO worker_certifications (worker_id, certification_name) 
      VALUES ($1, $2) RETURNING id
    `, [worker_id, certification_name]);
    res.status(201).json({ message: 'Certification requested', id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
