import { Router } from 'express'
import { CreditCardController } from '../controllers/creditCard.js'

export const createCreditCardRouter = ({ creditCardModel }) => {
  const creditCardRouter = Router()

  const creditCardController = new CreditCardController({ creditCardModel })

  creditCardRouter.get('/', creditCardController.getAll)
  creditCardRouter.post('/', creditCardController.create)
  creditCardRouter.patch('/:id', creditCardController.update)
  creditCardRouter.delete('/:id', creditCardController.delete)

  return creditCardRouter
}
