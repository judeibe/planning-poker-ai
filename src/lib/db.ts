import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Drizzle with the connection pool
const db = drizzle(pool);

// Define the Games table schema
export const games = pgTable('games', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'), // Removed .notNull()
  description: text('description'),
});

export default db;
