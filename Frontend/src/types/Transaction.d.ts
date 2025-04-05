export interface Transaction {
  transactionId: number
  userId: string
  categoryId: number
  paymentMethodId: number
  cardId: number
  type: 'income' | 'expense | savings'
  amount: number
  description: string
  transactionDate: Date
  recurringTransactionId?: number
  recurring?: boolean
  months?: number
}
