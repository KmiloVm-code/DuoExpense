import { Router } from 'express'
import { CategoryController } from '../controllers/category.js'

export const createCategoryRouter = ({ categoryModel }) => {
  const categoryRouter = Router()

  const categoryControler = new CategoryController({ categoryModel })

  categoryRouter.get('/', categoryControler.getAll)
  categoryRouter.post('/', categoryControler.create)
  categoryRouter.patch('/:id', categoryControler.update)
  categoryRouter.delete('/:id', categoryControler.delete)

  return categoryRouter
}
