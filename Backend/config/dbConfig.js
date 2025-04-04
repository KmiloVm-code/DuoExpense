import pg from 'pg'

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DATABASE,
  ssl:
    process.env.DB_SSL === 'true'
      ? { require: true, rejectUnauthorized: false }
      : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
}

const { Pool } = pg

export const createPool = () => new Pool(config)
