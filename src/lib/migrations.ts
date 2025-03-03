import db from './db';
import { migrate } from 'drizzle-orm/node-postgres';

// Run migrations
async function runMigrations() {
  await migrate(db, { migrationsFolder: './migrations' });
}

runMigrations().catch((err) => {
  console.error('Migration failed', err);
  process.exit(1);
});
