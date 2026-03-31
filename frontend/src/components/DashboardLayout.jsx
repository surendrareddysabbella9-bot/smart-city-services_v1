import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaChartBar, FaUserCheck, FaBriefcase, FaIdCard, FaUserShield } from 'react-icons/fa';
import '../dashboard.css';

function DashboardLayout({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path) ? 'active' : '';

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-nav">
          <div className="nav-section">LOGISTICS CONTROL</div>
          {user?.role === 'Customer' && (
            <>
              <Link to="/dashboard/customer" className={`nav-link ${(isActive('customer') && !isActive('subscriptions')) ? 'active' : ''}`}><FaCalendarAlt /> Active Encrypted Contracts</Link>
              <Link to="/dashboard/customer/subscriptions" className={`nav-link ${isActive('subscriptions') ? 'active' : ''}`}><FaBriefcase /> Facility Agreements</Link>
              <Link to="/workers" className="nav-link"><FaUserCheck /> Global Resource Map</Link>
            </>
          )}
          {user?.role === 'Worker' && (
            <>
              <Link to="/dashboard/worker" className={`nav-link ${(isActive('worker') && !isActive('performance')) ? 'active' : ''}`}><FaBriefcase /> Incoming Vector Directives</Link>
              <Link to="/dashboard/worker/performance" className={`nav-link ${isActive('performance') ? 'active' : ''}`}><FaChartBar /> Performance Diagnostics</Link>
            </>
          )}
          {user?.role === 'Admin' && (
            <>
              <Link to="/dashboard/admin" className={`nav-link ${(isActive('admin') && !isActive('analytics')) ? 'active' : ''}`}><FaUserShield /> Security Clearances</Link>
              <Link to="/dashboard/admin/analytics" className={`nav-link ${isActive('analytics') ? 'active' : ''}`}><FaChartBar /> Telemetry Node</Link>
            </>
          )}
          
          <div className="nav-section" style={{ marginTop: '2.5rem' }}>SYSTEM CONFIG</div>
          <Link to="/profile" className={`nav-link ${isActive('profile') ? 'active' : ''}`}><FaIdCard /> Configuration Params</Link>
        </nav>
      </aside>
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
