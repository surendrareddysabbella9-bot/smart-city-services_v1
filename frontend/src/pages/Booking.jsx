import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import TrustScoreDisplay from '../components/TrustScoreDisplay';
import JobHistoryList from '../components/JobHistoryList';
import CertificationBadge from '../components/CertificationBadge';

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
        service_id: 1, // Defaulting for MVP
        description,
        booking_date: bookingDate
      });
      alert('Booking submitted successfully!');
      navigate('/dashboard/customer');
    } catch (err) {
      alert('Error submitting booking');
    }
  };

  if (!worker) return <div className="container" style={{ textAlign: 'center', marginTop: '2rem' }}>Loading professional profile...</div>;

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800 }}>{worker.name}</h1>
          {worker.verification_status === 'Verified' && <span className="badge verified">Verified Professional</span>}
        </div>
        
        <p style={{ color: 'var(--text-light)', fontSize: '1.25rem', marginBottom: '1rem' }}>
          {worker.category} • {worker.location} • {worker.experience} Years Experience
        </p>

        <CertificationBadge workerId={workerId} />

        <div style={{ marginTop: '2rem' }}>
          <TrustScoreDisplay 
            score={worker.trust_score} 
            completionRate={worker.completion_rate} 
            totalJobs={worker.total_jobs} 
          />
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card" style={{ alignSelf: 'start' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Book this Service</h2>
          <form onSubmit={handleBooking}>
            <div className="form-group">
              <label>Job Description</label>
              <textarea 
                rows="4" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                required 
                placeholder="Describe what you need help with precisely..."
              />
            </div>
            <div className="form-group">
              <label>Service Date and Time</label>
              <input 
                type="datetime-local" 
                value={bookingDate} 
                onChange={e => setBookingDate(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn" style={{ marginTop: '0.5rem' }}>Secure Booking</button>
          </form>
        </div>

        <div>
          <JobHistoryList workerId={workerId} />
        </div>
      </div>
    </div>
  );
}

export default Booking;
