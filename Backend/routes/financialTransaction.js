import Router from 'express'
import { FinancialTransactionController } from '../controllers/financialTransaction.js'

export const createFinancialTransactionRouter = ({
  financialTransactionModel
}) => {
  const financialTransactionRouter = Router()

  const financialTransactionController = new FinancialTransactionController({
    financialTransactionModel
  })

  financialTransactionRouter.get(
    '/:userId',
    financialTransactionController.getAll
  )

  financialTransactionRouter.get(
    '/recurring/:id',
    financialTransactionController.getAllRecurring
  )
  financialTransactionRouter.get(
    '/last/:userId',
    financialTransactionController.getLastTransaction
  )
  financialTransactionRouter.get(
    '/summary/:userId',
    financialTransactionController.getFinancialSummary
  )
  financialTransactionRouter.get(
    '/expenses/:userId',
    financialTransactionController.getExpensesByCategory
  )
  financialTransactionRouter.post(
    '/:userId',
    financialTransactionController.create
  )
  financialTransactionRouter.patch(
    '/:id',
    financialTransactionController.update
  )
  financialTransactionRouter.delete(
    '/:id',
    financialTransactionController.delete
  )
  financialTransactionRouter.delete(
    '/recurring/:id',
    financialTransactionController.deleteByRecurringId
  )

  return financialTransactionRouter
}
