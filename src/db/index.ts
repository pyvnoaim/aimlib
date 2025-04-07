import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';

const connection = await mysql.createConnection({
  host: '212.132.120.105',
  user: 'root',
  password: 'lI6kCZgP',
  database: 'aimlib',
});

export const db = drizzle(connection);
