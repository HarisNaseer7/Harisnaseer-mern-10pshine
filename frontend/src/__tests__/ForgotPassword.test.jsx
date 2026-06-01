import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForgotPassword from '../pages/ForgotPassword';
import axios from 'axios';

jest.mock('axios', () => ({ post: jest.fn(), create: jest.fn() }));

const renderForgotPassword = () =>
  render(<MemoryRouter><ForgotPassword /></MemoryRouter>);

beforeEach(() => jest.clearAllMocks());

describe('ForgotPassword — rendering', () => {
  it('renders without crashing', () => { renderForgotPassword(); });
  it('shows NoteApp brand', () => {
    renderForgotPassword();
    expect(screen.getByText('NoteApp')).toBeInTheDocument();
  });
  it('shows Forgot password heading', () => {
    renderForgotPassword();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });
  it('renders email input', () => {
    renderForgotPassword();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
  });
  it('renders Send reset link button', () => {
    renderForgotPassword();
    expect(screen.getByText('Send reset link →')).toBeInTheDocument();
  });
  it('renders Back to sign in link', () => {
    renderForgotPassword();
    expect(screen.getByText('← Back to sign in')).toBeInTheDocument();
  });
});

describe('ForgotPassword — form interaction', () => {
  it('updates email field on change', () => {
    renderForgotPassword();
    const input = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(input.value).toBe('test@example.com');
  });
});

describe('ForgotPassword — submit success', () => {
  it('shows success state after successful submit', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    renderForgotPassword();
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByText('Send reset link →'));
    await waitFor(() => expect(screen.getByText('Check your inbox')).toBeInTheDocument());
  });
  it('shows email in success state', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    renderForgotPassword();
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'user@test.com' },
    });
    fireEvent.click(screen.getByText('Send reset link →'));
    await waitFor(() => expect(screen.getByText(/user@test.com/)).toBeInTheDocument());
  });
  it('shows Sending... while loading', async () => {
    axios.post.mockImplementation(() => new Promise(() => {}));
    renderForgotPassword();
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByText('Send reset link →'));
    await waitFor(() => expect(screen.getByText('Sending...')).toBeInTheDocument());
  });
  it('shows try again button on success', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    renderForgotPassword();
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'a@b.com' },
    });
    fireEvent.click(screen.getByText('Send reset link →'));
    await waitFor(() => expect(screen.getByText('try again')).toBeInTheDocument());
  });
  it('resets form when try again is clicked', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    renderForgotPassword();
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'a@b.com' },
    });
    fireEvent.click(screen.getByText('Send reset link →'));
    await waitFor(() => screen.getByText('try again'));
    fireEvent.click(screen.getByText('try again'));
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });
});

describe('ForgotPassword — submit error', () => {
  it('shows error message on failure', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { message: 'User not found' } } });
    renderForgotPassword();
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'bad@test.com' },
    });
    fireEvent.click(screen.getByText('Send reset link →'));
    await waitFor(() => expect(screen.getByText('User not found')).toBeInTheDocument());
  });
  it('shows fallback error when no message', async () => {
    axios.post.mockRejectedValueOnce({});
    renderForgotPassword();
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByText('Send reset link →'));
    await waitFor(() => expect(screen.getByText('Something went wrong. Try again.')).toBeInTheDocument());
  });
});