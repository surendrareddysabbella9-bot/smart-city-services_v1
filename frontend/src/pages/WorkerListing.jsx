import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaSearch, FaFilter } from 'react-icons/fa';
import api from '../services/api';
import WorkerCard from '../components/WorkerCard';

function WorkerListing() {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState('');
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
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', flex: 1, minWidth: '300px', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input 
                type="text" 
                placeholder="Search professionals..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.8rem', paddingRight: '1rem', height: '42px', width: '100%', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.95rem' }}
              />
            </div>
            <button className="btn" style={{ height: '42px', padding: '0 1.5rem', fontWeight: 'bold' }}>Search</button>
          </div>
          
          <select value={minRating} onChange={(e) => setMinRating(e.target.value)} style={{ padding: '0 1rem', height: '42px', border: '1px solid var(--border)', borderRadius: '8px', minWidth: '140px', fontSize: '0.95rem', background: 'white' }}>
            <option value="">Any Rating</option>
            <option value="4.5">4.5+ Stars (Elite)</option>
            <option value="4.0">4.0+ Stars (Top)</option>
            <option value="3.0">3.0+ Stars (Good)</option>
          </select>

          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '0 1rem', height: '42px', border: '1px solid var(--border)', borderRadius: '8px', minWidth: '140px', fontSize: '0.95rem', background: 'white' }}>
            <option value="">All Categories</option>
            <option value="Electrician">Electrician</option>
            <option value="Plumber">Plumber</option>
            <option value="Painter">Painter</option>
            <option value="Maintenance Worker">Maintenance Worker</option>
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
          Failed to load worker profiles. Please try again.
        </div>
      ) : (data?.filter(w => w.user_id !== user?.id && (!minRating || Number(w.averageRating || 0) >= Number(minRating))) || []).length > 0 ? (
        <div className="grid">
          {data.filter(w => w.user_id !== user?.id && (!minRating || Number(w.averageRating || 0) >= Number(minRating))).map(worker => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      ) : (
        <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--surface)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
          <FaFilter size={48} color="var(--border)" style={{ marginBottom: '1.5rem' }} />
          <h3>No workers found</h3>
          <p style={{ color: 'var(--text-light)' }}>Try adjusting your search filters to find more available professionals.</p>
        </div>
      )}
    </div>
  );
}

export default WorkerListing;
