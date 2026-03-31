import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaShieldAlt, FaBriefcase, FaUserCheck } from 'react-icons/fa';

function WorkerCard({ worker }) {
  const isNearest = worker.matchScore && worker.matchScore > 50 && worker.location; 

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', borderTop: isNearest ? '4px solid var(--primary)' : '1px solid var(--border)', overflow: 'hidden' }}>
      {isNearest && <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)' }}>⭐ Optimal Proximity Match</div>}
      
      <div style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
        <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          {worker.name}
          {worker.verification_status === 'Verified' && <FaUserCheck color="#10b981" title="Background Cryptographically Reviewed" />}
        </h3>
        <p className="card-subtitle" style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{worker.category}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)' }}>
          <FaStar color="#f59e0b" /> <strong style={{ fontSize: '1.1rem' }}>{worker.averageRating || 'Uncalibrated'}</strong> 
          <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>({worker.total_jobs || 0} secure contracts)</span>
        </div>
        
        <div style={{ height: '1px', background: 'var(--background)', margin: '0.25rem 0' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
          <FaShieldAlt color="#3b82f6" /> Algorithm Trust Coefficient: <strong style={{ color: 'var(--primary)' }}>{Number(worker.trust_score).toFixed(0)}/100</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
          <FaBriefcase color="#8b5cf6" /> Validated Experience: <strong style={{ color: 'var(--text)' }}>{worker.experience} Years</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
          <FaMapMarkerAlt color="#ef4444" /> {worker.location || 'Global/Remote Overlay Available'}
        </div>
      </div>

      <Link to={`/book/${worker.id}`} className="btn" style={{ textAlign: 'center', width: '100%', borderRadius: '4px' }}>Establish Contract</Link>
    </div>
  );
}

export default WorkerCard;
