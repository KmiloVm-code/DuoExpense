import {
  validatePaymentMethod,
  validatePartialPaymentMethod
} from '../Schemas/paymentMethod.js'

export class PaymentMethodController {
  constructor({ paymentMethodModel }) {
    this.paymentMethodModel = paymentMethodModel
  }

  getAll = async (req, res) => {
    const filters = req.query
    const paymentMethods = await this.paymentMethodModel.getAll({ filters })
    if (paymentMethods) return res.json(paymentMethods)
    res.status(404).send('<h1>Payment Method not found</h1>')
  }

  create = async (req, res) => {
    const result = validatePaymentMethod(req.body)

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      })
    }

    const newPaymentMethod = await this.paymentMethodModel.create({
      input: result.data
    })

    res.status(201).json(newPaymentMethod)
  }

  update = async (req, res) => {
    const result = validatePartialPaymentMethod(req.body)

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      })
    }

    const { id } = req.params

    const updatedPaymentMethod = await this.paymentMethodModel.update({
      id,
      input: result.data
    })

    res.json(updatedPaymentMethod)
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.paymentMethodModel.delete({ id })

    if (result === false) {
      return res.status(404).json({
        error: 'Payment Method not found'
      })
    }

    res.json(result)
  }
}
