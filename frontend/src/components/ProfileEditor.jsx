import React, { useState, useEffect } from 'react';
import api from '../services/api';

import { FaEye, FaEyeSlash } from 'react-icons/fa';

function ProfileEditor({ userRole }) {
  const [formData, setFormData] = useState({ name: '', phone: '', location: '', experience: '' });
  const [success, setSuccess] = useState('');
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        setFormData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', formData);
      setSuccess('Your profile has been saved successfully.');
      setTimeout(() => setSuccess(''), 4000);
    } catch(err) { console.error(err); }
  };

  const handleCancel = () => {
    window.location.reload();
  };

  const inputStyle = {
    padding: '0.75rem',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    width: '100%',
    fontSize: '1rem',
    background: '#f8fafc',
    color: 'var(--text)'
  };

  return (
    <div className="card" style={{ marginBottom: '2rem', width: '100%', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>Personal Information</h3>
      {success && <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #bbf7d0', fontWeight: '500' }}>{success}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text)' }}>Display Name</label>
            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required style={inputStyle} />
          </div>
          
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text)' }}>Phone Number</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPhone ? "text" : "password"} 
                name="phone" 
                value={formData.phone || ''} 
                onChange={handleChange} 
                required 
                style={{...inputStyle, paddingRight: '2.5rem'}}
              />
              <button type="button" onClick={() => setShowPhone(!showPhone)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
                {showPhone ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text)' }}>City Location</label>
            <input type="text" name="location" value={formData.location || ''} onChange={handleChange} required style={inputStyle} />
          </div>
          
          {userRole === 'Worker' && (
            <div className="form-group">
               <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text)' }}>Years of Experience</label>
               <input type="number" name="experience" value={formData.experience || ''} onChange={handleChange} style={inputStyle} />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <button type="button" onClick={handleCancel} className="btn btn-ghost" style={{ padding: '0.75rem 1.5rem', borderRadius: '6px' }}>Cancel</button>
          <button type="submit" className="btn" style={{ padding: '0.75rem 2.5rem', borderRadius: '6px', fontWeight: 'bold' }}>Save Changes</button>
        </div>
      </form>
    </div>
  );
}

export default ProfileEditor;
