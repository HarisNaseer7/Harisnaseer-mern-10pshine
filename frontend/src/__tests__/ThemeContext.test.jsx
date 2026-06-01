import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

const TestComponent = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="isDark">{isDark.toString()}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

const renderWithTheme = () =>
  render(<ThemeProvider><TestComponent /></ThemeProvider>);

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

describe('ThemeContext — rendering', () => {
  it('renders without crashing', () => { renderWithTheme(); });
  it('defaults to light theme', () => {
    renderWithTheme();
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });
  it('isDark is false by default', () => {
    renderWithTheme();
    expect(screen.getByTestId('isDark').textContent).toBe('false');
  });
});

describe('ThemeContext — toggle', () => {
  it('toggles from light to dark', () => {
    renderWithTheme();
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });
  it('isDark is true after toggle', () => {
    renderWithTheme();
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('isDark').textContent).toBe('true');
  });
  it('toggles back to light from dark', () => {
    renderWithTheme();
    fireEvent.click(screen.getByText('Toggle'));
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });
});

describe('ThemeContext — localStorage', () => {
  it('saves theme to localStorage on toggle', () => {
    renderWithTheme();
    fireEvent.click(screen.getByText('Toggle'));
    expect(localStorage.getItem('theme')).toBe('dark');
  });
  it('reads theme from localStorage on mount', () => {
    localStorage.setItem('theme', 'dark');
    renderWithTheme();
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });
});

describe('ThemeContext — data-theme attribute', () => {
  it('sets data-theme on documentElement', () => {
    renderWithTheme();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
  it('updates data-theme on toggle', () => {
    renderWithTheme();
    fireEvent.click(screen.getByText('Toggle'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});