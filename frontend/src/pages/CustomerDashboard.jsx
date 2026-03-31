import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FaCalendarAlt, FaHistory, FaCheckCircle, FaStar, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../services/api';

function CustomerDashboard() {
  const queryClient = useQueryClient();

  // Extract from unified backend standard response!
  const [isProcessing, setIsProcessing] = React.useState(false);
  const { data = [], isLoading } = useQuery({
    queryKey: ['customerBookings'],
    queryFn: () => api.get('/bookings/customer').then(res => res.data.data ? res.data.data : res.data),
    refetchInterval: 15000 
  });

  const activeBookings = data.filter(b => b.status === 'Pending' || b.status === 'Accepted');
  const pastBookings = data.filter(b => b.status === 'Completed' || b.status === 'Cancelled');

  const handleUpdateStatus = async (id, status) => {
    if (status === 'Cancelled' && !window.confirm('Are you certain you wish to abort this service connection? This action is irreversible.')) return;
    
    setIsProcessing(true);
    try {
      await api.put(`/bookings/${id}/status`, { status });
      queryClient.invalidateQueries(['customerBookings']);
      toast.success(`Service status successfully transitioned to ${status}`);
    } catch (err) {
      toast.error('The connection handshake failed to update securely.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRating = async (bookingId, workerId, workerName) => {
    const rating = prompt(`Rate your experience with ${workerName} (1-5 Stars):`);
    if (!rating) return;
    
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      toast.warn('Please provide a valid numeric rating between 1 and 5.');
      return;
    }

    const review = prompt('Optional diagnostic feedback (Internal Use Only):');
    
    setIsProcessing(true);
    try {
      await api.post('/ratings', { booking_id: bookingId, worker_id: workerId, rating: ratingNum, review });
      toast.success('Professional ledger updated. Your rating has been verified and applied.');
      queryClient.invalidateQueries(['customerBookings']);
    } catch(err) { 
      toast.error(err.response?.data?.message || 'The rating verification protocol failed.'); 
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div className="dashboard-header" style={{ marginBottom: '3rem' }}>
        <h1 className="dashboard-title" style={{ fontSize: '2.5rem', fontWeight: '900' }}>Logistics Dashboard</h1>
        <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>Management terminal for your active and historical urban service connections.</p>
      </div>
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '5rem', fontSize: '1.25rem', color: 'var(--text-light)' }}>Synchronizing service history...</div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2.5rem' }}>
          <section className="card" style={{ padding: '0', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ padding: '1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0, borderRadius: '16px 16px 0 0' }}><FaCalendarAlt color="var(--primary)"/> Active Service Connections</h3>
            <div style={{ padding: '1.5rem' }}>
              {activeBookings.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {activeBookings.map(b => (
                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid #f1f5f9', borderRadius: '12px', background: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '1.15rem', color: '#1e293b' }}>{b.worker_name}</strong>
                        <p style={{ margin: '0.25rem 0 0.5rem 0', color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>{b.category} • {b.description}</p>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Scheduled: {new Date(b.start_time).toLocaleString()}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span className={`badge ${b.status.toLowerCase()}`} style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>{b.status}</span>
                        {b.status === 'Pending' && (
                           <button disabled={isProcessing} onClick={() => handleUpdateStatus(b.id, 'Cancelled')} className="btn btn-outline" style={{ border: '2px solid #ef4444', color: '#ef4444', padding: '0.5rem 1.25rem', fontWeight: '800' }}>Abort Connection</button>
                        )}
                        {b.status === 'Accepted' && (
                           <button disabled={isProcessing} onClick={() => handleUpdateStatus(b.id, 'Completed')} className="btn" style={{ background: '#10b981', color: 'white', padding: '0.5rem 1.25rem', fontWeight: '800' }}>Verify Completion</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '2rem' }}>No active connections in your current terminal.</p>}
            </div>
          </section>

          <section className="card" style={{ padding: '0', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
             <h3 style={{ padding: '1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0, borderRadius: '16px 16px 0 0' }}><FaHistory color="#6366f1"/> Service Connection History</h3>
             <div style={{ padding: '1.5rem' }}>
               {pastBookings.length > 0 ? (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   {pastBookings.map(b => (
                     <div key={b.id} style={{ padding: '1.5rem', border: '1px solid #f1f5f9', borderRadius: '12px', background: b.status === 'Cancelled' ? '#f8fafc' : 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                          <strong style={{ fontSize: '1.1rem', color: '#1e293b' }}>{b.worker_name}</strong>
                          <span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span>
                        </div>
                        <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.9rem' }}>
                          {b.status === 'Completed' 
                            ? `Archived: ${b.end_time ? new Date(b.end_time).toLocaleDateString() : 'N/A'}`
                            : 'Connection Terminated Historiographically'
                          }
                        </p>
                        {b.status === 'Completed' && (
                          b.rating_submitted ? (
                             <div style={{ textAlign: 'center', color: '#059669', fontStyle: 'italic', fontWeight: '700', padding: '0.75rem', background: '#f0fdf4', borderRadius: '8px', fontSize: '0.9rem' }}><FaCheckCircle /> Performance Feedback Logged</div>
                          ) : (
                             <button disabled={isProcessing} className="btn" onClick={() => handleRating(b.id, b.worker_id, b.worker_name)} style={{ width: '100%', background: '#6366f1', color: 'white', fontWeight: '800' }}>Rate Performance</button>
                          )
                        )}
                     </div>
                   ))}
                  </div>
               ) : <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '2rem' }}>History ledger is currently unpopulated.</p>}
             </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
