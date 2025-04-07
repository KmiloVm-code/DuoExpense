import client from '../../db/dbClient.js'

export class BalanceModel {
  static async getAll({ id, filters }) {
    const { startDate, endDate } = filters
    let query = 'SELECT * FROM monthlybalance WHERE user_id = $1'
    const values = [id]

    if (startDate && endDate) {
      query += ` AND month BETWEEN $${values.length + 1} AND $${values.length + 2}`
      values.push(startDate, endDate)
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

  static async getCurrentBalance({ id, filters }) {
    const { startDate, endDate } = filters
    const query = 'SELECT * FROM get_balance_in_range($1, $2, $3) AS balance'
    const values = [id, startDate, endDate]

    try {
      const result = await client.query(query, values)
      if (result.rows.length === 0) {
        return false
      }
      return result.rows[0]
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }

  static async refreshBalance() {
    try {
      const result = await client.query(
        'REFRESH MATERIALIZED VIEW CONCURRENTLY monthlybalance'
      )
      return result
    } catch (error) {
      console.error('Error refreshing balance:', error)
      return false
    }
  }
}
