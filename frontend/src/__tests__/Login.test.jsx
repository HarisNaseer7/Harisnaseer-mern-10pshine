import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from '../pages/Login';

const renderLogin = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Page', () => {
  test('renders login form', () => {
    renderLogin();
   expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });

  test('renders email input', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });

  test('renders password input', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('renders login button', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('renders register link', () => {
    renderLogin();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  test('renders guest button', () => {
    renderLogin();
    expect(screen.getByText(/continue as guest/i)).toBeInTheDocument();
  });

  test('email input accepts input', () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  test('password input accepts input', () => {
    renderLogin();
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    expect(passwordInput.value).toBe('123456');
  });
});