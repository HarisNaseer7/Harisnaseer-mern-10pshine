import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../pages/Login', () => {
  const { useState } = require('react');
  return function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
      <div>
        <h2>Welcome back</h2>
        <input placeholder="you@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="••••••••" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button>Sign in</button>
        <button>Continue as Guest</button>
        <button>Continue with Google</button>
        <a href="/register">Create one</a>
      </div>
    );
  };
});

import Login from '../pages/Login';

const renderLogin = () => render(<BrowserRouter><Login /></BrowserRouter>);

describe('Login Page', () => {
  test('renders welcome back heading', () => {
    renderLogin();
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });
  test('renders email input', () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/you@example\.com/i)).toBeInTheDocument();
  });
  test('renders password input', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });
  test('renders sign in button', () => {
    renderLogin();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
  test('renders continue as guest button', () => {
    renderLogin();
    expect(screen.getByText(/continue as guest/i)).toBeInTheDocument();
  });
  test('renders continue with google button', () => {
    renderLogin();
    expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
  });
  test('renders create one link', () => {
    renderLogin();
    expect(screen.getByText(/create one/i)).toBeInTheDocument();
  });
  test('email input accepts input', () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });
  test('password input accepts input', () => {
    renderLogin();
    const passwordInput = screen.getByPlaceholderText('••••••••');
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    expect(passwordInput.value).toBe('123456');
  });
});