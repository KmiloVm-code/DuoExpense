import {
  validateCategory,
  validatePartialCategory
} from '../Schemas/category.js'

export class CategoryController {
  constructor({ categoryModel }) {
    this.categoryModel = categoryModel
  }

  getAll = async (req, res) => {
    const filters = req.query
    const categories = await this.categoryModel.getAll({ filters })
    if (categories) return res.json(categories)
    res.status(404).send('<h1>Category not found</h1>')
  }

  create = async (req, res) => {
    const result = validateCategory(req.body)

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      })
    }

    const newCategory = await this.categoryModel.create({ input: result.data })

    res.status(201).json(newCategory)
  }

  update = async (req, res) => {
    const result = validatePartialCategory(req.body)

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      })
    }

    const { id } = req.params

    const updatedCategory = await this.categoryModel.update({
      id,
      input: result.data
    })

    res.json(updatedCategory)
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.categoryModel.delete({ id })

    if (result === false) {
      return res.status(404).json({
        error: 'Category not found'
      })
    }

    res.json(result)
  }
}
