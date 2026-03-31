import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle, FaLinkedin } from 'react-icons/fa';
import api from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const user = res.data.user;
      if (user.role === 'Admin') navigate('/dashboard/admin');
      else if (user.role === 'Worker') navigate('/dashboard/worker');
      else navigate('/dashboard/customer');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Authentication sequence failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '1rem' };

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', background: 'white' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.75rem', color: '#0f172a' }}>Welcome back</h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem', fontSize: '0.95rem' }}>Enter your credentials to access your dashboard</p>
        
        {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem', border: '1px solid #f87171' }}>{error}</div>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} placeholder="name@example.com" />
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
               <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>Password</label>
               <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: '500', textDecoration: 'none' }}>Forgot Password?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required style={{...inputStyle, paddingRight: '2.5rem'}} placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <input type="checkbox" id="remember" style={{ cursor: 'pointer' }} />
             <label htmlFor="remember" style={{ fontSize: '0.9rem', color: '#475569', cursor: 'pointer' }}>Remember me for 30 days</label>
          </div>

          <button type="submit" disabled={loading} className="btn" style={{ width: '100%', padding: '0.85rem', fontSize: '1.05rem', fontWeight: 'bold', marginTop: '0.5rem', borderRadius: '6px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Authenticating...' : 'Sign in'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', color: '#94a3b8' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
          <span style={{ padding: '0 1rem', fontSize: '0.85rem' }}>Or continue with</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
           <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#334155', fontWeight: '600', cursor: 'pointer' }}>
             <FaGoogle color="#ea4335" /> Google
           </button>
           <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#334155', fontWeight: '600', cursor: 'pointer' }}>
             <FaLinkedin color="#0a66c2" /> LinkedIn
           </button>
        </div>

        <p style={{ textAlign: 'center', margin: 0, fontSize: '0.95rem', color: '#64748b' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
