import React from 'react';
import { Link } from 'react-router-dom';

function WorkerCard({ worker }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{worker.name}</h3>
        {worker.verification_status === 'Verified' && <span className="badge verified">Verified</span>}
      </div>
      <p className="card-subtitle">{worker.category}</p>
      <div style={{ margin: '1rem 0' }}>
        <p><strong>Experience:</strong> {worker.experience} years</p>
        <p><strong>Location:</strong> {worker.location}</p>
        <p><strong>Rating:</strong> <span className="rating-stars">★ {worker.averageRating || 'N/A'}</span></p>
      </div>
      <Link to={`/book/${worker.id}`} className="btn">Book Now</Link>
    </div>
  );
}

export default WorkerCard;
