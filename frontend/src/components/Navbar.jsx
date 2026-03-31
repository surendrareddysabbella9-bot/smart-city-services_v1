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
            <Link to="/profile" title="Profile Settings" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none', boxShadow: '0 3px 8px rgba(59,130,246,0.25)', marginRight: '0.75rem', border: '2px solid white' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Link>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
               <strong style={{ fontSize: '0.90rem', color: 'var(--text)' }}>{user?.name?.split(' ')[0]}</strong>
               <button onClick={handleLogout} style={{ padding: 0, width: 'auto', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.70rem', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}>Sign out</button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/workers" className="btn btn-outline" style={{ marginRight: '1rem', padding: '0.4rem 1.25rem', width: 'auto', border: '1.5px solid var(--primary)', color: 'var(--primary)', fontWeight: 'bold' }}>Find Professionals</Link>
            <Link to="/login" style={{ marginRight: '1.5rem', fontWeight: 'bold', color: 'var(--text-light)', textDecoration: 'none' }}>Log In</Link>
            <Link to="/register" className="btn" style={{ padding: '0.4rem 1.25rem', width: 'auto', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)' }}>Sign Up Free</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
