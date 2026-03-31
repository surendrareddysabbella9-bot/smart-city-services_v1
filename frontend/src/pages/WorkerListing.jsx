import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaSearch, FaFilter } from 'react-icons/fa';
import api from '../services/api';
import WorkerCard from '../components/WorkerCard';

function WorkerListing() {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['workers', filter, search],
    queryFn: async () => {
      const url = `/workers?limit=50&page=1${filter ? `&category=${filter}` : ''}${search ? `&search=${search}` : ''}`;
      const res = await api.get(url);
      return res.data.data ? res.data.data.workers : res.data;
    },
    refetchInterval: 10000, 
    refetchOnWindowFocus: true
  });

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="dashboard-title" style={{ margin: 0 }}>Discover Professionals</h1>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem', height: '100%', border: '1px solid var(--border)', borderRadius: '4px' }}
            />
          </div>
          
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '0.6rem 1rem', border: '1px solid var(--border)', borderRadius: '4px', minWidth: '180px' }}>
            <option value="">All Verification Categories</option>
            <option value="Electrician">Electrician</option>
            <option value="Plumber">Plumber</option>
            <option value="Painter">Painter</option>
            <option value="Maintenance Worker">Maintenance Worker Analytics</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid">
          {[1,2,3,4,5,6].map(i => (
             <div key={i} className="card" style={{ height: '300px', background: '#f8fafc', animation: 'pulse 1.5s infinite', border: '1px dashed #cbd5e1' }}></div>
          ))}
        </div>
      ) : isError ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#dc2626', background: '#fee2e2', borderRadius: '8px', border: '1px solid #f87171' }}>
          Secure routing failed. Please try synchronizing your network connectivity payload.
        </div>
      ) : data?.length > 0 ? (
        <div className="grid">
          {data.filter(w => w.user_id !== user?.id).map(worker => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      ) : (
        <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--surface)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
          <FaFilter size={48} color="var(--border)" style={{ marginBottom: '1.5rem' }} />
          <h3>No matches mapped to logic</h3>
          <p style={{ color: 'var(--text-light)' }}>Try expanding your search criteria bounding boxes.</p>
        </div>
      )}
    </div>
  );
}

export default WorkerListing;
