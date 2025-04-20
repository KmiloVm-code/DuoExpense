import { validateBudget, validatePartialBudget } from '../Schemas/budget.js'

export class BudgetController {
  constructor({ budgetModel }) {
    this.budgetModel = budgetModel
  }

  getAll = async (req, res) => {
    const { userId } = req.params
    if (!userId) {
      return res.status(400).json({
        error: 'User ID is required'
      })
    }
    const filters = req.query
    const budgets = await this.budgetModel.getAll({ userId, filters })
    if (budgets) return res.json(budgets)
    res.status(404).send('<h1>Budget not found</h1>')
  }

  getBudgetSummary = async (req, res) => {
    const { userId } = req.params
    if (!userId) {
      return res.status(400).json({
        error: 'User ID is required'
      })
    }
    const filters = req.query
    const budgetSummary = await this.budgetModel.getBudgetSummary({
      userId,
      filters
    })
    if (budgetSummary) return res.json(budgetSummary)
    res.status(404).send('<h1>Budget summary not found</h1>')
  }

  create = async (req, res) => {
    const result = validateBudget(req.body)

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      })
    }

    const newBudget = await this.budgetModel.create({ input: result.data })

    res.status(201).json(newBudget)
  }

  update = async (req, res) => {
    const result = validatePartialBudget(req.body)

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      })
    }

    const { id } = req.params

    const updatedBudget = await this.budgetModel.update({
      id,
      input: result.data
    })

    res.json(updatedBudget)
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.budgetModel.delete({ id })

    if (result === false) {
      return res.status(404).json({
        error: 'Budget not found'
      })
    }

    res.json(result)
  }
}
