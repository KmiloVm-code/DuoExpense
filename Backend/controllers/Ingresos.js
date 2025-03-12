import { validateIngreso, validatepartialIngreso } from '../Schemas/ingresos.js'

export class IngresosController {
  constructor({ ingresoModel }) {
    this.ingresoModel = ingresoModel
  }

  getAll = async (req, res) => {
    const filters = req.query
    const ingresos = await this.ingresoModel.getAll({ filters })
    res.json(ingresos)
  }

  create = async (req, res) => {
    const result = validateIngreso(req.body)

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      })
    }

    const newIngreso = await this.ingresoModel.create({ input: result.data })

    res.status(201).json(newIngreso)
  }

  update = async (req, res) => {
    const { id } = req.params
    const result = validatepartialIngreso(req.body)

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      })
    }

    const updatedIngreso = await this.ingresoModel.update({
      id,
      input: result.data
    })

    res.json(updatedIngreso)
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.ingresoModel.delete({ id })

    if (result === false) {
      res.status(404).send('<h1>404 - Not Found</h1>')
    }

    res.json(result)
  }
}
