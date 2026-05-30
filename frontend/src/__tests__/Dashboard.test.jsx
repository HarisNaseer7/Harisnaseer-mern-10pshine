import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../services/api', () => ({
  getNotes: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  deleteNote: jest.fn(() => Promise.resolve()),
  pinNote: jest.fn(() => Promise.resolve()),
  archiveNote: jest.fn(() => Promise.resolve()),
  trashNote: jest.fn(() => Promise.resolve()),
  restoreNote: jest.fn(() => Promise.resolve()),
  createNote: jest.fn(() => Promise.resolve()),
}));

jest.mock('../context/AuthContext', () => ({
  ...jest.requireActual('../context/AuthContext'),
  useAuth: () => ({
    user: { name: 'John Doe', email: 'john@example.com', createdAt: new Date().toISOString() },
    loading: false,
    logoutUser: jest.fn(),
  }),
}));

jest.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    isDark: false,
    toggleTheme: jest.fn(),
  }),
}));

jest.mock('../components/Sidebar', () => {
  const Sidebar = ({ children }) => <div data-testid="sidebar">{children}</div>;
  Sidebar.categories = [
    { id: 'work', label: 'Work', color: '#378ADD' },
    { id: 'personal', label: 'Personal', color: '#639922' },
    { id: 'ideas', label: 'Ideas', color: '#534AB7' },
    { id: 'general', label: 'General', color: '#9ca3af' },
  ];
  return {
    __esModule: true,
    default: Sidebar,
    categories: Sidebar.categories,
  };
});

jest.mock('../utils/theme', () => ({
  getThemeColors: () => ({
    bg: '#f9fafb',
    cardBg: 'white',
    cardBorder: '#f3f4f6',
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    topbarBg: 'white',
    topbarBorder: '#f3f4f6',
    inputBorder: '#e5e7eb',
    menuBg: 'white',
  }),
}));

import Dashboard from '../pages/Dashboard';

const renderDashboard = () => {
  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
};

describe('Dashboard Page', () => {
  test('renders New note button', () => {
    renderDashboard();
    expect(screen.getByText(/new note/i)).toBeInTheDocument();
  });

  test('renders All notes title', () => {
    renderDashboard();
    expect(screen.getByText(/all notes/i)).toBeInTheDocument();
  });

  test('renders empty notes message', () => {
    renderDashboard();
    expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument();
  });

  test('renders Import button', () => {
    renderDashboard();
    expect(screen.getByText(/import/i)).toBeInTheDocument();
  });

  test('renders Export button', () => {
    renderDashboard();
    expect(screen.getByText(/export/i)).toBeInTheDocument();
  });
});