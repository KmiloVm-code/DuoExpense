import { Router } from 'express'
import { IngresosController } from '../controllers/Ingresos.js'

export const createIngresosRouter = ({ ingresoModel }) => {
  const ingresoRouter = Router()

  const ingresoControler = new IngresosController({ ingresoModel })

  ingresoRouter.get('/', ingresoControler.getAll)
  ingresoRouter.post('/', ingresoControler.create)
  ingresoRouter.patch('/:id', ingresoControler.update)
  ingresoRouter.delete('/:id', ingresoControler.delete)

  return ingresoRouter
}
