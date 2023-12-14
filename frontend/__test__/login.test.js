import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { LoginSignup } from '../src/Components/LoginSignup/LoginSignup';

afterEach(() => {
    jest.restoreAllMocks();
  });
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('LoginSignup Component', () => {
  test('renders login form with input fields', () => {
    const { getByPlaceholderText, getByText } = render(<LoginSignup />);
    expect(getByText('Welcome back!')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(getByText('Login')).toBeInTheDocument();
  });

  test('handles user input correctly', () => {
    const { getByPlaceholderText } = render(<LoginSignup />);
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('triggers login function on button click', () => {
    const { getByText } = render(<LoginSignup />);
    const loginButton = getByText('Login');
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => ({ userId: '123' }) });
    fireEvent.click(loginButton);
    expect(global.fetch).toHaveBeenCalled();
  });

  test('displays error popup on login failure', async () => {
    const { getByText, findByText } = render(<LoginSignup />);
    const loginButton = getByText('Login');
    global.fetch = jest.fn().mockResolvedValue({ ok: false });
    fireEvent.click(loginButton);
    const errorPopup = await findByText('Invalid email or password. Please try again.');
    expect(errorPopup).toBeInTheDocument();
  });
});
