"use server";

import db, { games } from "@/lib/db";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createGame(data: FormData) {
    try {
       const newGame = await db.insert(games).values({}).returning();
       
       return NextResponse.json(newGame[0], { status: 201 });
    } catch (error) {
        console.error('Error creating game:', error);
       return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
        );
    }
}