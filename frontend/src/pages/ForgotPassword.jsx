import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    setMessage('');
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Response:', res.data);
      setStatus('success');
      setMessage(email); // store email to show in success state
    } catch (err) {
      console.log('Error:', err.response?.data);
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
      <div style={{ width: '100%', maxWidth: '360px', padding: '0 24px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', justifyContent: 'center' }}>
          <div style={{ width: '36px', height: '36px', background: '#0f1117', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '16px' }}>N</div>
          <span style={{ fontSize: '17px', fontWeight: 600, color: '#0f1117' }}>NoteApp</span>
        </div>

        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: status === 'success' ? '#f0fdf4' : '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {status === 'success' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            )}
          </div>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#111827', marginBottom: '8px', textAlign: 'center' }}>
          {status === 'success' ? 'Check your inbox' : 'Forgot password?'}
        </h2>
        <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '28px', lineHeight: 1.6, textAlign: 'center' }}>
          {status === 'success'
            ? 'We sent a password reset link to'
            : "Enter your email and we'll send you a reset link."}
        </p>

        {/* Show email badge on success */}
        {status === 'success' && (
          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: '10px', padding: '12px 16px',
            textAlign: 'center', marginBottom: '20px',
          }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#15803d' }}>
              📬 {message}
            </span>
          </div>
        )}

        {/* Error message */}
        {status === 'error' && message && (
          <div style={{
            padding: '12px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px',
            background: '#fef2f2', color: '#dc2626', textAlign: 'center',
          }}>{message}</div>
        )}

        {/* Form */}
        {status !== 'success' && (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block', fontSize: '11px', fontWeight: 600,
                color: '#6b7280', textTransform: 'uppercase',
                letterSpacing: '0.05em', marginBottom: '6px'
              }}>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb',
                  borderRadius: '10px', fontSize: '14px', background: '#f9fafb',
                  color: '#111827', outline: 'none', boxSizing: 'border-box'
                }}
                onFocus={e => { e.target.style.borderColor = '#7f77dd'; e.target.style.boxShadow = '0 0 0 3px rgba(127,119,221,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '11px', background: '#0f1117',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '14px', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#534AB7'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0f1117'; }}
            >
              {loading ? 'Sending...' : 'Send reset link →'}
            </button>
          </form>
        )}

        {/* Try again */}
        {status === 'success' && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ fontSize: '13px', color: '#9ca3af' }}>
              Didn't receive it? Check your spam folder or{' '}
              <button
                onClick={() => { setStatus(''); setMessage(''); setEmail(''); }}
                style={{ background: 'none', border: 'none', color: '#7f77dd', fontWeight: 600, fontSize: '13px', cursor: 'pointer', padding: 0 }}
              >
                try again
              </button>
            </p>
          </div>
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

export default ForgotPassword;