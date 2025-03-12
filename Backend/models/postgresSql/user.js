import client from '../../db/dbClient.js'
import { hashPassword } from '../../utils.js'

const validateExistence = async (email) => {
  const result = await client.query('SELECT * FROM usuario WHERE email = $1', [
    email
  ])
  return result.rows.length > 0
}

const validateExistenceById = async (id) => {
  const result = await client.query(
    'SELECT * FROM usuario WHERE id_usuario = $1',
    [id]
  )
  return result.rows.length > 0
}

export class UserModel {
  static async getAll({ name }) {
    if (name) {
      const lowerCaseName = name.toLowerCase()

      const result = await client.query(
        'SELECT * FROM usuario WHERE LOWER(nombre) = $1',
        [lowerCaseName]
      )
      return result.rows
    }

    const result = await client.query('SELECT * FROM usuario')
    return result.rows
  }

  static async getById({ id }) {
    const result = await client.query(
      'SELECT * FROM usuario WHERE id_usuario = $1',
      [id]
    )
    return result.rows
  }

  static async getByEmail({ email }) {
    const result = await client.query(
      'SELECT * FROM usuario WHERE email = $1',
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
        'INSERT INTO usuario (nombre, email, pass) VALUES ($1, $2, $3) RETURNING *',
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

      const hashedPassword = await hashPassword(password)

      const result = await client.query(
        'UPDATE usuario SET nombre = COALESCE($1, nombre), email = COALESCE($2, email), pass = COALESCE($3, pass) WHERE id_usuario = $4 RETURNING *',
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
      return 'User does not exist'
    }

    await client.query('DELETE FROM usuario WHERE id_usuario = $1', [id])
    return 'User deleted'
  }
}
