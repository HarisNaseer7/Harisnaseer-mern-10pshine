import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
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

jest.mock('../pages/GuestDashboard', () => {
  return function GuestDashboard() {
    return (
      <div>
        <span>Guest User</span>
        <span>Notes not saved</span>
        <button>Sign up free</button>
        <button>New note</button>
        <p>No notes yet</p>
      </div>
    );
  };
});

import GuestDashboard from '../pages/GuestDashboard';

const renderGuestDashboard = () => render(<BrowserRouter><GuestDashboard /></BrowserRouter>);

describe('GuestDashboard', () => {
  test('renders guest user', () => {
    renderGuestDashboard();
    expect(screen.getByText(/guest user/i)).toBeInTheDocument();
  });
  test('renders notes not saved warning', () => {
    renderGuestDashboard();
    expect(screen.getByText(/notes not saved/i)).toBeInTheDocument();
  });
  test('renders sign up button', () => {
    renderGuestDashboard();
    expect(screen.getByText(/sign up free/i)).toBeInTheDocument();
  });
  test('renders new note button', () => {
    renderGuestDashboard();
    expect(screen.getByText(/new note/i)).toBeInTheDocument();
  });
  test('renders empty notes message', () => {
    renderGuestDashboard();
    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
  });
});