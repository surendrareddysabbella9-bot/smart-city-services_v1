import React from 'react';
import { Link } from 'react-router-dom';
import CertificationBadge from './CertificationBadge';

function WorkerCard({ worker }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{worker.name}</h3>
        {worker.verification_status === 'Verified' && <span className="badge verified">Verified</span>}
      </div>
      <p className="card-subtitle">{worker.category}</p>
      
      <CertificationBadge workerId={worker.id} />

      <div style={{ margin: '1rem 0' }}>
        <p><strong>Trust Score:</strong> {worker.trust_score || '0.00'} / 100</p>
        {worker.matchScore && <p><strong>Match Score:</strong> <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{worker.matchScore}</span></p>}
        <p><strong>Experience:</strong> {worker.experience} years</p>
        <p><strong>Rating:</strong> <span className="rating-stars">★ {worker.averageRating || 'N/A'}</span></p>
      </div>
      <Link to={`/book/${worker.id}`} className="btn">View Profile & Book</Link>
    </div>
  );
}

export default WorkerCard;
