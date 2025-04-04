import { validatepartialUser, validateUser } from '../Schemas/users.js'
import { comparePassword } from '../utils.js'
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.SECRET_KEY

export class AuthController {
  constructor({ userModel }) {
    this.userModel = userModel
  }

  register = async (req, res) => {
    const result = validateUser(req.body)

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error.message)
      })
    }

    const newUser = await this.userModel.create({ input: result.data })

    res.status(201).json(newUser)
  }

  login = async (req, res) => {
    try {
      const { email, password } = validatepartialUser(req.body).data

      const user = await this.userModel.getByEmail({ email })

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        })
      }

      const passwordMatch = await comparePassword(
        password,
        user[0].password_hash
      )

      if (!passwordMatch) {
        return res.status(401).json({
          error: 'Invalid password'
        })
      }

      const publicUser = {
        user_id: user[0].user_id,
        name: user[0].name,
        email: user[0].email,
        created_at: user[0].created_at
      }

      const token = jwt.sign(
        { id: user[0].user_id, name: user[0].name },
        SECRET_KEY,
        {
          expiresIn: '1h'
        }
      )

      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60
        })
        .send({ publicUser, token })
    } catch (error) {
      return res.status(401).send({
        error: error.message
      })
    }
  }
}
