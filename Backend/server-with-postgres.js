import { createApp } from './app.js'

import { UserModel } from './models/postgresSql/user.js'
import { IngresoModel } from './models/postgresSql/Ingreso.js'
import { GastoModel } from './models/postgresSql/gasto.js'
import { CategoryModel } from './models/postgresSql/category.js'
import { PaymentMethodModel } from './models/postgresSql/paymentMethod.js'
import { CreditCardModel } from './models/postgresSql/creditCard.js'
import { BudgetModel } from './models/postgresSql/budget.js'
import { FinancialTransactionModel } from './models/postgresSql/financialTransaction.js'
import { ActivityLogModel } from './models/postgresSql/activityLog.js'
import { BalanceModel } from './models/postgresSql/balance.js'

createApp({
  userModel: UserModel,
  ingresoModel: IngresoModel,
  gastoModel: GastoModel,
  categoryModel: CategoryModel,
  paymentMethodModel: PaymentMethodModel,
  creditCardModel: CreditCardModel,
  budgetModel: BudgetModel,
  financialTransactionModel: FinancialTransactionModel,
  activityLogModel: ActivityLogModel,
  balanceModel: BalanceModel
})
