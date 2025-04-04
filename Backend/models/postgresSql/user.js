import client from '../../db/dbClient.js'
import { hashPassword } from '../../utils.js'

const validateExistence = async (email) => {
  const result = await client.query(
    'SELECT * FROM UserAccount WHERE email = $1',
    [email]
  )
  return result.rows.length > 0
}

const validateExistenceById = async (id) => {
  const result = await client.query(
    'SELECT * FROM UserAccount WHERE user_id = $1',
    [id]
  )
  return result.rows.length > 0
}

export class UserModel {
  static async getAll({ name }) {
    if (name) {
      const lowerCaseName = name.toLowerCase()

      const result = await client.query(
        'SELECT * FROM UserAccount WHERE LOWER(name) = $1',
        [lowerCaseName]
      )

      if (result.rows.length === 0) {
        return false
      }

      return result.rows
    }

    const result = await client.query('SELECT * FROM UserAccount')
    return result.rows
  }

  static async getById({ id }) {
    const result = await client.query(
      'SELECT * FROM UserAccount WHERE user_id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return false
    }

    return result.rows[0]
  }

  static async getByEmail({ email }) {
    const result = await client.query(
      'SELECT * FROM UserAccount WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return false
    }

    return result.rows
  }

  static async create({ input }) {
    const { name, email, password } = input
    try {
      const exists = await validateExistence(email)
      if (exists) {
        return 'User already exists'
      }

      const hashedPassword = await hashPassword(password)

      const result = await client.query(
        'INSERT INTO UserAccount (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
        [name, email, hashedPassword]
      )
      return result.rows[0]
    } catch (error) {
      return error.message
    }
  }

  static async update({ id, input }) {
    const { name, email, password } = input
    try {
      const exists = await validateExistenceById(id)
      if (!exists) {
        return 'User does not exist'
      }

      const hashedPassword = password ? await hashPassword(password) : null

      const result = await client.query(
        'UPDATE UserAccount SET name = COALESCE($1, name), email = COALESCE($2, email), password_hash = COALESCE($3, password_hash) WHERE user_id = $4 RETURNING *',
        [name, email, hashedPassword, id]
      )
      return result.rows[0]
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }

  static async delete({ id }) {
    const exists = await validateExistenceById(id)
    if (!exists) {
      return false
    }

    await client.query('DELETE FROM UserAccount WHERE user_id = $1', [id])
    return true
  }
}
