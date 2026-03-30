import React, { useEffect, useState } from 'react';
import api from '../services/api';
import WorkerCard from '../components/WorkerCard';

function WorkerListing() {
  const [workers, setWorkers] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchWorkers();
  }, [category]);

  const fetchWorkers = async () => {
    try {
      const res = await api.get(`/workers${category ? `?category=${category}` : ''}`);
      setWorkers(res.data);
    } catch (err) {
      console.error('Failed to fetch workers', err);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>Intelligent Matching</h2>
          <p style={{ color: 'var(--text-light)', margin: 0 }}>Professionals are proactively sorted by absolute Match Score (Rating + Trust + Experience).</p>
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', minWidth: '200px' }}>
          <option value="">All Categories</option>
          <option value="Electrician">Electrician</option>
          <option value="Plumber">Plumber</option>
          <option value="Painter">Painter</option>
          <option value="Construction Worker">Construction Worker</option>
          <option value="Maintenance Worker">Maintenance Worker</option>
        </select>
      </div>
      {workers.length > 0 ? (
        <div className="grid">
          {workers.map(worker => <WorkerCard key={worker.id} worker={worker} />)}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-light)' }}>No verified professionals found matching this intelligent criteria.</p>
        </div>
      )}
    </div>
  );
}
export default WorkerListing;
