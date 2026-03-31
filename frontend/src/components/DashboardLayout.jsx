import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaChartBar, FaUserCheck, FaBriefcase, FaIdCard, FaUserShield } from 'react-icons/fa';
import '../dashboard.css';

function DashboardLayout({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <div className="nav-section">DISCOVER</div>
          <Link to="/workers" className={`nav-link ${isActive('/workers') ? 'active' : ''}`}><FaUserCheck /> Find Workers</Link>

          <div className="nav-section" style={{ marginTop: '1.5rem' }}>MY WORKSPACE</div>
          {user?.role === 'Customer' && (
            <>
              <Link to="/dashboard/customer" className={`nav-link ${isActive('/dashboard/customer') ? 'active' : ''}`}><FaCalendarAlt /> My Bookings</Link>
              <Link to="/dashboard/customer/subscriptions" className={`nav-link ${isActive('/dashboard/customer/subscriptions') ? 'active' : ''}`}><FaBriefcase /> Subscriptions</Link>
            </>
          )}
          {user?.role === 'Worker' && (
            <>
              <Link to="/dashboard/worker" className={`nav-link ${isActive('/dashboard/worker') ? 'active' : ''}`}><FaBriefcase /> Dashboard</Link>
              <Link to="/dashboard/worker/performance" className={`nav-link ${isActive('/dashboard/worker/performance') ? 'active' : ''}`}><FaChartBar /> Performance Insights</Link>
            </>
          )}
          {user?.role === 'Admin' && (
            <>
              <Link to="/dashboard/admin" className={`nav-link ${isActive('/dashboard/admin') ? 'active' : ''}`}><FaUserShield /> Verifications</Link>
              <Link to="/dashboard/admin/analytics" className={`nav-link ${isActive('/dashboard/admin/analytics') ? 'active' : ''}`}><FaChartBar /> Live Analytics</Link>
            </>
          )}
          
          <div className="nav-section" style={{ marginTop: '2.5rem' }}>ACCOUNT</div>
          <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}><FaIdCard /> Profile Settings</Link>
        </nav>
      </aside>
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
