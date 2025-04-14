export interface Transaction {
  transactionId: number
  userId: string
  categoryId: number
  paymentMethodId: number
  cardId: number
  type: 'income' | 'expense' | 'savings'
  amount: number
  description: string
  transactionDate: Date
  recurringTransactionId?: number
  recurring?: boolean
  months?: number
}

export interface SummaryTransaction {
  date?: Date
  total_income?: number
  total_expense?: number
  total_savings?: number
  total?: number
  category?: string
}
