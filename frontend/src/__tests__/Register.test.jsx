import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Register from '../pages/Register';

const renderRegister = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Register />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Register Page', () => {
  test('renders register form', () => {
    renderRegister();
   expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
  });

  test('renders name input', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
  });

  test('renders email input', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });

  test('renders password input', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('renders register button', () => {
    renderRegister();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('renders login link', () => {
    renderRegister();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  test('name input accepts input', () => {
    renderRegister();
    const nameInput = screen.getByPlaceholderText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput.value).toBe('John Doe');
  });

  test('email input accepts input', () => {
    renderRegister();
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    expect(emailInput.value).toBe('john@example.com');
  });

  test('password input accepts input', () => {
    renderRegister();
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    expect(passwordInput.value).toBe('123456');
  });
});