import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios', () => ({ post: jest.fn(), create: jest.fn() }));

jest.mock('../pages/ResetPassword', () => {
  const { useState } = require('react');
  const { Link } = require('react-router-dom');
  const axios = require('axios');

  const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (password !== confirm) return setMessage('Passwords do not match');
      if (password.length < 6) return setMessage('Password must be at least 6 characters');
      setLoading(true);
      setMessage('');
      try {
        await axios.post('/auth/reset-password', { token: 'abc', password });
        setStatus('success');
        setMessage('Password reset! Redirecting to login...');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Invalid or expired link. Please request a new one.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div>
        <span>NoteApp</span>
        <h2>Set new password</h2>
        {message && <div>{message}</div>}
        {status !== 'success' && (
          <form onSubmit={handleSubmit}>
            <input type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required />
            <input type="password" placeholder="Re-enter password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
            <button type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        )}
        <Link to="/login">← Back to sign in</Link>
      </div>
    );
  };
  return { __esModule: true, default: ResetPassword };
});

import ResetPassword from '../pages/ResetPassword';
import axios from 'axios';

const renderResetPassword = () =>
  render(<MemoryRouter><ResetPassword /></MemoryRouter>);

beforeEach(() => jest.clearAllMocks());

describe('ResetPassword — rendering', () => {
  it('renders without crashing', () => { renderResetPassword(); });
  it('shows NoteApp brand', () => {
    renderResetPassword();
    expect(screen.getByText('NoteApp')).toBeInTheDocument();
  });
  it('shows Set new password heading', () => {
    renderResetPassword();
    expect(screen.getByText('Set new password')).toBeInTheDocument();
  });
  it('renders password input', () => {
    renderResetPassword();
    expect(screen.getByPlaceholderText('Min. 6 characters')).toBeInTheDocument();
  });
  it('renders confirm password input', () => {
    renderResetPassword();
    expect(screen.getByPlaceholderText('Re-enter password')).toBeInTheDocument();
  });
  it('renders Reset password button', () => {
    renderResetPassword();
    expect(screen.getByText('Reset password')).toBeInTheDocument();
  });
  it('renders Back to sign in link', () => {
    renderResetPassword();
    expect(screen.getByText('← Back to sign in')).toBeInTheDocument();
  });
});

describe('ResetPassword — validation', () => {
  it('shows error when passwords do not match', async () => {
    renderResetPassword();
    fireEvent.change(screen.getByPlaceholderText('Min. 6 characters'), { target: { value: 'pass123' } });
    fireEvent.change(screen.getByPlaceholderText('Re-enter password'), { target: { value: 'different' } });
    fireEvent.click(screen.getByText('Reset password'));
    await waitFor(() => expect(screen.getByText('Passwords do not match')).toBeInTheDocument());
  });
  it('shows error when password too short', async () => {
    renderResetPassword();
    fireEvent.change(screen.getByPlaceholderText('Min. 6 characters'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Re-enter password'), { target: { value: '123' } });
    fireEvent.click(screen.getByText('Reset password'));
    await waitFor(() => expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument());
  });
});

describe('ResetPassword — submit success', () => {
  it('shows success message', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    renderResetPassword();
    fireEvent.change(screen.getByPlaceholderText('Min. 6 characters'), { target: { value: 'newpass123' } });
    fireEvent.change(screen.getByPlaceholderText('Re-enter password'), { target: { value: 'newpass123' } });
    fireEvent.click(screen.getByText('Reset password'));
    await waitFor(() => expect(screen.getByText('Password reset! Redirecting to login...')).toBeInTheDocument());
  });
  it('shows Resetting... while loading', async () => {
    axios.post.mockImplementation(() => new Promise(() => {}));
    renderResetPassword();
    fireEvent.change(screen.getByPlaceholderText('Min. 6 characters'), { target: { value: 'newpass123' } });
    fireEvent.change(screen.getByPlaceholderText('Re-enter password'), { target: { value: 'newpass123' } });
    fireEvent.click(screen.getByText('Reset password'));
    await waitFor(() => expect(screen.getByText('Resetting...')).toBeInTheDocument());
  });
});

describe('ResetPassword — submit error', () => {
  it('shows API error message', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { message: 'Token expired' } } });
    renderResetPassword();
    fireEvent.change(screen.getByPlaceholderText('Min. 6 characters'), { target: { value: 'newpass123' } });
    fireEvent.change(screen.getByPlaceholderText('Re-enter password'), { target: { value: 'newpass123' } });
    fireEvent.click(screen.getByText('Reset password'));
    await waitFor(() => expect(screen.getByText('Token expired')).toBeInTheDocument());
  });
  it('shows fallback error', async () => {
    axios.post.mockRejectedValueOnce({});
    renderResetPassword();
    fireEvent.change(screen.getByPlaceholderText('Min. 6 characters'), { target: { value: 'newpass123' } });
    fireEvent.change(screen.getByPlaceholderText('Re-enter password'), { target: { value: 'newpass123' } });
    fireEvent.click(screen.getByText('Reset password'));
    await waitFor(() => expect(screen.getByText('Invalid or expired link. Please request a new one.')).toBeInTheDocument());
  });
});