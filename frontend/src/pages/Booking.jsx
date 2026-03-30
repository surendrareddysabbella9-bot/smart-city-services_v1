import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Booking() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [description, setDescription] = useState('');
  const [bookingDate, setBookingDate] = useState('');

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const res = await api.get(`/workers/${workerId}`);
        setWorker(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWorker();
  }, [workerId]);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await api.post('/bookings', {
        customer_id: user.customerId,
        worker_id: workerId,
        service_id: 1,
        description,
        booking_date: bookingDate
      });
      alert('Booking submitted successfully!');
      navigate('/dashboard/customer');
    } catch (err) {
      alert('Error submitting booking');
    }
  };

  if (!worker) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>Book {worker.name}</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-light)' }}>{worker.category} • ★ {worker.averageRating}</p>
        
        <form onSubmit={handleBooking}>
          <div className="form-group">
            <label>Job Description</label>
            <textarea 
              rows="4" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              required 
              placeholder="Describe what you need help with..."
            />
          </div>
          <div className="form-group">
            <label>Date and Time</label>
            <input 
              type="datetime-local" 
              value={bookingDate} 
              onChange={e => setBookingDate(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn">Confirm Booking</button>
        </form>
      </div>
    </div>
  );
}

export default Booking;
