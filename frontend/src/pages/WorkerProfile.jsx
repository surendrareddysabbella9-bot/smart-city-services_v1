import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaMapMarkerAlt, FaStar, FaShieldAlt, FaBriefcase, FaUserCheck, FaArrowLeft, FaCalendarAlt, FaUserSlash } from 'react-icons/fa';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

function WorkerProfile() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  const { data: worker, isLoading, isError } = useQuery({
    queryKey: ['workerProfile', id],
    queryFn: () => api.get(`/workers/${id}`).then(res => res.data.data)
  });

  if (isLoading) return <div className="container" style={{ padding: '3rem' }}><SkeletonLoader count={1} type="card" /></div>;
  if (isError || !worker) return <div className="container" style={{ padding: '3rem' }}><EmptyState icon={FaUserSlash} title="Profile Not Found" description="The worker profile you are looking for does not exist." /></div>;

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <Link to="/workers" className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}><FaArrowLeft /> Back to Search</Link>
      
      <div className="card" style={{ padding: '3rem', position: 'relative', overflow: 'hidden', borderTop: 'none', border: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '90px', background: 'linear-gradient(135deg, var(--primary), #8b5cf6)' }}></div>
        
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem', position: 'relative', marginTop: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ width: '130px', height: '130px', background: 'white', borderRadius: '50%', border: '5px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>
             {worker.name.charAt(0)}
          </div>
          <div style={{ paddingBottom: '0.5rem' }}>
            <h1 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '2.25rem' }}>
              {worker.name} 
              {worker.verification_status === 'Verified' && <FaUserCheck color="#10b981" title="Verified Background" size={28}/>}
            </h1>
            <span className="badge" style={{ fontSize: '1.1rem', padding: '0.4rem 1.25rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}>{worker.category}</span>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
           <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
             <FaStar color="#f59e0b" size={28} style={{ marginBottom: '0.75rem' }}/>
             <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text)' }}>{worker.averageRating || 'New'}</div>
             <div style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Average Rating</div>
           </div>
           <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
             <FaShieldAlt color="#3b82f6" size={28} style={{ marginBottom: '0.75rem' }}/>
             <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text)' }}>{worker.trust_score}%</div>
             <div style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Trust Score</div>
           </div>
           <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
             <FaBriefcase color="#8b5cf6" size={28} style={{ marginBottom: '0.75rem' }}/>
             <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text)' }}>{worker.experience} yrs</div>
             <div style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Experience</div>
           </div>
           <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
             <FaMapMarkerAlt color="#ef4444" size={28} style={{ marginBottom: '0.75rem' }}/>
             <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: 'var(--text)' }}>{worker.location || 'Global'}</div>
             <div style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Location</div>
           </div>
        </div>

        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Client Reviews</h3>
        {worker.reviews && worker.reviews.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {worker.reviews.map((r, i) => (
              <li key={i} style={{ padding: '1.75rem', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '1rem', background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                  <strong style={{ fontSize: '1.1rem' }}>{r.customer_name}</strong>
                  <span style={{ color: '#f59e0b', fontWeight: 'bold', background: '#fef3c7', padding: '0.2rem 0.75rem', borderRadius: '12px' }}>⭐ {r.rating}/5</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text)', fontStyle: 'italic', lineHeight: '1.5' }}>"{r.review}"</p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No Reviews Yet" description="There are no reviews for this worker yet." />
        )}

        <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
           {user ? (
             <Link to={`/book/${worker.id}`} className="btn" style={{ padding: '1.25rem 3rem', fontSize: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}><FaCalendarAlt /> Book this Worker</Link>
           ) : (
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
               <Link to="/login" className="btn btn-secondary" style={{ padding: '1.25rem 3rem', fontSize: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', borderRadius: '8px', background: '#f1f5f9', color: '#475569', border: '2px solid #cbd5e1' }}><FaLock /> Login to Book</Link>
               <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Secure your appointment by verifying your identity first.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

export default WorkerProfile;
