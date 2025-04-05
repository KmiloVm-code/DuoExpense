export interface Budget {
  budgetId: number
  userId: string
  categoryId: number
  amount: number
  period: 'monthly' | 'yearly'
  startDate: Date
  endDate: Date
}
