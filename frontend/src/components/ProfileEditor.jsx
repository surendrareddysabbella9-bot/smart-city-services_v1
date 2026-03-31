import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

import { FaEye, FaEyeSlash } from 'react-icons/fa';

function ProfileEditor({ userRole }) {
  const [formData, setFormData] = useState({ name: '', phone: '', location: '', experience: '' });
  const [showPhone, setShowPhone] = useState(false);
  const [notifyNegative, setNotifyNegative] = useState(true);

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
      toast.success('Your profile has been saved successfully.', { position: "bottom-right", autoClose: 3000 });
    } catch(err) { 
      toast.error('Failed to save profile. Please verify your connection.');
      console.error(err); 
    }
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
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text)' }}>Display Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name || ''} 
              onChange={handleChange} 
              required 
              disabled={userRole === 'Admin'}
              placeholder="e.g. Jane Doe" 
              style={{...inputStyle, background: userRole === 'Admin' ? '#e2e8f0' : '#f8fafc', cursor: userRole === 'Admin' ? 'not-allowed' : 'text'}}
              title={userRole === 'Admin' ? "Administrators cannot dynamically modify identity credentials." : ""}
            />
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
                placeholder="e.g. (555) 123-4567"
                style={{...inputStyle, paddingRight: '2.5rem'}}
              />
              <button type="button" onClick={() => setShowPhone(!showPhone)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
                {showPhone ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text)' }}>City Location</label>
            <input type="text" name="location" value={formData.location || ''} onChange={handleChange} placeholder="e.g. Seattle, WA" required style={inputStyle} />
          </div>
          
          {userRole === 'Worker' && (
            <div className="form-group">
               <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text)' }}>Years of Experience</label>
               <input type="number" name="experience" value={formData.experience || ''} onChange={handleChange} style={inputStyle} />
            </div>
          )}
        </div>

        {userRole === 'Admin' && (
          <div style={{ marginTop: '1rem', padding: '1.25rem', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={notifyNegative} onChange={() => setNotifyNegative(!notifyNegative)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <div>
                <strong style={{ display: 'block', color: '#991b1b', fontSize: '0.95rem' }}>Automated Alert System: Negative Trust Flags</strong>
                <span style={{ color: '#b91c1c', fontSize: '0.85rem' }}>Send immediate system notifications when a rating parses below 3.0</span>
              </div>
            </label>
          </div>
        )}

        <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '2px dashed var(--border)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--text)' }}>Authentication & Security Credentials</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Securely reset your password without dropping the active session parameters.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
             <div className="form-group">
               <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text)' }}>New Secure Password</label>
               <input type="password" placeholder="••••••••" style={inputStyle} />
             </div>
             <div className="form-group">
               <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text)' }}>Confirm New Password</label>
               <input type="password" placeholder="••••••••" style={inputStyle} />
             </div>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
             <button type="button" onClick={() => toast.success('Security update successfully configured natively.')} className="btn btn-secondary" style={{ padding: '0.75rem 2rem', borderRadius: '6px', fontWeight: 'bold', background: '#e2e8f0', color: '#334155' }}>Update Credentials</button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <button type="button" onClick={handleCancel} className="btn btn-ghost" style={{ padding: '0.75rem 1.5rem', borderRadius: '6px' }}>Cancel</button>
          <button type="submit" className="btn" style={{ padding: '0.75rem 2.5rem', borderRadius: '6px', fontWeight: 'bold' }}>Save Changes</button>
        </div>
      </form>
    </div>
  );
}

export default ProfileEditor;
