import { Router } from 'express'
import { AuthController } from '../controllers/auth.js'

export const createAuthRouter = ({ userModel }) => {
  const authRouter = Router()

  const authController = new AuthController({ userModel })

  authRouter.post('/register', authController.register)
  authRouter.post('/login', authController.login)

  return authRouter
}
