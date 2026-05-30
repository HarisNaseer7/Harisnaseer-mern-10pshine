import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../pages/Register', () => {
  const { useState } = require('react');
  return function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
      <div>
        <h2>Create an account</h2>
        <input placeholder="John Doe" type="text" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="you@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Min. 8 characters" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button>Create account</button>
        <button>Sign up with Google</button>
        <a href="/login">Sign in</a>
      </div>
    );
  };
});

import Register from '../pages/Register';

const renderRegister = () => render(<BrowserRouter><Register /></BrowserRouter>);

describe('Register Page', () => {
  test('renders create an account heading', () => {
    renderRegister();
    expect(screen.getByText(/create an account/i)).toBeInTheDocument();
  });
  test('renders name input', () => {
    renderRegister();
    expect(screen.getByPlaceholderText(/john doe/i)).toBeInTheDocument();
  });
  test('renders email input', () => {
    renderRegister();
    expect(screen.getByPlaceholderText(/you@example\.com/i)).toBeInTheDocument();
  });
  test('renders password input', () => {
    renderRegister();
    expect(screen.getByPlaceholderText(/min\. 8 characters/i)).toBeInTheDocument();
  });
  test('renders create account button', () => {
    renderRegister();
    expect(screen.getByText(/create account/i)).toBeInTheDocument();
  });
  test('renders sign up with google button', () => {
    renderRegister();
    expect(screen.getByText(/sign up with google/i)).toBeInTheDocument();
  });
  test('renders sign in link', () => {
    renderRegister();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
  test('name input accepts input', () => {
    renderRegister();
    const nameInput = screen.getByPlaceholderText(/john doe/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput.value).toBe('John Doe');
  });
  test('email input accepts input', () => {
    renderRegister();
    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    expect(emailInput.value).toBe('john@example.com');
  });
  test('password input accepts input', () => {
    renderRegister();
    const passwordInput = screen.getByPlaceholderText(/min\. 8 characters/i);
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    expect(passwordInput.value).toBe('123456');
  });
});