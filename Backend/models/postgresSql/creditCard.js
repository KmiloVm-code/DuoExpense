import client from '../../db/dbClient.js'

export class CreditCardModel {
  static async getAll({ filters }) {
    const { userId, name, bank } = filters
    let query = 'SELECT * FROM CreditCard WHERE 1=1'
    const values = []
    if (userId) {
      query += ` AND user_id = $${values.length + 1}`
      values.push(userId)
    }
    if (name) {
      query += ` AND name ILIKE '%' || $${values.length + 1} || '%'`
      values.push(name)
    }
    if (bank) {
      query += ` AND bank ILIKE '%' || $${values.length + 1} || '%'`
      values.push(bank)
    }
    const result = await client.query(query, values)
    if (result.rows.length === 0) {
      return false
    }
    return result.rows
  }

  static async create({ input }) {
    const { userId, name, bank, creditLimit, expirationDate } = input
    try {
      const result = await client.query(
        'INSERT INTO CreditCard (user_id, name, bank, credit_limit, expiration_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [userId, name, bank, creditLimit, expirationDate]
      )
      return result.rows[0]
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }

  static async update({ id, input }) {
    const { userId, name, bank, creditLimit, expirationDate } = input
    try {
      const result = await client.query(
        'UPDATE CreditCard SET user_id = COALESCE($1, user_id), name = COALESCE($2, name), bank = COALESCE($3, bank), credit_limit = COALESCE($4, credit_limit), expiration_date = COALESCE($5, expiration_date) WHERE card_id = $6 RETURNING *',
        [
          userId || null,
          name || null,
          bank || null,
          creditLimit || null,
          expirationDate || null,
          id
        ]
      )
      return result.rows[0]
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }

  static async delete({ id }) {
    try {
      const result = await client.query(
        'DELETE FROM CreditCard WHERE card_id = $1 RETURNING *',
        [id]
      )
      return result.rows[0]
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }
}
