import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Booking() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [form, setForm] = useState({ description: '', start_time: '', end_time: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/workers/${workerId}`).then(res => setWorker(res.data)).catch(() => setError('Worker not found'));
  }, [workerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      await api.post('/bookings', {
        customer_id: user.customerId || user.id,
        worker_id: workerId,
        description: form.description,
        start_time: form.start_time,
        end_time: form.end_time
      });
      alert('Booking explicitly locked cleanly against concurrency block!');
      navigate('/dashboard/customer');
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Time slot intersects with a parallel locked booking execution window.');
      } else {
        setError(err.response?.data?.error || 'Worker unavailable. Failed verification check.');
      }
    }
  };

  if (!worker) return <div className="container">Analyzing metrics...</div>;

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h1>Secure Book: {worker.name}</h1>
      {error && <div style={{ color: '#991b1b', background: '#fee2e2', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 'bold' }}>{error}</div>}
      <form onSubmit={handleSubmit} className="card" style={{ marginTop: '2rem' }}>
        <div className="form-group"><label>Comprehensive Requirement Breakdown</label><textarea required rows="4" value={form.description} onChange={e=>setForm({...form, description: e.target.value})}></textarea></div>
        <div className="form-group"><label>Expected Check-In Scope Array</label><input type="datetime-local" required value={form.start_time} onChange={e=>setForm({...form, start_time: e.target.value})} /></div>
        <div className="form-group"><label>Expected Departure Boundary</label><input type="datetime-local" required value={form.end_time} onChange={e=>setForm({...form, end_time: e.target.value})} /></div>
        <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Execute Synchronized Booking Overlay</button>
      </form>
    </div>
  );
}

export default Booking;
