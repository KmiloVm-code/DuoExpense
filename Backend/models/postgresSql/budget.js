import client from '../../db/dbClient.js'

export class BudgetModel {
  static async getAll({ filters }) {
    const { userId, categoryId } = filters
    let query =
      'SELECT budget.*, category.name AS category FROM budget JOIN category ON budget.category_id = category.category_id WHERE 1=1'
    const values = []
    if (userId) {
      query += ` AND user_id = $${values.length + 1}`
      values.push(userId)
    }
    if (categoryId) {
      query += ` AND category_id = $${values.length + 1}`
      values.push(categoryId)
    }

    const result = await client.query(query, values)
    if (result.rows.length === 0) {
      return false
    }
    return result.rows
  }

  static async getBudgetSummary({ userId, filters }) {
    const { startDate, endDate } = filters
    const query = 'SELECT * FROM get_budget_summary($1, $2, $3)'
    const values = [userId, startDate, endDate]
    const result = await client.query(query, values)
    if (result.rows.length === 0) {
      return false
    }
    return result.rows
  }

  static async create({ input }) {
    const { userId, categoryId, amount, period, startDate, endDate } = input
    try {
      const result = await client.query(
        'INSERT INTO budget (user_id, category_id, amount, period, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [userId, categoryId, amount, period, startDate, endDate]
      )
      return result.rows[0]
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }

  static async update({ id, input }) {
    const { userId, categoryId, amount, period, startDate, endDate } = input
    try {
      const result = await client.query(
        'UPDATE budget SET user_id = COALESCE($1, user_id), category_id = COALESCE($2, category_id), amount = COALESCE($3, amount), period = COALESCE($4, period), start_date = COALESCE($5, start_date), end_date = COALESCE($6, end_date) WHERE budget_id = $7 RETURNING *',
        [userId, categoryId, amount, period, startDate, endDate, id]
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
        'DELETE FROM budget WHERE budget_id = $1 RETURNING *',
        [id]
      )
      return result.rows[0]
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }
}
