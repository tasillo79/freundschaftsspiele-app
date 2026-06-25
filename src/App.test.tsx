import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders name gate for unauthenticated users', () => {
  render(<App />);
  const heading = screen.getByText(/WM 2026 Tippspiel/i);
  expect(heading).toBeInTheDocument();
});
