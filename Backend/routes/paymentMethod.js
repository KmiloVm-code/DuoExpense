import { Router } from 'express'
import { PaymentMethodController } from '../controllers/paymentMethod.js'

export const createPaymentMethodRouter = ({ paymentMethodModel }) => {
  const paymentMethodRouter = Router()

  const paymentMethodController = new PaymentMethodController({
    paymentMethodModel
  })

  paymentMethodRouter.get('/', paymentMethodController.getAll)
  paymentMethodRouter.post('/', paymentMethodController.create)
  paymentMethodRouter.patch('/:id', paymentMethodController.update)
  paymentMethodRouter.delete('/:id', paymentMethodController.delete)

  return paymentMethodRouter
}
