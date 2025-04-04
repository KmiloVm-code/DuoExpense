import client from '../../db/dbClient.js'

export class PaymentMethodModel {
  static async getAll({ filters }) {
    const { paymentMethodId, name } = filters
    let query = 'SELECT * FROM PaymentMethod WHERE 1=1'
    const values = []
    if (paymentMethodId) {
      query += ` AND payment_method_id = $${values.length + 1}`
      values.push(paymentMethodId)
    }
    if (name) {
      query += ` AND name ILIKE '%' || $${values.length + 1} || '%'`
      values.push(name)
    }
    const result = await client.query(query, values)
    if (result.rows.length === 0) {
      return false
    }
    return result.rows
  }

  static async create({ input }) {
    const { name } = input
    try {
      const result = await client.query(
        'INSERT INTO PaymentMethod (name) VALUES ($1) RETURNING *',
        [name]
      )
      return result.rows[0]
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }

  static async update({ id, input }) {
    const { name } = input
    try {
      const result = await client.query(
        'UPDATE PaymentMethod SET name = COALESCE($1, name) WHERE payment_method_id = $2 RETURNING *',
        [name, id]
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
        'DELETE FROM PaymentMethod WHERE payment_method_id = $1 RETURNING *',
        [id]
      )
      return result.rows[0]
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }
}
