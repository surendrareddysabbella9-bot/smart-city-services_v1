import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaCalendarAlt, FaCheckCircle, FaBriefcase, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState('incoming');

  const { data: jobs = [], isLoading: jobsLoading, refetch: refetchJobs } = useQuery({
    queryKey: ['workerJobs'],
    queryFn: () => api.get('/bookings/worker').then(res => res.data),
    refetchInterval: 10000 
  });

  const { data: myBookings = [], isLoading: bookingsLoading, refetch: refetchBookings } = useQuery({
    queryKey: ['myBookings'],
    queryFn: () => api.get('/bookings/customer').then(res => res.data.data || res.data),
    refetchInterval: 10000 
  });

  const updateJobStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      toast.success(`Job execution vector locked explicitly to ${status}`);
      refetchJobs();
    } catch (err) {
      toast.error('Failed to change bounded job properties safely.');
    }
  };

  const cancelMyBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/status`, { status: 'Cancelled' });
      toast.info('Booking request explicitly aborted.');
      refetchBookings();
    } catch (err) {
      toast.error('Could not communicate cancel logic.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      <h1 className="dashboard-title" style={{ marginBottom: '2rem', fontSize: '2rem' }}>My Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '2.5rem' }}>
         <button onClick={() => setActiveTab('incoming')} className={`btn ${activeTab !== 'incoming' ? 'btn-ghost' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.75rem', borderRadius: '8px', fontSize: '1rem' }}>
            <FaBriefcase /> Jobs Assigned to Me ({jobs.length})
         </button>
         <button onClick={() => setActiveTab('bookings')} className={`btn ${activeTab !== 'bookings' ? 'btn-ghost' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.75rem', borderRadius: '8px', background: activeTab === 'bookings' ? '#10b981' : 'transparent', color: activeTab === 'bookings' ? 'white' : 'var(--text-light)', fontSize: '1rem' }}>
            <FaCalendarAlt /> My Service Requests ({myBookings.length})
         </button>
      </div>

      {activeTab === 'incoming' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          {jobsLoading ? <SkeletonLoader count={1} type="list"/> : jobs.length > 0 ? (
             <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {jobs.map(job => (
                   <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'white' }}>
                     <div>
                       <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.35rem' }}>{job.customer_name} {job.status !== 'Pending' && <span style={{ color: 'var(--text-light)', fontWeight: 'normal', fontSize: '0.9rem' }}>({job.customer_phone})</span>}</strong>
                       <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontStyle: 'italic', lineHeight: '1.4' }}>"{job.description}"</p>
                       <p style={{ margin: 0, fontSize: '0.85rem' }}>Start Time: {job.start_time ? new Date(job.start_time).toLocaleString() : 'Not set'}</p>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexDirection: 'column' }}>
                       <span className={`badge ${job.status.toLowerCase()}`} style={{ width: '100%', textAlign: 'center', padding: '0.4rem 1rem' }}>{job.status}</span>
                       {job.status === 'Pending' && <button onClick={() => updateJobStatus(job.id, 'Accepted')} className="btn btn-outline" style={{ padding: '0.4rem 1.25rem', fontSize: '0.85rem', width: '100%' }}>Accept Job</button>}
                       {job.status === 'Accepted' && <button onClick={() => updateJobStatus(job.id, 'Completed')} className="btn" style={{ background: '#10b981', padding: '0.4rem 1.25rem', fontSize: '0.85rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}><FaCheckCircle size={14} /> Mark Completed</button>}
                     </div>
                   </div>
                ))}
             </div>
          ) : <EmptyState title="No Jobs Assigned" description="You have no incoming or assigned jobs at the moment." />}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          {bookingsLoading ? <SkeletonLoader count={1} type="list"/> : myBookings.length > 0 ? (
             <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {myBookings.map(b => (
                   <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'white' }}>
                     <div>
                       <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.35rem' }}>{b.worker_name} <span style={{ color: '#8b5cf6', fontWeight: 'bold', fontSize: '0.9rem', background: '#f5f3ff', padding: '0.25rem 0.5rem', borderRadius: '8px', marginLeft: '0.25rem' }}>{b.category}</span></strong>
                       <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontStyle: 'italic', lineHeight: '1.4' }}>"{b.description}"</p>
                       <p style={{ margin: 0, fontSize: '0.85rem' }}>Start Time: {b.start_time ? new Date(b.start_time).toLocaleString() : 'Not set'}</p>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexDirection: 'column' }}>
                       <span className={`badge ${b.status.toLowerCase()}`} style={{ width: '100%', textAlign: 'center', padding: '0.4rem 1rem' }}>{b.status}</span>
                       {b.status === 'Pending' && <button onClick={() => cancelMyBooking(b.id)} className="btn btn-secondary" style={{ padding: '0.4rem 1.25rem', fontSize: '0.85rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FaTimesCircle size={14} /> Cancel Request</button>}
                     </div>
                   </div>
                ))}
             </div>
          ) : <EmptyState title="No Service Requests" description="You haven't requested any services from other workers yet." />}
        </div>
      )}
    </div>
  );
}

export default WorkerDashboard;
