import { Router } from 'express'
import { BudgetController } from '../controllers/budget.js'

export const createBudgetRouter = ({ budgetModel }) => {
  const budgetRouter = Router()

  const budgetControler = new BudgetController({ budgetModel })

  budgetRouter.get('/:userId', budgetControler.getAll)
  budgetRouter.get('/summary/:userId', budgetControler.getBudgetSummary)
  budgetRouter.post('/', budgetControler.create)
  budgetRouter.patch('/:id', budgetControler.update)
  budgetRouter.delete('/:id', budgetControler.delete)

  return budgetRouter
}
