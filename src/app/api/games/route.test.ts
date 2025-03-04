/**
 * @jest-environment node
 */
import { POST } from './route';
import db from '@/lib/db';

jest.mock('@/lib/db');

describe('/api/games route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 if game name is not provided', async () => {
    const request = new Request('http://localhost/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'Test description' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Required');
  });

  it('creates a new game and returns 201', async () => {
    const newGame = { id: 'uuid', name: 'Test Game', description: 'Test description' };
    (db.insert as jest.Mock).mockReturnValueOnce({
      values: jest.fn().mockReturnValueOnce({
        returning: jest.fn().mockResolvedValueOnce([newGame])
      })
    });

    const request = new Request('http://localhost/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Game', description: 'Test description' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual(newGame);
  });

  it('returns 500 if there is a server error', async () => {
    (db.insert as jest.Mock).mockReturnValueOnce({
      values: jest.fn().mockReturnValueOnce({
        returning: jest.fn().mockRejectedValueOnce(new Error('Database error'))
      })
    });

    const request = new Request('http://localhost/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Game', description: 'Test description' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});