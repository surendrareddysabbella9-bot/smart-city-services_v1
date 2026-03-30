import pool from '../database.js';

export const createRating = async (req, res) => {
  const { booking_id, rating, review } = req.body;
  try {
    const existing = await pool.query('SELECT * FROM Ratings WHERE booking_id = $1', [booking_id]);
    if (existing.rows.length > 0) return res.status(400).json({ message: 'Rating already submitted' });

    await pool.query(
      'INSERT INTO Ratings (booking_id, rating, review) VALUES ($1, $2, $3)',
      [booking_id, rating, review]
    );
    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
