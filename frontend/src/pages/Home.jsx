import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <div className="header-section">
        <h1>Welcome to Smart City Services</h1>
        <p>Connect with the best verified professionals for all your home and office needs.</p>
        <div style={{ marginTop: '2rem' }}>
          <Link to="/workers" className="btn" style={{ width: 'auto', marginRight: '1rem', fontSize: '1.1rem' }}>Find a Worker</Link>
          <Link to="/register" className="btn btn-secondary" style={{ width: 'auto', fontSize: '1.1rem' }}>Join as a Worker</Link>
        </div>
      </div>
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Our Services</h2>
        <div className="grid">
          {['Electrician', 'Plumber', 'Painter', 'Construction Worker', 'Maintenance Worker'].map((service, idx) => (
            <div key={idx} className="card" style={{ textAlign: 'center' }}>
              <h3 className="card-title">{service}</h3>
              <p className="card-subtitle" style={{ marginTop: '0.5rem' }}>Find expert {service.toLowerCase()}s</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
