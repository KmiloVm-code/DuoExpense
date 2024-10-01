import { Router } from 'express'
import { IngresosFijosController } from '../controllers/IngresosFijos.js'

export const createIngresosFijosRouter = ({ ingresoFijoModel }) => {
  const ingresoFijoRouter = Router()

  const ingresoFijoControler = new IngresosFijosController({ ingresoFijoModel })

  ingresoFijoRouter.get('/', ingresoFijoControler.getAll)
  ingresoFijoRouter.get('/:idUsuario', ingresoFijoControler.getByIdUser)
  ingresoFijoRouter.post('/', ingresoFijoControler.create)
  ingresoFijoRouter.patch('/:id', ingresoFijoControler.update)
  ingresoFijoRouter.delete('/:id', ingresoFijoControler.delete)

  return ingresoFijoRouter
}
