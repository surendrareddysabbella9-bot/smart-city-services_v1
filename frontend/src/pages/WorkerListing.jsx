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
    <div className="container" style={{ padding: '2rem 3rem' }}>
      <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#475569', fontWeight: '500' }}>
         <span style={{ cursor: 'pointer', hover: { color: 'var(--primary)' } }} onClick={() => window.history.back()}>{user ? 'Dashboard Workspace' : 'Marketplace Home'}</span> <span style={{ margin: '0 0.5rem', color: '#cbd5e1' }}>/</span> <strong style={{ color: 'var(--primary)' }}>Discover Global Professionals</strong>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="dashboard-title" style={{ margin: 0 }}>Discover Professionals</h1>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', width: '100%', maxWidth: '1100px', background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div style={{ position: 'relative', flex: 3, minWidth: '300px' }}>
            <FaSearch style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search by professional name (e.g. Anil)..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '3.25rem', paddingRight: '1rem', height: '56px', width: '100%', border: '2px solid var(--border)', borderRadius: '12px', fontSize: '1rem', background: 'white', boxSizing: 'border-box' }}
            />
          </div>
          
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ flex: 1, padding: '0 1rem', height: '56px', border: '2px solid var(--border)', borderRadius: '12px', minWidth: '180px', fontSize: '1rem', background: 'white', fontWeight: 'bold', color: 'var(--text)', cursor: 'pointer' }}>
            <option value="">All Categories</option>
            <option value="Electrician">Electrician</option>
            <option value="Plumber">Plumber</option>
            <option value="Painter">Painter</option>
            <option value="Maintenance Worker">Maintenance Worker</option>
          </select>

          <select value={minRating} onChange={(e) => setMinRating(e.target.value)} style={{ flex: 1, padding: '0 1rem', height: '56px', border: '2px solid var(--border)', borderRadius: '12px', minWidth: '180px', fontSize: '1rem', background: 'white', fontWeight: 'bold', color: 'var(--text)', cursor: 'pointer' }}>
            <option value="">Any Rating</option>
            <option value="4.5">4.5+ Elite</option>
            <option value="4.0">4.0+ Top</option>
            <option value="3.0">3.0+ Good</option>
          </select>

          <button className="btn" style={{ height: '56px', padding: '0 2.5rem', fontWeight: '800', borderRadius: '12px', fontSize: '1.1rem', minWidth: '160px', background: 'var(--primary)', color: 'white', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>Search</button>

          {(filter || search || minRating) && (
            <button 
              onClick={() => { setFilter(''); setSearch(''); setMinRating(''); }} 
              style={{ background: 'transparent', border: 'none', color: '#dc2626', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', padding: '0 0.5rem' }}
            >
              Reset
            </button>
          )}
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
        <div style={{ padding: '5rem 2rem', textAlign: 'center', background: 'white', borderRadius: '16px', border: '2px dashed #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <FaFilter size={64} color="#94a3b8" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
          <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>No Professionals Detected in this Scope</h2>
          <p style={{ color: '#475569', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>We're currently scaling our verified worker pool. Adjust your search criteria or register as a partner to be the first in your area.</p>
          {!user && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
               <Link to="/register" className="btn" style={{ padding: '0.85rem 2rem' }}>Become a Verified Worker</Link>
               <button onClick={() => { setFilter(''); setSearch(''); setMinRating(''); }} className="btn btn-outline" style={{ padding: '0.85rem 2rem' }}>View Global Directory</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WorkerListing;
