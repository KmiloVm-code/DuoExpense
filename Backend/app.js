import express, { json } from 'express'
import { createUserRouter } from './routes/users.js'
import { createIngresosFijosRouter } from './routes/ingresosFijos.js'
import { createAuthRouter } from './routes/auth.js'
import { createGastoRouter } from './routes/gasto.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

export const createApp = ({ userModel, ingresoFijoModel, gastoModel }) => {
  const app = express()
  app.use(json())
  app.use(cookieParser())

  app.disable('x-powered-by')
  const port = process.env.PORT ?? 3000

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('access-control-allow-body', 'true')

    const token = req.cookies.access_token
    req.session = { user: null }

    try {
      const data = jwt.verify(token, 'secret')
      req.session.user = data
    } catch {}

    next()
  })

  app.get('/', (req, res) => {
    const { user } = req.session
    if (!user) {
      return res.status(401)
        .send('<h1>Unauthorized</h1>')
    }
  })

  app.get('/auth/check-session', async (req, res) => {
    const token = req.cookies.access_token
    if (!token) {
      return res.status(401)
        .send('<h1>Unauthorized</h1>')
    }

    try {
      const data = jwt.verify(token, 'secret')
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
  app.use('/ingresos-fijos', createIngresosFijosRouter({ ingresoFijoModel }))
  app.use('/auth', createAuthRouter({ userModel }))
  app.use('/gastos', createGastoRouter({ gastoModel }))

  app.use((req, res) => {
    res.status(404)
      .send('<h1>404 - Not Found</h1>')
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}
