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
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };
  })();
  
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('renders form correctly', () => {
    render(<CreateGameForm />);
    expect(screen.getByRole('button', { name: /Create Game/i })).toBeInTheDocument();
  });
  
  it('submits form and creates new game', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: '123' }),
    });
    global.fetch = mockFetch;
    
    render(<CreateGameForm />);
    fireEvent.click(screen.getByRole('button', { name: /Create Game/i }));
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      expect(mockPush).toHaveBeenCalledWith('/games/123');
    });
  });
  
  it('adds new game to recent sessions in localStorage', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: '123' }),
    });
    global.fetch = mockFetch;
    
    render(<CreateGameForm />);
    
    fireEvent.click(screen.getByRole('button', { name: /Create Game/i }));
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalled();
      const recentSessionsCall = localStorageMock.setItem.mock.calls.find(
        call => call[0] === 'recentSessions'
      );
      expect(recentSessionsCall).toBeTruthy();
      
      const savedSessions = JSON.parse(recentSessionsCall[1]);
      expect(savedSessions[0].id).toBe('123');
    });
  });
});
