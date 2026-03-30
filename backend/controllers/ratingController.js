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

    await pool.query('UPDATE job_history SET rating = $1 WHERE booking_id = $2', [rating, booking_id]);

    const bookingRes = await pool.query('SELECT worker_id FROM Bookings WHERE id = $1', [booking_id]);
    if (bookingRes.rows.length > 0) {
       const workerId = bookingRes.rows[0].worker_id;
       const ratingEffect = (rating >= 4) ? 2 : (rating === 3 ? 0 : -3);
       await pool.query('UPDATE Workers SET trust_score = LEAST(trust_score + $1, 100) WHERE id = $2', [ratingEffect, workerId]);
    }

    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
