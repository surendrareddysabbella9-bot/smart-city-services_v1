import pool from '../database.js';

export const getUsers = async (req, res) => {
  try {
    const users = await pool.query('SELECT id, name, email, phone, role, created_at FROM Users');
    res.json(users.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyWorker = async (req, res) => {
  const { worker_id, status } = req.body;
  try {
    await pool.query('UPDATE Workers SET verification_status = $1 WHERE id = $2', [status, worker_id]);
    res.json({ message: `Worker status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPendingWorkers = async (req, res) => {
  try {
    const workers = await pool.query(`
      SELECT w.id, u.name, u.email, w.category, w.experience, w.location, w.verification_status 
      FROM Workers w
      JOIN Users u ON w.user_id = u.id
      WHERE w.verification_status = 'Pending'
    `);
    res.json(workers.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
