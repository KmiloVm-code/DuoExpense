import client from '../../db/dbClient.js'
import { calculateSafeDate } from '../../utils.js'

export class FinancialTransactionModel {
  static async getAll({ userId, filters }) {
    const { categoryId, paymentMethodId, cardId, type, startDate, endDate } =
      filters
    let query =
      'SELECT FinancialTransaction.*, category.name AS category, PaymentMethod.name AS PaymentMethod FROM FinancialTransaction JOIN category ON FinancialTransaction.category_id = category.category_id JOIN PaymentMethod ON FinancialTransaction.payment_method_id = PaymentMethod.payment_method_id WHERE user_id = $1'
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

  static async getFinancialSummary({ userId, filters }) {
    const { startDate, endDate } = filters
    let query = `SELECT
                transaction_date::DATE AS date,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
            FROM FinancialTransaction
            WHERE user_id = $1`
    const values = [userId]
    if (startDate && endDate) {
      query += ' AND transaction_date BETWEEN $2 AND $3'
      values.push(startDate, endDate)
    }
    query += ' GROUP BY date ORDER BY date'
    try {
      const result = await client.query(query, values)
      if (result.rows.length === 0) {
        return false
      }
      return result.rows
    } catch (error) {
      console.error('Error fetching financial summary:', error)
      return false
    }
  }

  static async getExpensesByCategory({ userId, filters }) {
    const { startDate, endDate } = filters
    let query = `SELECT
                category.name AS category,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
            FROM FinancialTransaction
            JOIN category ON FinancialTransaction.category_id = category.category_id
            WHERE user_id = $1 AND type = 'expense'`
    const values = [userId]
    if (startDate && endDate) {
      query += ' AND transaction_date BETWEEN $2 AND $3'
      values.push(startDate, endDate)
    }
    query += ' GROUP BY category ORDER BY category'
    try {
      const result = await client.query(query, values)

      if (result.rows.length === 0) {
        return false
      }
      return result.rows
    } catch (error) {
      console.error('Error fetching expenses by category:', error)
      return false
    }
  }

  static async create({ userId, input }) {
    const {
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
        `WITH inserted_transaction AS (
          INSERT INTO FinancialTransaction (user_id, category_id, payment_method_id, card_id, type, amount, description, transaction_date) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
          RETURNING *
        )
        SELECT 
          ft.*,
          c.name as category,
          pm.name as paymentMethod
        FROM inserted_transaction ft
        LEFT JOIN Category c ON ft.category_id = c.category_id
        LEFT JOIN PaymentMethod pm ON ft.payment_method_id = pm.payment_method_id`,
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

        const insertQuery = `
          WITH inserted_recurring AS (
            INSERT INTO FinancialTransaction (user_id, category_id, payment_method_id, card_id, type, amount, description, transaction_date, recurring_transaction_id) 
            VALUES ${placeholders.join(', ')} 
            RETURNING *
          )
          SELECT 
            ft.*,
            c.name as category,
            pm.name as paymentMethod
          FROM inserted_recurring ft
          LEFT JOIN Category c ON ft.category_id = c.category_id
          LEFT JOIN PaymentMethod pm ON ft.payment_method_id = pm.payment_method_id`

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
        `WITH updated_transaction AS (
          UPDATE FinancialTransaction 
          SET category_id = COALESCE($1, category_id),
              payment_method_id = COALESCE($2, payment_method_id), 
              card_id = COALESCE($3, card_id),
              type = COALESCE($4, type),
              amount = COALESCE($5, amount),
              description = COALESCE($6, description),
              transaction_date = COALESCE($7, transaction_date)
          WHERE transaction_id = $8
          RETURNING *
        )
        SELECT 
          ft.*,
          c.name as category,
          pm.name as paymentMethod
        FROM updated_transaction ft
        LEFT JOIN Category c ON ft.category_id = c.category_id
        LEFT JOIN PaymentMethod pm ON ft.payment_method_id = pm.payment_method_id`,
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
