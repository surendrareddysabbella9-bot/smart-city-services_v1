import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaShieldAlt, FaBriefcase, FaUserCheck } from 'react-icons/fa';

function WorkerCard({ worker }) {
  const isNearest = worker.matchScore && worker.matchScore > 50 && worker.location; 

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', borderTop: isNearest ? '4px solid var(--primary)' : '1px solid var(--border)', overflow: 'hidden' }}>
      {isNearest && <div style={{ alignSelf: 'flex-start', background: '#ecfdf5', color: '#059669', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '1rem', border: '1.5px solid #10b981', boxShadow: '0 2px 4px rgba(16,185,129,0.1)' }}>⭐ Algorithm: Best Contextual Match</div>}
      
      <div style={{ marginBottom: '1rem', marginTop: '0.25rem' }}>
        <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '1.25rem' }}>
          {worker.name}
          {worker.verification_status === 'Verified' && <FaUserCheck color="#10b981" title="Verified User" />}
        </h3>
        <p className="card-subtitle" style={{ color: '#1e293b', fontSize: '0.95rem', fontWeight: '700', letterSpacing: '0.01em' }}>{worker.category}</p>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#1f2937', fontSize: '0.95rem', fontWeight: '500' }}>
          <FaBriefcase color="#8b5cf6" size={16} /> Experience: <strong style={{ color: '#111827' }}>{worker.experience} yrs</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#1f2937', fontSize: '0.85rem', fontWeight: '500', background: '#f1f5f9', padding: '0.4rem 0.75rem', borderRadius: '8px', margin: '0.25rem 0' }}>
          <FaMapMarkerAlt color="#ef4444" size={16} /> 
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#111827', fontWeight: '700' }}>{worker.location || 'Remote / Anywhere'}</span>
            {worker.distance !== null && worker.distance !== undefined && <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '900' }}>📍 {worker.distance.toFixed(1)} km away</span>}
          </div>
        </div>
      </div>

      <Link to={`/worker/${worker.id}`} className="btn" style={{ textAlign: 'center', width: '100%', borderRadius: '8px', fontWeight: '900', padding: '0.85rem', color: 'white', background: 'var(--primary)', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)', fontSize: '1rem' }}>View Profile</Link>
    </div>
  );
}

export default WorkerCard;
