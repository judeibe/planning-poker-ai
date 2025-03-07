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

  it('creates a new game with empty data', async () => {
    const newGame = { id: 'uuid', description: null };
    
    (db.insert as jest.Mock).mockReturnValueOnce({
      values: jest.fn().mockReturnValueOnce({
        returning: jest.fn().mockResolvedValueOnce([newGame])
      })
    });
    
    const request = new Request('http://localhost/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data).toEqual(newGame);
  });

  it('creates a new game with description only', async () => {
    const newGame = { id: 'uuid', description: 'Test description' };
    
    (db.insert as jest.Mock).mockReturnValueOnce({
      values: jest.fn().mockReturnValueOnce({
        returning: jest.fn().mockResolvedValueOnce([newGame])
      })
    });
    
    const request = new Request('http://localhost/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'Test description' }),
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
      body: JSON.stringify({ description: 'Test description' }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});