import pg from 'pg'

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DATABASE,
  ssl: {
    mode: 'require'
  },
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 10000
}

const { Client } = pg

export const createClient = () => new Client(config)
