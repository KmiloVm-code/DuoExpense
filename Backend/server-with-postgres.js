import { createApp } from './app.js'

import { UserModel } from './models/postgresSql/user.js'
import { IngresoFijoModel } from './models/postgresSql/IngresoFijo.js'
import { GastoModel } from './models/postgresSql/gasto.js'

createApp({ userModel: UserModel, ingresoFijoModel: IngresoFijoModel, gastoModel: GastoModel })
