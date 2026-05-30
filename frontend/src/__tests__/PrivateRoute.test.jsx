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

import PrivateRoute from '../components/PrivateRoute';

describe('PrivateRoute', () => {
  test('redirects to login when no user', () => {
    render(
      <BrowserRouter>
        <PrivateRoute>
          <div>Protected Content</div>
        </PrivateRoute>
      </BrowserRouter>
    );
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('renders nothing when not authenticated', () => {
    const { container } = render(
      <BrowserRouter>
        <PrivateRoute>
          <div>Secret</div>
        </PrivateRoute>
      </BrowserRouter>
    );
    expect(container).toBeInTheDocument();
  });
});