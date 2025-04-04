import { Router } from 'express'
import { BalanceController } from '../controllers/balance.js'

export const createBalanceRouter = ({ balanceModel }) => {
  const balanceRouter = Router()

  const balanceControler = new BalanceController({ balanceModel })

  balanceRouter.get('/:id', balanceControler.getAll)
  balanceRouter.post('/refresh', balanceControler.refreshBalance)

  return balanceRouter
}
