import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthCallback from '../pages/AuthCallback';
import { useAuth } from '../context/AuthContext';

jest.mock('../context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams],
}));

const mockNavigate = jest.fn();
let mockSearchParams = new URLSearchParams();
const mockLoginUser = jest.fn();

const renderAuthCallback = () =>
  render(<MemoryRouter><AuthCallback /></MemoryRouter>);

beforeEach(() => {
  jest.clearAllMocks();
  useAuth.mockReturnValue({ loginUser: mockLoginUser });
  mockSearchParams = new URLSearchParams();
});

describe('AuthCallback — rendering', () => {
  it('renders without crashing', () => { renderAuthCallback(); });
  it('shows Signing you in... text', () => {
    renderAuthCallback();
    expect(screen.getByText('Signing you in...')).toBeInTheDocument();
  });
});

describe('AuthCallback — with token', () => {
  it('calls loginUser and navigates to dashboard when token present', async () => {
    const payload = { id: '123' };
    const encodedPayload = btoa(JSON.stringify(payload));
    const fakeToken = `header.${encodedPayload}.signature`;
    mockSearchParams = new URLSearchParams(`token=${fakeToken}&name=John&email=john@test.com`);

    renderAuthCallback();

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith(fakeToken, {
        id: '123', name: 'John', email: 'john@test.com',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});

describe('AuthCallback — with error', () => {
  it('navigates to login with error when error param present', async () => {
    mockSearchParams = new URLSearchParams('error=google_failed');
    renderAuthCallback();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login?error=google_failed'));
  });
});

describe('AuthCallback — no token', () => {
  it('navigates to login when no token present', async () => {
    mockSearchParams = new URLSearchParams();
    renderAuthCallback();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'));
  });
});