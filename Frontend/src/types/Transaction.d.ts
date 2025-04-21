export interface Transaction {
  transactionId: number
  userId: string
  categoryId: number
  paymentMethodId?: number
  cardId: number
  type: 'income' | 'expense' | 'savings'
  amount: number | string
  description: string
  transactionDate: Date | string
  recurringTransactionId?: number
  recurring?: boolean
  months?: number
  category?: string
  paymentMethod?: string
}

export interface SummaryTransaction {
  date?: Date
  total_income?: number
  total_expense?: number
  total_savings?: number
  total?: number
  category?: string
}
