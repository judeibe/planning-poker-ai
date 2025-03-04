import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CreateGameForm } from './CreateGameForm';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('CreateGameForm', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders form fields correctly', () => {
    render(<CreateGameForm />);
    expect(screen.getByLabelText(/Game Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Game/i })).toBeInTheDocument();
  });

  it('shows validation error when game name is not provided', async () => {
    render(<CreateGameForm />);
    fireEvent.click(screen.getByRole('button', { name: /Create Game/i }));
    await waitFor(() => {
      expect(screen.getByText(/Game name is required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: '123' }),
    });
    global.fetch = mockFetch;

    render(<CreateGameForm />);
    
    fireEvent.change(screen.getByLabelText(/Game Name/i), {
      target: { value: 'Test Game' },
    });
    
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Test Description' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Create Game/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Game',
          description: 'Test Description',
        }),
      });
      expect(mockPush).toHaveBeenCalledWith('/games/123');
    });
  });
});
