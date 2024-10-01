import { Router } from 'express'
import { GastoController } from '../controllers/gasto.js'

export const createGastoRouter = ({ gastoModel }) => {
  const gastoRouter = Router()

  const gastoControler = new GastoController({ gastoModel })

  gastoRouter.get('/', gastoControler.getAll)
  gastoRouter.post('/', gastoControler.create)
  gastoRouter.patch('/:id', gastoControler.update)
  gastoRouter.delete('/:id', gastoControler.delete)

  return gastoRouter
}
