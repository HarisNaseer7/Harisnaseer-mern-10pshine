import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    logoutUser: jest.fn(),
  }),
}));

jest.mock('../services/api', () => ({
  getMe: jest.fn(),
  logout: jest.fn(),
}));

import Navbar from '../components/Navbar';

const renderNavbar = () => render(<BrowserRouter><Navbar /></BrowserRouter>);

describe('Navbar', () => {
  test('renders login link when not logged in', () => {
    renderNavbar();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
  test('renders register link when not logged in', () => {
    renderNavbar();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });
});