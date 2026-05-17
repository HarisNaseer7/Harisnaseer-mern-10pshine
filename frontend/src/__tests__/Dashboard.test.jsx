import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Dashboard from '../pages/Dashboard';

jest.mock('../services/api', () => ({
  getNotes: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  deleteNote: jest.fn(() => Promise.resolve()),
}));

jest.mock('../context/AuthContext', () => ({
  ...jest.requireActual('../context/AuthContext'),
  useAuth: () => ({
    user: { name: 'John Doe', email: 'john@example.com' },
    loading: false,
    logoutUser: jest.fn(),
  }),
}));

const renderDashboard = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Page', () => {
  test('renders welcome message', () => {
    renderDashboard();
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  test('renders create note button', () => {
    renderDashboard();
    expect(screen.getByText(/create new note/i)).toBeInTheDocument();
  });

  test('renders my notes section', () => {
    renderDashboard();
    expect(screen.getByText(/my notes/i)).toBeInTheDocument();
  });

  test('renders empty notes message', () => {
    renderDashboard();
    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
  });

  test('renders user name', () => {
    renderDashboard();
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });
});