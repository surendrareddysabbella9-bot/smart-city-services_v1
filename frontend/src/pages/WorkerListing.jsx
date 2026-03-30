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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Available Workers</h2>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px' }}>
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
        <p>No verified workers found in this category.</p>
      )}
    </div>
  );
}

export default WorkerListing;
