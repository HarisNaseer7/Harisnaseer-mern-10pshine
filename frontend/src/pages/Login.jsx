import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const features = [
  { label: 'End-to-end encrypted notes', icon: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7f77dd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  )},
  { label: 'Sync across all devices', icon: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7f77dd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/></svg>
  )},
  { label: 'Instant search & tagging', icon: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7f77dd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  )},
];

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(formData);
      loginUser(res.data.data.token, res.data.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>

      {/* Left Panel — fully inline styles, no Tailwind */}
      <div style={{
        width: '44%',
        background: '#0f1117',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }} />

        {/* Glow — top right */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '300px',
          height: '300px',
          background: 'rgba(83,74,183,0.2)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
          <div style={{
            width: '36px', height: '36px', background: 'white',
            borderRadius: '10px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 700, fontSize: '16px', color: '#0f1117',
          }}>N</div>
          <span style={{ color: 'white', fontSize: '17px', fontWeight: 500 }}>NoteApp</span>
        </div>

        {/* Headline */}
        <div style={{ zIndex: 1 }}>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 500, lineHeight: 1.35, marginBottom: '12px' }}>
            Clarity comes from<br />
            <span style={{ color: '#7f77dd' }}>focus</span>, not chaos.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: 1.7 }}>
            Your thoughts, organized beautifully.<br />
            Write, structure, and find anything — fast.
          </p>
        </div>

        {/* Feature badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 1 }}>
          {features.map(({ label, icon }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', padding: '9px 14px',
            }}>
              {icon}
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>{label}</span>
            </div>
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '11px', zIndex: 1 }}>
          © 2026 NoteApp. All rights reserved.
        </p>
      </div>

      {/* Right Panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '32px', background: 'white',
      }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>

          {/* Greeting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              background: '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px' }}>Good to see you again</p>
              <p style={{ fontSize: '22px', fontWeight: 600, color: '#111827' }}>Welcome back</p>
            </div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', padding: '11px 16px', background: 'white',
              border: '1px solid #e5e7eb', borderRadius: '10px',
              fontSize: '14px', fontWeight: 500, color: '#374151',
              cursor: 'pointer', marginBottom: '20px',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: '#f3f4f6' }} />
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>or sign in with email</span>
            <div style={{ flex: 1, height: '1px', background: '#f3f4f6' }} />
          </div>

          {error && (
            <div style={{
              background: '#fef2f2', color: '#dc2626', padding: '12px 16px',
              borderRadius: '8px', fontSize: '13px', marginBottom: '16px',
            }}>{error}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block', fontSize: '11px', fontWeight: 600,
                color: '#6b7280', textTransform: 'uppercase',
                letterSpacing: '0.05em', marginBottom: '6px',
              }}>Email address</label>
              <input
                type="email" name="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange} required
                style={{
                  width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb',
                  borderRadius: '10px', fontSize: '14px', background: '#f9fafb',
                  color: '#111827', outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = '#7f77dd'; e.target.style.boxShadow = '0 0 0 3px rgba(127,119,221,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{
                  fontSize: '11px', fontWeight: 600, color: '#6b7280',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '12px', color: '#7f77dd', textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>
              <input
                type="password" name="password" placeholder="••••••••"
                value={formData.password} onChange={handleChange} required
                style={{
                  width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb',
                  borderRadius: '10px', fontSize: '14px', background: '#f9fafb',
                  color: '#111827', outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = '#7f77dd'; e.target.style.boxShadow = '0 0 0 3px rgba(127,119,221,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '11px', background: '#0f1117',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#534AB7'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0f1117'; }}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#f3f4f6' }} />
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#f3f4f6' }} />
          </div>

          <button
            onClick={() => navigate('/guest')}
            style={{
              width: '100%', padding: '11px', background: 'transparent',
              border: '1px solid #e5e7eb', borderRadius: '10px',
              fontSize: '14px', color: '#6b7280', cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Continue as Guest
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af', marginTop: '20px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#7f77dd', fontWeight: 600, textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;