import { validateIngresoFijo, validatepartialIngresoFijo } from '../Schemas/ingresosFijos.js'

export class IngresosFijosController {
  constructor ({ ingresoFijoModel }) {
    this.ingresoFijoModel = ingresoFijoModel
  }

  getAll = async (req, res) => {
    const { id } = req.query
    const ingresosFijos = await this.ingresoFijoModel.getAll({ id })
    res.json(ingresosFijos)
  }

  getByIdUser = async (req, res) => {
    const { idUsuario } = req.params
    const ingresosFijos = await this.ingresoFijoModel.getbyIdUser({ idUsuario })
    res.json(ingresosFijos)
  }

  create = async (req, res) => {
    const result = validateIngresoFijo(req.body)

    if (result.error) {
      return res.status(400)
        .json({
          error: JSON.parse(result.error.message)
        })
    }

    const newIngresoFijo = await this.ingresoFijoModel.create({ input: result.data })

    res.status(201)
      .json(newIngresoFijo)
  }

  update = async (req, res) => {
    const { id } = req.params
    const result = validatepartialIngresoFijo(req.body)

    if (result.error) {
      return res.status(400)
        .json({
          error: JSON.parse(result.error.message)
        })
    }

    const updatedIngresoFijo = await this.ingresoFijoModel.update({ id, input: result.data })

    res.json(updatedIngresoFijo)
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.ingresoFijoModel.delete({ id })

    if (result === false) {
      res.status(404)
        .send('<h1>404 - Not Found</h1>')
    }

    res.json({ message: result })
  }
}
