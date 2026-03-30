import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProfileEditor from '../components/ProfileEditor';
import { Link } from 'react-router-dom';

function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [ratingData, setRatingData] = useState({ show: false, bookingId: null, rating: 5, review: '' });

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/customer');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const submitRating = async (e) => {
    e.preventDefault();
    try {
      await api.post('/ratings', {
        booking_id: ratingData.bookingId,
        rating: ratingData.rating,
        review: ratingData.review
      });
      alert('Rating submitted successfully!');
      setRatingData({ show: false, bookingId: null, rating: 5, review: '' });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting rating');
    }
  };

  return (
    <div className="container">
      <ProfileEditor userRole="Customer" />
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="dashboard-title">My Bookings</h1>
        <Link to="/dashboard/customer/subscriptions" className="btn">Manage Subscriptions</Link>
      </div>
      {bookings.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Worker</th>
              <th>Category</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{new Date(b.booking_date).toLocaleString()}</td>
                <td>{b.worker_name}</td>
                <td>{b.category}</td>
                <td><span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span></td>
                <td>
                  {b.status === 'Completed' && (
                    <button 
                      onClick={() => setRatingData({ ...ratingData, show: true, bookingId: b.id })}
                      className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', width: 'auto' }}
                    >
                      Rate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No bookings found.</p>
      )}

      {ratingData.show && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--surface)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h3>Leave a Review</h3>
          <form onSubmit={submitRating} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label>Rating (1-5)</label>
              <input type="number" min="1" max="5" value={ratingData.rating} onChange={e => setRatingData({...ratingData, rating: Number(e.target.value)})} />
            </div>
            <div className="form-group">
              <label>Review</label>
              <textarea rows="3" value={ratingData.review} onChange={e => setRatingData({...ratingData, review: e.target.value})}></textarea>
            </div>
            <button type="submit" className="btn" style={{ width: 'auto' }}>Submit Rating</button>
            <button type="button" onClick={() => setRatingData({...ratingData, show: false})} className="btn btn-secondary" style={{ width: 'auto', marginLeft: '1rem' }}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
