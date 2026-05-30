import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Haris', email: 'haris@example.com' },
    loading: false,
    logoutUser: jest.fn(),
  }),
}));

jest.mock('../context/ThemeContext', () => ({
  useTheme: () => ({ isDark: false, toggleTheme: jest.fn() }),
}));

jest.mock('../services/api', () => ({
  createNote: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getNote: jest.fn(() => Promise.resolve({ data: { data: { title: 'Test', content: 'Content', category: 'general' } } })),
  updateNote: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getMe: jest.fn(),
  logout: jest.fn(),
}));

jest.mock('../components/Sidebar', () => {
  const Sidebar = ({ children }) => <div data-testid="sidebar">{children}</div>;
  return {
    __esModule: true,
    default: Sidebar,
    categories: [
      { id: 'general', label: 'General', color: '#9ca3af' },
      { id: 'work', label: 'Work', color: '#378ADD' },
      { id: 'personal', label: 'Personal', color: '#639922' },
      { id: 'ideas', label: 'Ideas', color: '#534AB7' },
    ],
  };
});

jest.mock('../utils/theme', () => ({
  getThemeColors: () => ({
    bg: '#f9fafb', cardBg: 'white', cardBorder: '#f3f4f6',
    textPrimary: '#111827', textSecondary: '#6b7280',
    topbarBg: 'white', topbarBorder: '#f3f4f6', inputBorder: '#e5e7eb',
  }),
}));

jest.mock('react-quill-new', () => {
  return function MockQuill({ value, onChange, placeholder }) {
    return (
      <textarea
        data-testid="quill-editor"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    );
  };
});

import NoteEditor from '../pages/NoteEditor';

const renderNoteEditor = () => render(<BrowserRouter><NoteEditor /></BrowserRouter>);

describe('NoteEditor Page', () => {
  test('renders new note heading', () => {
    renderNoteEditor();
    expect(screen.getByText(/new note/i)).toBeInTheDocument();
  });
  test('renders title input', () => {
    renderNoteEditor();
    expect(screen.getByPlaceholderText(/note title/i)).toBeInTheDocument();
  });
  test('renders save note button', () => {
    renderNoteEditor();
    expect(screen.getByText(/save note/i)).toBeInTheDocument();
  });
  test('renders cancel button', () => {
    renderNoteEditor();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });
  test('renders rich text editor', () => {
    renderNoteEditor();
    expect(screen.getByTestId('quill-editor')).toBeInTheDocument();
  });
});