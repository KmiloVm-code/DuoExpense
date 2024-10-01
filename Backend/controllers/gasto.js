import { validateGasto, validatepartialGasto } from '../Schemas/gastos.js'

export class GastoController {
  constructor ({ gastoModel }) {
    this.gastoModel = gastoModel
  }

  getAll = async (req, res) => {
    const filters = req.query
    const gastos = await this.gastoModel.getAll({ filters })
    res.json(gastos)
  }

  create = async (req, res) => {
    const result = validateGasto(req.body)

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      })
    }

    const newGasto = await this.gastoModel.create({ input: result.data })

    res.status(201).json(newGasto)
  }

  update = async (req, res) => {
    const { id } = req.params
    const result = validatepartialGasto(req.body)

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      })
    }

    const updatedGasto = await this.gastoModel.update({ id, input: result.data })

    res.json(updatedGasto)
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.gastoModel.delete({ id })

    if (result === false) {
      res.status(404).send('<h1>404 - Not Found</h1>')
    }

    res.json(result)
  }
}
