import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || '212.132.120.105',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'lI6kCZgP',
  database: process.env.DATABASE_NAME || 'aimlib',
  enableKeepAlive: true,
});

export const db = drizzle(pool);
