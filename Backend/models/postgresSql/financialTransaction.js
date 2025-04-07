import client from '../../db/dbClient.js'
import { calculateSafeDate } from '../../utils.js'

export class FinancialTransactionModel {
  static async getAll({ filters }) {
    const { userId, categoryId, paymentMethodId, cardId, type } = filters
    let query = 'SELECT * FROM FinancialTransaction WHERE 1=1'
    const values = []
    if (userId) {
      query += ` AND user_id = $${values.length + 1}`
      values.push(userId)
    }
    if (categoryId) {
      query += ` AND category_id = $${values.length + 1}`
      values.push(categoryId)
    }
    if (paymentMethodId) {
      query += ` AND payment_method_id = $${values.length + 1}`
      values.push(paymentMethodId)
    }
    if (cardId) {
      query += ` AND card_id = $${values.length + 1}`
      values.push(cardId)
    }
    if (type) {
      query += ` AND type = $${values.length + 1}`
      values.push(type)
    }

    query += ' ORDER BY transaction_date DESC'

    try {
      const result = await client.query(query, values)
      if (result.rows.length === 0) {
        return false
      }
      return result.rows
    } catch (error) {
      console.error('Error fetching transactions:', error)
      return false
    }
  }

  static async getDateRange({ filters }) {
    const {
      userId,
      categoryId,
      paymentMethodId,
      cardId,
      type,
      startDate,
      endDate
    } = filters

    let query = 'SELECT * FROM FinancialTransaction WHERE 1=1'
    const values = []
    if (userId) {
      query += ` AND user_id = $${values.length + 1}`
      values.push(userId)
    }
    if (categoryId) {
      query += ` AND category_id = $${values.length + 1}`
      values.push(categoryId)
    }
    if (paymentMethodId) {
      query += ` AND payment_method_id = $${values.length + 1}`
      values.push(paymentMethodId)
    }
    if (cardId) {
      query += ` AND card_id = $${values.length + 1}`
      values.push(cardId)
    }
    if (type) {
      query += ` AND type = $${values.length + 1}`
      values.push(type)
    }
    if (startDate) {
      query += ` AND transaction_date >= $${values.length + 1}`
      values.push(startDate)
    }
    if (endDate) {
      query += ` AND transaction_date <= $${values.length + 1}`
      values.push(endDate)
    }

    query += ' ORDER BY transaction_date DESC'

    try {
      const result = await client.query(query, values)
      if (result.rows.length === 0) {
        return false
      }
      return result.rows
    } catch (error) {
      console.error('Error fetching transactions:', error)
      return false
    }
  }

  static async getAllRecurring({ id }) {
    try {
      const result = await client.query(
        'SELECT * FROM FinancialTransaction WHERE transaction_id = $1 OR recurring_transaction_id = $1 ORDER BY transaction_date',
        [id]
      )
      if (result.rows.length === 0) {
        return false
      }
      return result.rows
    } catch (error) {
      console.error('Error fetching recurring transactions:', error)
      return false
    }
  }

  static async getLastTransaction({ userId }) {
    try {
      const result = await client.query(
        'SELECT * FROM FinancialTransaction WHERE user_id = $1 ORDER BY transaction_date DESC LIMIT 5',
        [userId]
      )
      if (result.rows.length === 0) {
        return false
      }
      return result.rows
    } catch (error) {
      console.error('Error fetching last transaction:', error)
      return false
    }
  }

  static async create({ input }) {
    const {
      userId,
      categoryId,
      paymentMethodId,
      cardId,
      type,
      amount,
      description,
      transactionDate,
      recurring,
      months
    } = input

    try {
      await client.query('BEGIN')

      const result = await client.query(
        'INSERT INTO FinancialTransaction (user_id, category_id, payment_method_id, card_id, type, amount, description, transaction_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [
          userId,
          categoryId || null,
          paymentMethodId || null,
          cardId || null,
          type,
          amount,
          description || null,
          transactionDate || new Date()
        ]
      )

      const transactionId = result.rows[0].transaction_id

      if (recurring && months > 0) {
        const values = []
        const placeholders = []
        for (let i = 1; i <= months; i++) {
          const nextDate = calculateSafeDate(transactionDate, i)
          values.push(
            userId,
            categoryId || null,
            paymentMethodId || null,
            cardId || null,
            type,
            amount,
            description || null,
            nextDate,
            transactionId
          )
          placeholders.push(
            `($${values.length - 8}, $${values.length - 7}, $${values.length - 6}, $${values.length - 5}, $${values.length - 4}, $${values.length - 3}, $${values.length - 2}, $${values.length - 1}, $${values.length})`
          )
        }

        const insertQuery = `INSERT INTO FinancialTransaction (user_id, category_id, payment_method_id, card_id, type, amount, description, transaction_date, recurring_transaction_id) VALUES ${placeholders.join(', ')}`
        await client.query(insertQuery, values)
      }
      await client.query('COMMIT')

      return result.rows[0]
    } catch (error) {
      await client.query('ROLLBACK')
      console.error(error)
      return 'Error'
    }
  }

  static async update({ id, input }) {
    const {
      categoryId,
      paymentMethodId,
      cardId,
      type,
      amount,
      description,
      transactionDate
    } = input

    try {
      const result = await client.query(
        'UPDATE FinancialTransaction SET category_id = COALESCE($1, category_id), payment_method_id = COALESCE($2, payment_method_id), card_id = COALESCE($3, card_id), type = COALESCE($4, type), amount = COALESCE($5, amount), description = COALESCE($6, description), transaction_date = COALESCE($7, transaction_date) WHERE transaction_id = $8 RETURNING *',
        [
          categoryId || null,
          paymentMethodId || null,
          cardId || null,
          type,
          amount,
          description || null,
          transactionDate || new Date(),
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
        'DELETE FROM FinancialTransaction WHERE transaction_id = $1 RETURNING *',
        [id]
      )
      return result.rows[0]
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }

  static async deleteByRecurringId({ id, input }) {
    const { transactionDate } = input

    try {
      const result = await client.query(
        'DELETE FROM FinancialTransaction WHERE recurring_transaction_id = $1 AND transaction_date = $2 RETURNING *',
        [id, transactionDate]
      )
      return result.rows[0]
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }
}
