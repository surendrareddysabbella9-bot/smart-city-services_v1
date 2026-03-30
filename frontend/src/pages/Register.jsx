import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', role: 'Customer',
    category: 'Electrician', experience: '', location: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <h2>Create an account</h2>
        {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="form-group"><label>Name</label><input type="text" name="name" onChange={handleChange} required /></div>
          <div className="form-group"><label>Email</label><input type="email" name="email" onChange={handleChange} required /></div>
          <div className="form-group"><label>Phone</label><input type="text" name="phone" onChange={handleChange} required /></div>
          <div className="form-group"><label>Password</label><input type="password" name="password" onChange={handleChange} required /></div>
          <div className="form-group">
            <label>Role</label>
            <select name="role" onChange={handleChange} value={formData.role}>
              <option value="Customer">Customer</option>
              <option value="Worker">Worker</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          {formData.role === 'Worker' && (
            <>
              <div className="form-group">
                <label>Service Category</label>
                <select name="category" onChange={handleChange} value={formData.category}>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Painter">Painter</option>
                  <option value="Construction Worker">Construction Worker</option>
                  <option value="Maintenance Worker">Maintenance Worker</option>
                </select>
              </div>
              <div className="form-group"><label>Experience (Years)</label><input type="number" name="experience" onChange={handleChange} required /></div>
              <div className="form-group"><label>Location</label><input type="text" name="location" onChange={handleChange} required /></div>
            </>
          )}
          <button type="submit" className="btn">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
