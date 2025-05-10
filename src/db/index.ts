import mysql from 'mysql2/promise'
import { drizzle } from 'drizzle-orm/mysql2'
import 'dotenv/config'

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  enableKeepAlive: true,
  connectTimeout: 10000,
})

// Test the connection
pool
  .getConnection()
  .then((connection) => {
    console.log('Database connection established successfully')
    connection.release()
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err)
    process.exit(1) // Exit if we can't connect to the database
  })

export const db = drizzle(pool)
