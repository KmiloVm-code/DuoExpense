import express, { json } from 'express'
import { createUserRouter } from './routes/users.js'
import { createIngresosRouter } from './routes/ingresos.js'
import { createAuthRouter } from './routes/auth.js'
import { createGastoRouter } from './routes/gasto.js'
import { createCategoryRouter } from './routes/category.js'
import { createPaymentMethodRouter } from './routes/paymentMethod.js'
import { createCreditCardRouter } from './routes/creditCard.js'
import { createBudgetRouter } from './routes/budget.js'
import { createFinancialTransactionRouter } from './routes/financialTransaction.js'
import { createActivityLogRouter } from './routes/activityLog.js'
import { createBalanceRouter } from './routes/balance.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import cors from 'cors'

export const createApp = ({
  userModel,
  ingresoModel,
  gastoModel,
  categoryModel,
  paymentMethodModel,
  creditCardModel,
  budgetModel,
  financialTransactionModel,
  activityLogModel,
  balanceModel
}) => {
  const app = express()
  app.use(json())
  app.use(cookieParser())

  app.disable('x-powered-by')
  const port = process.env.PORT ?? 3000

  const allowedOrigins = [
    'https://qnjffl48-5173.use2.devtunnels.ms',
    'https://qnjffl48-3000.use2.devtunnels.ms'
  ]

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      allowBody: true,
      WebSocket: true
    })
  )

  app.use((req, res, next) => {
    const token = req.cookies.access_token
    req.session = { user: null }

    try {
      const data = jwt.verify(token, process.env.SECRET_KEY)
      req.session.user = data
    } catch {}

    next()
  })

  app.get('/', (req, res) => {
    const { user } = req.session
    if (!user) {
      return res.status(401).send('<h1>Unauthorized</h1>')
    }
  })

  app.get('/auth/check-session', async (req, res) => {
    const token = req.cookies.access_token
    if (!token) {
      return res.status(401).send('<h1>Unauthorized</h1>')
    }

    try {
      const data = jwt.verify(token, process.env.SECRET_KEY)
      const user = await userModel.getById({ id: data.id })
      const { ...publicUser } = user[0]
      return res.status(200).json({ message: 'Sesión válida', publicUser })
    } catch {
      return res.status(401).json({ message: 'Sesión inválida o expirada' })
    }
  })

  app.post('/auth/logout', (req, res) => {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    res.status(200).json({ message: 'Sesión cerrada' })
  })

  app.use('/users', createUserRouter({ userModel }))
  app.use('/ingresos', createIngresosRouter({ ingresoModel }))
  app.use('/auth', createAuthRouter({ userModel }))
  app.use('/gastos', createGastoRouter({ gastoModel }))
  app.use('/categories', createCategoryRouter({ categoryModel }))
  app.use('/payment-methods', createPaymentMethodRouter({ paymentMethodModel }))
  app.use('/credit-cards', createCreditCardRouter({ creditCardModel }))
  app.use('/budget', createBudgetRouter({ budgetModel }))
  app.use(
    '/financial-transactions',
    createFinancialTransactionRouter({ financialTransactionModel })
  )
  app.use('/activity-log', createActivityLogRouter({ activityLogModel }))
  app.use('/balance', createBalanceRouter({ balanceModel }))

  app.use((req, res) => {
    res.status(404).send('<h1>404 - Not Found</h1>')
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}
