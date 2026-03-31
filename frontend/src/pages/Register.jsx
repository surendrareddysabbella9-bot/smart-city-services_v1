import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaHardHat, FaLock } from 'react-icons/fa';
import api from '../services/api';

function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'Customer',
    category: 'Electrician', experience: '', location: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify your typed inputs.');
      return;
    }
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed.');
    }
  };

  const inputStyle = { width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.95rem' };
  const labelStyle = { display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#334155', fontSize: '0.9rem' };

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', padding: '3rem 1rem' }}>
      <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', background: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '0.5rem' }}>Create an account</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>Join 15,000+ validated professionals and citizens today.</p>
        </div>
        
        {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem', border: '1px solid #f87171' }}>{error}</div>}
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <label style={labelStyle}>Select your Account Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: formData.role === 'Customer' ? '2px solid var(--primary)' : '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', background: formData.role === 'Customer' ? '#eff6ff' : 'white' }}>
                 <input type="radio" name="role" value="Customer" checked={formData.role === 'Customer'} onChange={handleChange} style={{ display: 'none' }} />
                 <FaUser size={20} color={formData.role === 'Customer' ? 'var(--primary)' : '#64748b'} />
                 <span style={{ fontWeight: formData.role === 'Customer' ? 'bold' : '500', color: formData.role === 'Customer' ? 'var(--primary)' : '#334155' }}>Citizen / Client</span>
               </label>
               <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: formData.role === 'Worker' ? '2px solid var(--primary)' : '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', background: formData.role === 'Worker' ? '#eff6ff' : 'white' }}>
                 <input type="radio" name="role" value="Worker" checked={formData.role === 'Worker'} onChange={handleChange} style={{ display: 'none' }} />
                 <FaHardHat size={20} color={formData.role === 'Worker' ? 'var(--primary)' : '#64748b'} />
                 <span style={{ fontWeight: formData.role === 'Worker' ? 'bold' : '500', color: formData.role === 'Worker' ? 'var(--primary)' : '#334155' }}>Professional</span>
               </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             <div>
               <label style={labelStyle}>Full Name</label>
               <input type="text" name="name" onChange={handleChange} required style={inputStyle} placeholder="e.g. John Doe" />
             </div>
             <div>
               <label style={labelStyle}>Phone Number <span style={{ color: '#94a3b8', fontWeight: 'normal', fontSize: '0.8rem' }}>(e.g. +1 555-0192)</span></label>
               <input type="text" name="phone" onChange={handleChange} required style={inputStyle} placeholder="Required for context" />
             </div>
          </div>

          <div>
             <label style={labelStyle}>Email Address</label>
             <input type="email" name="email" onChange={handleChange} required style={inputStyle} placeholder="name@domain.com" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             <div>
               <label style={labelStyle}>Master Password</label>
               <div style={{ position: 'relative' }}>
                 <input type={showPassword ? "text" : "password"} name="password" onChange={handleChange} required style={{...inputStyle, paddingRight: '2.5rem'}} placeholder="••••••••" />
                 <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                   {showPassword ? <FaEyeSlash /> : <FaEye />}
                 </button>
               </div>
             </div>
             <div>
               <label style={labelStyle}>Confirm Password</label>
               <div style={{ position: 'relative' }}>
                 <input type={showConfirm ? "text" : "password"} name="confirmPassword" onChange={handleChange} required style={{...inputStyle, paddingRight: '2.5rem'}} placeholder="••••••••" />
                 <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                   {showConfirm ? <FaEyeSlash /> : <FaEye />}
                 </button>
               </div>
             </div>
          </div>

          {formData.role === 'Worker' && (
            <>
              <div style={{ height: '1px', background: '#e2e8f0', margin: '0.5rem 0' }}></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                 <div>
                   <label style={labelStyle}>Service Category</label>
                   <select name="category" onChange={handleChange} value={formData.category} style={inputStyle}>
                     <option value="Electrician">Electrician</option>
                     <option value="Plumber">Plumber</option>
                     <option value="Painter">Painter</option>
                     <option value="Construction Worker">Construction Worker</option>
                     <option value="Maintenance Worker">Facilities / Maintenance</option>
                   </select>
                 </div>
                 <div>
                   <label style={labelStyle}>Total Experience (Years)</label>
                   <input type="number" name="experience" onChange={handleChange} required style={inputStyle} min="0" placeholder="e.g. 5" />
                 </div>
              </div>
            </>
          )}
          
          <div>
             <label style={labelStyle}>{formData.role === 'Worker' ? 'Operational City' : 'Your Primary City (To locate nearby pros)'}</label>
             <input type="text" name="location" onChange={handleChange} required style={inputStyle} placeholder="e.g. San Francisco, CA" />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.5rem' }}>
             <FaLock color="#10b981" style={{ marginTop: '0.15rem' }} />
             <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: '1.4' }}>
               <strong>Privacy Secured:</strong> We never share your personal phone number or email publicly without an explicitly accepted network contract.
             </p>
          </div>

          <button type="submit" className="btn" style={{ width: '100%', padding: '0.85rem', fontSize: '1.05rem', fontWeight: 'bold', marginTop: '0.5rem', borderRadius: '6px' }}>Complete Registration</button>
        </form>

        <p style={{ textAlign: 'center', margin: '1.5rem 0 0 0', fontSize: '0.95rem', color: '#64748b' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
