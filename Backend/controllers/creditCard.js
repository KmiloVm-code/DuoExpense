import {
  validateCreditCard,
  validatePartialCreditCard
} from '../Schemas/creditCard.js'

export class CreditCardController {
  constructor({ creditCardModel }) {
    this.creditCardModel = creditCardModel
  }

  getAll = async (req, res) => {
    const filters = req.query
    const creditCards = await this.creditCardModel.getAll({ filters })
    if (creditCards) return res.json(creditCards)
    res.status(404).send('<h1>Credit Card not found</h1>')
  }

  create = async (req, res) => {
    const result = validateCreditCard(req.body)

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      })
    }

    const newCreditCard = await this.creditCardModel.create({
      input: result.data
    })

    res.status(201).json(newCreditCard)
  }

  update = async (req, res) => {
    const result = validatePartialCreditCard(req.body)

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      })
    }

    const { id } = req.params

    const updatedCreditCard = await this.creditCardModel.update({
      id,
      input: result.data
    })

    res.json(updatedCreditCard)
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.creditCardModel.delete({ id })

    if (result === false) {
      return res.status(404).json({
        error: 'Credit Card not found'
      })
    }

    res.status(204).send()
  }
}
