import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
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
    <div className="container" style={{ padding: '3rem 4rem' }}>
      <div style={{ marginBottom: '2rem', fontSize: '0.95rem', color: '#1e293b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
         <span style={{ cursor: 'pointer', borderBottom: '2px solid transparent' }} onClick={() => window.history.back()}>{user ? 'Dashboard Workspace' : 'Public Marketplace'}</span> <span style={{ margin: '0 0.5rem', color: '#cbd5e1' }}>/</span> <strong style={{ color: 'var(--primary)', borderBottom: '2px solid var(--primary)' }}>Discover Global Professionals</strong>
      </div>

      <header style={{ marginBottom: '3.5rem', textAlign: 'left' }}>
        <h1 className="dashboard-title" style={{ margin: 0, fontSize: '3rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.04em' }}>Discover Professionals</h1>
        <p style={{ color: '#475569', marginTop: '0.75rem', fontSize: '1.2rem', fontWeight: '500', maxWidth: '700px', lineHeight: '1.6' }}>Access the inner sanctum of verified city service providers across all critical urban sectors.</p>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'white', padding: '1.25rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08)', marginTop: '2.5rem', flexWrap: 'nowrap', overflowX: 'auto' }}>
          <div style={{ position: 'relative', flex: 3, minWidth: '350px' }}>
            <FaSearch style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Search by name (e.g. Anil)..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '3.75rem', paddingRight: '1rem', height: '52px', width: '100%', border: '2px solid #f1f5f9', borderRadius: '12px', fontSize: '1.05rem', background: '#f8fafc', fontWeight: '500', outline: 'none' }}
            />
          </div>
          
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ flex: 1, padding: '0 1rem', height: '52px', border: '2px solid #f1f5f9', borderRadius: '12px', minWidth: '180px', fontSize: '1rem', background: '#f8fafc', fontWeight: '800', color: '#1e293b', cursor: 'pointer' }}>
            <option value="">All Categories</option>
            <option value="Electrician">Electrician</option>
            <option value="Plumber">Plumber</option>
            <option value="Painter">Painter</option>
            <option value="Maintenance Worker">Maintenance Worker</option>
          </select>

          <select value={minRating} onChange={(e) => setMinRating(e.target.value)} style={{ flex: 1, padding: '0 1rem', height: '52px', border: '2px solid #f1f5f9', borderRadius: '12px', minWidth: '160px', fontSize: '1rem', background: '#f8fafc', fontWeight: '800', color: '#1e293b', cursor: 'pointer' }}>
            <option value="">Any Rating</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4.0">4.0+ Stars</option>
            <option value="3.0">3.0+ Stars</option>
          </select>

          <button className="btn" style={{ height: '52px', padding: '0 2.5rem', fontWeight: '900', borderRadius: '12px', fontSize: '1.1rem', minWidth: '160px', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Search</button>

          {(filter || search || minRating) && (
            <button 
              onClick={() => { setFilter(''); setSearch(''); setMinRating(''); }} 
              style={{ background: 'transparent', border: 'none', color: '#dc2626', fontWeight: '900', cursor: 'pointer', fontSize: '0.9rem', padding: '0 0.5rem', textTransform: 'uppercase' }}
            >
              Reset
            </button>
          )}
        </div>
      </header>

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
