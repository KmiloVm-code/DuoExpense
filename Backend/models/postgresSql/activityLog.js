import client from '../../db/dbClient.js'

export class ActivityLogModel {
  static async getAll({ filters }) {
    const { userId, action } = filters
    let query = 'SELECT * FROM ActivityLog WHERE 1=1'
    const values = []
    if (userId) {
      query += ` AND user_id = $${values.length + 1}`
      values.push(userId)
    }
    if (action) {
      query += ` AND action = $${values.length + 1}`
      values.push(action)
    }

    try {
      const result = await client.query(query, values)
      if (result.rows.length === 0) {
        return false
      }
      return result.rows
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }
}
