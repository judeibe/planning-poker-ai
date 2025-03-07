import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { games } from '@/lib/db';
import { z } from 'zod';

// Simplified schema without name field requirement
const createGameSchema = z.object({
  description: z.string().optional(),
});

export type NewGameResponse = typeof games.$inferSelect;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = createGameSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const { description } = result.data;
    
    // No name field needed
    const newGame = await db.insert(games).values({ 
      description 
    }).returning();
    
    return NextResponse.json(newGame[0], { status: 201 });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}