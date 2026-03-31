import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Smart City Services</Link>
      <div className="navbar-links">
        <Link to="/workers">Find Workers</Link>
        {user ? (
          <div className="navbar-user">
            {user.role === 'Admin' && <Link to="/dashboard/admin">Admin Dashboard</Link>}
            {user.role === 'Worker' && <Link to="/dashboard/worker">Worker Dashboard</Link>}
            {user.role === 'Customer' && <Link to="/dashboard/customer">My Bookings</Link>}
            {user.role !== 'Admin' && <Link to="/profile" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', width: 'auto', background: 'transparent', color: 'var(--text)' }}>👤 Profile</Link>}
            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.4rem 1rem', width: 'auto' }}>Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', width: 'auto' }}>Login</Link>
            <Link to="/register" className="btn" style={{ padding: '0.4rem 1rem', width: 'auto' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
