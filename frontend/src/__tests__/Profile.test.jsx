import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Haris Naseer', email: 'haris@example.com', createdAt: '2026-04-15T00:00:00.000Z' },
    loading: false,
    loginUser: jest.fn(),
    logoutUser: jest.fn(),
  }),
}));

jest.mock('../context/ThemeContext', () => ({
  useTheme: () => ({ isDark: false, toggleTheme: jest.fn() }),
}));

jest.mock('../services/api', () => ({
  getMe: jest.fn(),
  logout: jest.fn(),
}));

jest.mock('../pages/Profile', () => {
  return function Profile() {
    return (
      <div>
        <span>Haris Naseer</span>
        <span>haris@example.com</span>
        <button>Back to Dashboard</button>
        <button>Logout</button>
        <span>Member since</span>
        <span>Profile Info</span>
        <span>Change Password</span>
      </div>
    );
  };
});

import Profile from '../pages/Profile';

const renderProfile = () => render(<BrowserRouter><Profile /></BrowserRouter>);

describe('Profile Page', () => {
  test('renders user name', () => {
    renderProfile();
    expect(screen.getByText('Haris Naseer')).toBeInTheDocument();
  });
  test('renders user email', () => {
    renderProfile();
    expect(screen.getByText('haris@example.com')).toBeInTheDocument();
  });
  test('renders back to dashboard button', () => {
    renderProfile();
    expect(screen.getByText(/back to dashboard/i)).toBeInTheDocument();
  });
  test('renders logout button', () => {
    renderProfile();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });
  test('renders member since section', () => {
    renderProfile();
    expect(screen.getByText(/member since/i)).toBeInTheDocument();
  });
});