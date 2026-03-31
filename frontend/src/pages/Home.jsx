import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShieldAlt, FaBriefcase, FaUserCheck, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

function Home() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/workers?search=${encodeURIComponent(search)}`);
    else navigate('/workers');
  };

  const stats = [
    { icon: <FaUserCheck size={24} color="#10b981" />, value: '15,000+', label: 'Verified Professionals' },
    { icon: <FaStar size={24} color="#f59e0b" />, value: '4.8/5', label: 'Average Trust Rating' },
    { icon: <FaShieldAlt size={24} color="#3b82f6" />, value: '100%', label: 'Secure Payments' },
    { icon: <FaBriefcase size={24} color="#8b5cf6" />, value: '250k+', label: 'Jobs Completed' }
  ];

  const services = [
    { name: 'Electrician', pros: '342 Verified Pros', rate: 'Starting at $45/hr' },
    { name: 'Plumber', pros: '289 Verified Pros', rate: 'Starting at $50/hr' },
    { name: 'Painter', pros: '156 Verified Pros', rate: 'Starting at $35/hr' },
    { name: 'Maintenance Worker', pros: '410 Verified Pros', rate: 'Starting at $30/hr' },
    { name: 'Construction Worker', pros: '190 Verified Pros', rate: 'Starting at $60/hr' },
    { name: 'Cleaning Services', pros: '520 Verified Pros', rate: 'Starting at $25/hr' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* Hero Section */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #4338ca)', color: 'white', padding: '6rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
          Professional Help, On Demand
        </h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2.5rem', color: '#e0e7ff', lineHeight: '1.6' }}>
          Connect securely with top-rated local experts for all your home, office, and municipal maintenance needs.
        </p>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '600px', margin: '0 auto', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'white', paddingLeft: '1.5rem', flex: 1 }}>
            <FaSearch color="#64748b" size={20} />
            <input 
              type="text" 
              placeholder="What service do you need? (e.g., Plumber)" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '1.25rem', border: 'none', fontSize: '1.1rem', outline: 'none', color: '#1e293b' }}
            />
          </div>
          <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '0 2rem', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: 'background 0.2s' }}>
            Find Expert
          </button>
        </form>

        {!localStorage.getItem('user') && (
          <div style={{ marginTop: '2.5rem', fontSize: '1rem', color: '#c7d2fe' }}>
            Are you a professional looking for work? <Link to="/register" style={{ color: 'white', fontWeight: 'bold', textDecoration: 'underline' }}>Join our network</Link>
          </div>
        )}
      </div>

      {/* Trust Signals */}
      <div style={{ background: 'white', padding: '3rem 2rem', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '50%' }}>{s.icon}</div>
              <strong style={{ fontSize: '1.5rem', color: '#0f172a' }}>{s.value}</strong>
              <span style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 2rem', flex: 1 }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.25rem', color: '#1e293b' }}>Popular Services</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {services.map((service, idx) => (
            <div key={idx} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'} onClick={() => navigate(`/workers?category=${encodeURIComponent(service.name)}`)}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                 <h3 style={{ fontSize: '1.25rem', margin: 0, color: '#0f172a' }}>{service.name}</h3>
                 <span style={{ background: '#dcfce7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>Active</span>
               </div>
               <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}><FaUserCheck color="#10b981"/> {service.pros}</p>
               <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}><FaBriefcase color="#8b5cf6"/> {service.rate}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
           <Link to="/workers" className="btn btn-outline" style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '8px' }}>Explore All Categories</Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: '#cbd5e1', padding: '4rem 2rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <h4 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '1.25rem' }}>Smart City Services</h4>
            <p style={{ lineHeight: '1.6', fontSize: '0.9rem' }}>The premier municipal and residential service network connecting verified professionals with urgent logistical demands globally.</p>
          </div>
          <div>
            <strong style={{ color: 'white', display: 'block', marginBottom: '1.25rem' }}>Platform</strong>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/workers" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Find Professionals</Link></li>
              <li><Link to="/register" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Join our Network</Link></li>
              <li><Link to="/login" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Contractor Login</Link></li>
            </ul>
          </div>
          <div>
            <strong style={{ color: 'white', display: 'block', marginBottom: '1.25rem' }}>Legal & Security</strong>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li style={{ cursor: 'pointer' }}>Terms of Service</li>
              <li style={{ cursor: 'pointer' }}>Privacy Policy</li>
              <li style={{ cursor: 'pointer' }}>Escrow Parameters</li>
              <li style={{ cursor: 'pointer' }}>Audited Metrics</li>
            </ul>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '1.5rem', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem' }}>
          <span>&copy; {new Date().getFullYear()} Smart City Services. All rights strictly reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Protected by 256-bit TLS Encryption <FaShieldAlt color="#10b981" /></span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
