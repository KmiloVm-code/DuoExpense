import pg from 'pg'

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DATABASE
}

const { Client } = pg

export const createClient = () => new Client(config)
