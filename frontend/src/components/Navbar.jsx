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
        {user ? (
          <div className="navbar-user">
            <Link to="/profile" title="Profile Settings" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none', boxShadow: '0 3px 8px rgba(59,130,246,0.25)', marginRight: '1rem', border: '2px solid white' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.45rem 1.25rem', width: 'auto', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-light)', borderRadius: '6px' }}>Logout</button>
          </div>
        ) : (
          <>
            <Link to="/workers" style={{ marginRight: '1.5rem', fontWeight: 'bold' }}>Find Workers</Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', width: 'auto' }}>Login</Link>
            <Link to="/register" className="btn" style={{ padding: '0.4rem 1rem', width: 'auto' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
