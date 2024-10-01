import { createClient } from '../config/dbConfig.js'

const client = createClient()

client.connect()
  .then(() => console.log('Connected to database'))
  .catch((e) => {
    throw new Error('Error connecting to database', e)
  })

export default client
