import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

 const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm)
      return setMessage('Passwords do not match');
    if (password.length < 6)
      return setMessage('Password must be at least 6 characters');

    setLoading(true);
    setMessage('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, { token, password });
      setStatus('success');
      setMessage('Password reset! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Invalid or expired link. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb',
    borderRadius: '10px', fontSize: '14px', background: '#f9fafb',
    color: '#111827', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
      <div style={{ width: '100%', maxWidth: '360px', padding: '0 24px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', justifyContent: 'center' }}>
          <div style={{ width: '36px', height: '36px', background: '#0f1117', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '16px' }}>N</div>
          <span style={{ fontSize: '17px', fontWeight: 600, color: '#0f1117' }}>NoteApp</span>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>Set new password</h2>
        <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '28px', lineHeight: 1.6 }}>
          Choose a strong password at least 6 characters long.
        </p>

        {message && (
          <div style={{
            padding: '12px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px',
            background: status === 'success' ? '#f0fdf4' : '#fef2f2',
            color: status === 'success' ? '#16a34a' : '#dc2626',
          }}>{message}</div>
        )}

        {status !== 'success' && (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                New password
              </label>
              <input
                type="password" placeholder="Min. 6 characters"
                value={password} onChange={e => setPassword(e.target.value)} required
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#7f77dd'; e.target.style.boxShadow = '0 0 0 3px rgba(127,119,221,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Confirm password
              </label>
              <input
                type="password" placeholder="Re-enter password"
                value={confirm} onChange={e => setConfirm(e.target.value)} required
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#7f77dd'; e.target.style.boxShadow = '0 0 0 3px rgba(127,119,221,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '11px', background: '#0f1117', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#534AB7'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0f1117'; }}
            >
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af', marginTop: '24px' }}>
          <Link to="/login" style={{ color: '#7f77dd', fontWeight: 600, textDecoration: 'none' }}>
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;