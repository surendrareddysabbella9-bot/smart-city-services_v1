import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [workersRes, usersRes] = await Promise.all([
        api.get('/admin/workers/pending'),
        api.get('/admin/users')
      ]);
      setPendingWorkers(workersRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const verifyWorker = async (workerId, status) => {
    try {
      await api.put('/admin/verify-worker', { worker_id: workerId, status });
      fetchData();
    } catch (err) {
      alert('Failed to verify worker');
    }
  };

  return (
    <div className="container">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <Link to="/dashboard/admin/analytics" className="btn">City Intelligence Analytics</Link>
      </div>
      
      <div style={{ marginBottom: '3rem' }}>
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
        <h2>All Users</h2>
        <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
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
