import { createPool } from '../config/dbConfig.js'

const pool = createPool()

function connectWithRetry() {
  pool
    .connect()
    .then((client) => {
      console.log('Connected to database')
      client.release() // Libera el cliente de vuelta al pool
    })
    .catch((e) => {
      console.error('Error connecting to database, retrying in 5 seconds...', e)
      setTimeout(connectWithRetry, 5000) // Reintentar después de 5 segundos
    })
}

pool.on('error', (err) => {
  console.error('Unexpected error on idle client:', err)
  connectWithRetry()
})

connectWithRetry()

export default pool
