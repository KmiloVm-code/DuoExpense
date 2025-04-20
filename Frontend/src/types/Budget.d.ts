export interface Budget {
  budgetId: number
  userId: string
  categoryId: number
  amount: number
  period: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'annually'
  startDate: Date
  endDate: Date
  category?: string
}

export interface BudgetSummary {
  category: string
  budgeted: number
  spent: number
  difference: number
  usage_percentage: number
}
