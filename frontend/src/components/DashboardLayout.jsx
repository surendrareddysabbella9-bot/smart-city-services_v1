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
          <Link to="/workers" title="Find Workers Directory" className={`nav-link ${isActive('/workers') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', boxSizing: 'border-box' }}><FaUserCheck /> <span className="nav-text">Find Workers</span></Link>

          <div className="nav-section" style={{ marginTop: '1.5rem' }}>MY WORKSPACE</div>
          {user?.role === 'Customer' && (
            <>
              <Link to="/dashboard/customer" title="My Logistics Bookings" className={`nav-link ${isActive('/dashboard/customer') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', boxSizing: 'border-box' }}><FaCalendarAlt /> <span className="nav-text">My Bookings</span></Link>
              <Link to="/dashboard/customer/subscriptions" title="Active Subscriptions" className={`nav-link ${isActive('/dashboard/customer/subscriptions') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', boxSizing: 'border-box' }}><FaBriefcase /> <span className="nav-text">Subscriptions</span></Link>
            </>
          )}
          {user?.role === 'Worker' && (
            <>
              <Link to="/dashboard/worker" title="Worker Dashboard" className={`nav-link ${isActive('/dashboard/worker') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', boxSizing: 'border-box' }}><FaBriefcase /> <span className="nav-text">Dashboard</span></Link>
              <Link to="/dashboard/worker/performance" title="Performance Analytics" className={`nav-link ${isActive('/dashboard/worker/performance') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', boxSizing: 'border-box' }}><FaChartBar /> <span className="nav-text">Performance Insights</span></Link>
            </>
          )}
          {user?.role === 'Admin' && (
            <>
              <Link to="/dashboard/admin" title="Admin Verifications" className={`nav-link ${isActive('/dashboard/admin') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', boxSizing: 'border-box' }}><FaUserShield /> <span className="nav-text">Verifications</span></Link>
              <Link to="/dashboard/admin/analytics" title="Live System Analytics" className={`nav-link ${isActive('/dashboard/admin/analytics') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', boxSizing: 'border-box' }}><FaChartBar /> <span className="nav-text">Live Analytics</span></Link>
            </>
          )}
          
          <div className="nav-section" style={{ marginTop: '2.5rem' }}>ACCOUNT</div>
          <Link to="/profile" title="Profile Configuration" className={`nav-link ${isActive('/profile') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', boxSizing: 'border-box' }}><FaIdCard /> <span className="nav-text">Profile Settings</span></Link>
        </nav>
      </aside>
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
