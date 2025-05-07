import {
  validateFinancialTransaction,
  validatePartialFinancialTransaction
} from '../Schemas/financialTransaction.js'

export class FinancialTransactionController {
  constructor({ financialTransactionModel }) {
    this.financialTransactionModel = financialTransactionModel
  }

  getAll = async (req, res) => {
    const { userId } = req.params
    const filters = req.query
    const transactions = await this.financialTransactionModel.getAll({
      userId,
      filters
    })
    if (transactions) return res.json(transactions)
    res.status(404).send('<h1>Financial Transaction not found</h1>')
  }

  getAllRecurring = async (req, res) => {
    const { id } = req.params

    const transactions = await this.financialTransactionModel.getAllRecurring({
      id
    })
    if (transactions) return res.json(transactions)
    res.status(404).send('<h1>Recurring Financial Transaction not found</h1>')
  }

  getLastTransaction = async (req, res) => {
    const { userId } = req.params
    const transactions =
      await this.financialTransactionModel.getLastTransaction({
        userId
      })
    if (transactions) return res.json(transactions)
    res.status(404).send('<h1>Financial Transaction not found</h1>')
  }

  getFinancialSummary = async (req, res) => {
    const { userId } = req.params
    const filters = req.query
    const transactions =
      await this.financialTransactionModel.getFinancialSummary({
        userId,
        filters
      })
    if (transactions) return res.json(transactions)
    res.status(404).send('<h1>Financial Transaction not found</h1>')
  }

  getExpensesByCategory = async (req, res) => {
    const { userId } = req.params
    const filters = req.query
    const transactions =
      await this.financialTransactionModel.getExpensesByCategory({
        userId,
        filters
      })
    if (transactions) return res.json(transactions)
    res.status(404).send('<h1>Financial Transaction not found</h1>')
  }

  create = async (req, res) => {
    const { userId } = req.params
    if (req.body.transactionDate) {
      req.body.transactionDate = new Date(req.body.transactionDate)
    }
    const result = validateFinancialTransaction(req.body)

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      })
    }

    const newFinancialTransaction = await this.financialTransactionModel.create(
      {
        userId,
        input: result.data
      }
    )

    res.status(201).json(newFinancialTransaction)
  }

  update = async (req, res) => {
    if (req.body.transactionDate) {
      req.body.transactionDate = new Date(req.body.transactionDate)
    }
    const result = validatePartialFinancialTransaction(req.body)

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      })
    }

    const { id } = req.params

    const updatedFinancialTransaction =
      await this.financialTransactionModel.update({
        id,
        input: result.data
      })

    res.json(updatedFinancialTransaction)
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.financialTransactionModel.delete({ id })

    if (result === false) {
      return res.status(404).json({
        error: 'Financial Transaction not found'
      })
    }

    res.status(204).send()
  }

  deleteByRecurringId = async (req, res) => {
    if (req.body.transactionDate) {
      req.body.transactionDate = new Date(req.body.transactionDate)
    }

    const { id } = req.params

    const result = validatePartialFinancialTransaction(req.body)

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      })
    }

    const deletedFinancialTransaction =
      await this.financialTransactionModel.deleteByRecurringId({
        id,
        input: result.data
      })

    if (deletedFinancialTransaction === false) {
      return res.status(404).json({
        error: 'Recurring Financial Transaction not found'
      })
    }

    res.status(204).send()
  }
}
