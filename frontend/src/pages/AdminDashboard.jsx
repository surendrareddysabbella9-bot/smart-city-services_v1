import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { FaTrash, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [flaggedWorkers, setFlaggedWorkers] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [workersRes, usersRes, allWorkersRes] = await Promise.all([
        api.get('/admin/workers/pending'),
        api.get('/admin/users?limit=50&page=1'),
        api.get('/workers?limit=250')
      ]);
      setPendingWorkers(workersRes.data.data ? workersRes.data.data : workersRes.data);
      setUsers(usersRes.data.data ? usersRes.data.data.users : usersRes.data);
      
      const allW = allWorkersRes.data.data ? allWorkersRes.data.data.workers : allWorkersRes.data;
      setFlaggedWorkers(allW.filter(w => (w.trust_score && Number(w.trust_score) < 65) || (w.averageRating && Number(w.averageRating) < 3.5)));
    } catch (err) {
      console.error(err);
    }
  };

  const verifyWorker = async (workerId, status) => {
    try {
      await api.put('/admin/verify-worker', { worker_id: workerId, status });
      fetchData();
    } catch (err) {
      toast.error('Failed to verify worker');
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (targetUser.id === currentUser.id) {
      toast.error('Security Constraint: You cannot permanently delete your own active administrator account.');
      return;
    }
    const confirmPurge = window.confirm(`Are you sure you want to delete ${targetUser.name}? This will also terminate all their active encrypted contracts. This action cannot be undone.`);
    if (!confirmPurge) return;
    try {
      await api.delete(`/admin/users/${targetUser.id}`);
      toast.success(`User ${targetUser.email} successfully purged from City Intelligence.`);
      fetchData();
    } catch (err) {
      toast.error('Termination failure context returned natively.');
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) || 
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <Link to="/dashboard/admin/analytics" className="btn">City Intelligence Analytics</Link>
      </div>
      
      <div style={{ marginBottom: '3rem' }}>
        <h2><span style={{ color: '#ef4444' }}>●</span> Review Moderation Queue (Flagged Profiles)</h2>
        {flaggedWorkers.length > 0 ? (
          <div className="grid" style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            {flaggedWorkers.map(worker => (
              <div key={`flagged-${worker.id}`} className="card" style={{ border: '2px solid rgba(239,68,68,0.3)', background: 'linear-gradient(to bottom, #fff, #fef2f2)' }}>
                <div className="card-header">
                  <h3 className="card-title">{worker.name}</h3>
                  <span className="badge rejected" style={{ background: '#fee2e2', color: '#b91c1c' }}>Under Review</span>
                </div>
                <p className="card-subtitle">{worker.category}</p>
                <div style={{ margin: '1rem 0' }}>
                  <p style={{ color: '#b91c1c', fontWeight: 'bold' }}><strong>Trust Score:</strong> {Number(worker.trust_score).toFixed(0)}/100</p>
                  <p style={{ color: '#b91c1c', fontWeight: 'bold' }}><strong>Rating:</strong> {worker.averageRating} Stars</p>
                  <p><strong>System Warning:</strong> User parameters breached minimum algorithm bounds remotely.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                  <button onClick={() => toast.success('Telemetry dismissed natively.')} className="btn btn-secondary">Dismiss Alert</button>
                  <button onClick={() => verifyWorker(worker.id, 'Rejected')} className="btn btn-danger">Suspend Profile Action</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
           <p style={{ marginTop: '1rem', marginBottom: '2.5rem', color: 'var(--text-light)' }}>Algorithm mapping normal. Zero flagged instances detected.</p>
        )}

        <h2>Pending Approvals</h2>
        {pendingWorkers.length > 0 ? (
          <div className="grid" style={{ marginTop: '1.5rem' }}>
            {pendingWorkers.map(worker => (
              <div key={worker.id} className="card">
                <div className="card-header">
                  <h3 className="card-title">{worker.name}</h3>
                  <span className="badge pending">Pending</span>
                </div>
                <p className="card-subtitle">{worker.category}</p>
                <div style={{ margin: '1rem 0' }}>
                  <p><strong>Email:</strong> {worker.email}</p>
                  <p><strong>Exp:</strong> {worker.experience} yrs</p>
                  <p><strong>Location:</strong> {worker.location}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => verifyWorker(worker.id, 'Verified')} className="btn btn-secondary">Approve</button>
                  <button onClick={() => verifyWorker(worker.id, 'Rejected')} className="btn btn-danger">Reject</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ marginTop: '1rem' }}>No pending approvals.</p>
        )}
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>All Users</h2>
          <div style={{ position: 'relative', minWidth: '300px' }}>
            <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input 
              type="text" 
              placeholder="Search by Email or Role..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.8rem', border: '1px solid var(--border)', borderRadius: '6px' }}
            />
          </div>
        </div>
        <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Role</th>
                <th style={{ padding: '1rem' }}>Joined</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)', animation: 'fadeIn 0.3s ease-out' }}>
                  <td style={{ padding: '1rem' }}><strong>{u.name}</strong></td>
                  <td style={{ padding: '1rem', color: 'var(--text-light)' }}>{u.email}</td>
                  <td style={{ padding: '1rem' }}><span className={`badge ${u.role.toLowerCase()}`}>{u.role}</span></td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDeleteUser(u)} 
                      className="btn btn-danger" 
                      style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', opacity: u.id === currentUser.id ? 0.3 : 1, cursor: u.id === currentUser.id ? 'not-allowed' : 'pointer' }}
                      disabled={u.id === currentUser.id}
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
