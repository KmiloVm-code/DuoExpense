import { createApp } from './app.js'

import { UserModel } from './models/postgresSql/user.js'
import { IngresoModel } from './models/postgresSql/Ingreso.js'
import { GastoModel } from './models/postgresSql/gasto.js'

createApp({
  userModel: UserModel,
  ingresoModel: IngresoModel,
  gastoModel: GastoModel
})
