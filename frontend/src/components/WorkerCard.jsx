import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaShieldAlt, FaBriefcase, FaUserCheck } from 'react-icons/fa';

function WorkerCard({ worker }) {
  const isNearest = worker.matchScore && worker.matchScore > 50 && worker.location; 

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', borderTop: isNearest ? '4px solid var(--primary)' : '1px solid var(--border)', overflow: 'hidden' }}>
      {isNearest && <div style={{ alignSelf: 'flex-start', background: '#dbeafe', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>⭐ Nearest Match</div>}
      
      <div style={{ marginBottom: '1rem', marginTop: '0.25rem' }}>
        <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '1.25rem' }}>
          {worker.name}
          {worker.verification_status === 'Verified' && <FaUserCheck color="#10b981" title="Verified User" />}
        </h3>
        <p className="card-subtitle" style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>{worker.category}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)' }}>
          <FaStar color="#f59e0b" size={16} /> <strong style={{ fontSize: '1.1rem' }}>{worker.averageRating || 'New'}</strong> 
          <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>({worker.total_jobs || 0} jobs)</span>
        </div>
        
        <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0', opacity: 0.5 }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text)', fontSize: '0.95rem' }}>
          <FaShieldAlt color="#3b82f6" size={16} /> Trust Score: <strong style={{ color: 'var(--primary)' }}>{Number(worker.trust_score).toFixed(0)}/100</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text)', fontSize: '0.95rem' }}>
          <FaBriefcase color="#8b5cf6" size={16} /> Experience: <strong>{worker.experience} yrs</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text)', fontSize: '0.95rem' }}>
          <FaMapMarkerAlt color="#ef4444" size={16} /> {worker.location || 'Remote / Anywhere'}
        </div>
      </div>

      <Link to={`/worker/${worker.id}`} className="btn btn-outline" style={{ textAlign: 'center', width: '100%', borderRadius: '6px', fontWeight: 'bold', border: '2px solid var(--primary)', color: 'var(--primary)' }}>View Profile</Link>
    </div>
  );
}

export default WorkerCard;
