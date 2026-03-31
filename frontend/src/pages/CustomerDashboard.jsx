import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FaCalendarAlt, FaHistory, FaCheckCircle, FaStar, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../services/api';

function CustomerDashboard() {
  const queryClient = useQueryClient();

  // Extract from unified backend standard response!
  const { data = [], isLoading } = useQuery({
    queryKey: ['customerBookings'],
    queryFn: () => api.get('/bookings/customer').then(res => res.data.data ? res.data.data : res.data),
    refetchInterval: 15000 
  });

  const activeBookings = data.filter(b => b.status === 'Pending' || b.status === 'Accepted');
  const pastBookings = data.filter(b => b.status === 'Completed' || b.status === 'Cancelled');

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      queryClient.invalidateQueries(['customerBookings']);
      toast.success(`Booking dynamically resolved implicitly to ${status}`);
    } catch (err) {
      toast.error('Failed to change booking securely.');
    }
  };

  const handleRating = async (bookingId, workerId) => {
    const r = prompt('Overall Rating Protocol Framework (1-5):');
    const rr = prompt('Optional diagnostic feedback debriefing:');
    if (r) {
      try {
        await api.post('/ratings', { booking_id: bookingId, worker_id: workerId, rating: r, review: rr });
        toast.success('Your encrypted metrics integrated safely into the Master Trust Tracker!');
        queryClient.invalidateQueries(['customerBookings']);
      } catch(err) { toast.error(err.response?.data?.message || err.response?.data?.error || 'Ratings failed security bounds constraint'); }
    }
  };

  return (
    <div className="container">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h1 className="dashboard-title" style={{ margin: 0 }}>Customer Logistics Terminal</h1>
        <Link to="/dashboard/customer/subscriptions" className="btn">Facility Agreements Map</Link>
      </div>
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.25rem' }}>Processing localized history array...</div>
      ) : (
        <div className="grid">
          <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <h3 style={{ padding: '1.5rem', background: '#f8fafc', borderBottom: '1px dashed var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}><FaCalendarAlt color="var(--primary)"/> Active Encrypted Contracts</h3>
            <div style={{ padding: '1.5rem' }}>
              {activeBookings.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {activeBookings.map(b => (
                    <li key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '8px', marginBottom: '1rem', background: 'white' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{b.worker_name} <span style={{ color: 'var(--text-light)', fontWeight: 'normal', fontSize: '0.9rem' }}>({b.category})</span></strong>
                        <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-light)', fontSize: '0.9rem' }}>{b.description}</p>
                        <p style={{ margin: 0, fontSize: '0.85rem' }}>Start Trace: {new Date(b.start_time).toLocaleString()}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span>
                        {b.status === 'Pending' && <button onClick={() => handleUpdateStatus(b.id, 'Cancelled')} className="btn btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FaTimesCircle /> Abort Connection</button>}
                        {b.status === 'Accepted' && <button onClick={() => handleUpdateStatus(b.id, 'Completed')} className="btn" style={{ background: '#10b981', padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FaCheckCircle /> Authorize Conclusion</button>}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p style={{ color: 'var(--text-light)' }}>Zero scheduled logic bounds exist mapping.</p>}
            </div>
          </div>

          <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border)' }}>
             <h3 style={{ padding: '1.5rem', background: '#f8fafc', borderBottom: '1px dashed var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}><FaHistory color="var(--primary)"/> Validated Historical Executions</h3>
             <div style={{ padding: '1.5rem' }}>
               {pastBookings.length > 0 ? (
                 <ul style={{ listStyle: 'none', padding: 0 }}>
                   {pastBookings.map(b => (
                     <li key={b.id} style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '8px', marginBottom: '1rem', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <strong style={{ fontSize: '1.1rem' }}>{b.worker_name}</strong>
                          <span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span>
                        </div>
                        <p style={{ margin: '0 0 1rem 0', color: 'var(--text-light)', fontSize: '0.9rem' }}>Terminated Logic: {new Date(b.end_time).toLocaleString()}</p>
                        {b.status === 'Completed' && <button className="btn btn-secondary" onClick={() => handleRating(b.id, b.worker_id)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><FaStar color="#f59e0b" /> Submit Mathematical Trust Factor Output</button>}
                     </li>
                   ))}
                  </ul>
               ) : <p style={{ color: 'var(--text-light)' }}>Past contract hash table empty.</p>}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default CustomerDashboard;
