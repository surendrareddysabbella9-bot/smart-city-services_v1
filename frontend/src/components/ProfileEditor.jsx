import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ProfileEditor({ userRole }) {
  const [formData, setFormData] = useState({ name: '', phone: '', location: '', experience: '' });
  const [success, setSuccess] = useState('');

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
      setSuccess('Profile metrics successfully updated across the database!');
      setTimeout(() => setSuccess(''), 4000);
    } catch(err) { console.error(err); }
  };

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>Edit Your Profile</h3>
      {success && <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>{success}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
        <div className="form-group"><label>Display Name</label><input type="text" name="name" value={formData.name || ''} onChange={handleChange} required /></div>
        <div className="form-group"><label>Phone Number</label><input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} required /></div>
        <div className="form-group"><label>City Location</label><input type="text" name="location" value={formData.location || ''} onChange={handleChange} required /></div>
        {userRole === 'Worker' && <div className="form-group"><label>Years of Experience</label><input type="number" name="experience" value={formData.experience || ''} onChange={handleChange} /></div>}
        <button type="submit" className="btn" style={{ gridColumn: '1 / -1' }}>Save Changes</button>
      </form>
    </div>
  );
}

export default ProfileEditor;
