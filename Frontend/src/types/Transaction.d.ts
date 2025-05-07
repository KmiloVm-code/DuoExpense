export interface Transaction {
  transactionId?: number
  userId?: string
  categoryId: number
  paymentMethodId: number
  paymentMethod: string
  cardId?: number | null
  type: string
  amount: number
  description: string
  transactionDate: string
  recurringTransactionId?: number
  recurring: boolean
  months: number | null
  category?: string
  installments?: number | null
}

export interface SummaryTransaction {
  date?: Date
  total_income?: number
  total_expense?: number
  total_savings?: number
  total?: number
  category?: string
}
