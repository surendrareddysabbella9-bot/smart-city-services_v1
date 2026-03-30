import pool from '../database.js';

export const getAlerts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.* FROM worker_alerts a
      JOIN workers w ON w.id = a.worker_id
      WHERE w.user_id = $1
      ORDER BY a.created_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const generateAlerts = async (req, res) => {
  try {
    const workers = await pool.query("SELECT id FROM workers WHERE category IN ('Electrician', 'Plumber')");
    for (let w of workers.rows) {
      await pool.query("INSERT INTO worker_alerts (worker_id, alert_message) VALUES ($1, 'Surging local demand detected for your category!')", [w.id]);
    }
    res.json({ message: 'Intelligence alerts generated and pushed directly to active workers.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
