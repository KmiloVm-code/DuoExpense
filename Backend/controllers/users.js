import { validateUser, validatepartialUser } from '../Schemas/users.js'

export class UserController {
  constructor ({ userModel }) {
    this.userModel = userModel
  }

  getAll = async (req, res) => {
    const { name } = req.query
    const users = await this.userModel.getAll({ name })
    res.json(users)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const user = await this.userModel.getById({ id })
    if (user) return res.json(user)
    res.status(404)
      .send('<h1>404 - Not Found</h1>')
  }

  create = async (req, res) => {
    const result = validateUser(req.body)

    if (result.error) {
      return res.status(400)
        .json({
          error: JSON.parse(result.error.message)
        })
    }

    const newUser = await this.userModel.create({ input: result.data })

    res.status(201)
      .json(newUser)
  }

  update = async (req, res) => {
    const result = validatepartialUser(req.body)

    if (result.error) {
      return res.status(400)
        .json({
          error: JSON.parse(result.error.message)
        })
    }

    const { id } = req.params

    const updateUser = await this.userModel.update({ id, input: result.data })

    return res.json(updateUser)
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.userModel.delete({ id })

    if (result === false) {
      return res.status(404)
        .json({ message: 'User not found' })
    }

    return res.json({ message: result })
  }
}
