import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProfileEditor from '../components/ProfileEditor';
import { Link } from 'react-router-dom';

function WorkerDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/worker');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="container">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="dashboard-title">My Jobs</h1>
        <Link to="/dashboard/worker/performance" className="btn">Performance Insights</Link>
      </div>
      {bookings.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{new Date(b.booking_date).toLocaleString()}</td>
                <td>{b.customer_name}</td>
                <td>{b.customer_phone}</td>
                <td>{b.description}</td>
                <td><span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span></td>
                <td>
                  {b.status === 'Pending' && (
                    <button onClick={() => updateStatus(b.id, 'Accepted')} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', width: 'auto', marginRight: '0.5rem' }}>Accept</button>
                  )}
                  {b.status === 'Accepted' && (
                    <button onClick={() => updateStatus(b.id, 'Completed')} className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', width: 'auto' }}>Complete Job</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No job requests found.</p>
      )}
    </div>
  );
}

export default WorkerDashboard;
