import type { Budget, BudgetSummary } from '../types/Budget'

const API_URL = `${import.meta.env.VITE_API_URL}/budget`
const options: RequestInit = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include' as RequestCredentials
}

interface ApiBudget {
  budget_id: number
  user_id: string
  category_id: number
  amount: number
  period: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'annually'
  start_date: Date
  end_date: Date
  category?: string
}

function mapApiBudget(apiBudget: ApiBudget): Budget {
  return {
    budgetId: apiBudget.budget_id,
    userId: apiBudget.user_id,
    categoryId: apiBudget.category_id,
    amount: apiBudget.amount,
    period: apiBudget.period,
    startDate: new Date(apiBudget.start_date),
    endDate: new Date(apiBudget.end_date),
    category: apiBudget.category
  }
}

export const getBudgetsService = async (userId: string): Promise<Budget[]> => {
  try {
    const res = await fetch(`${API_URL}/${userId}`, options)
    if (!res.ok) return []

    const data = await res.json()
    const budgets: ApiBudget[] = data
    const mappedBudgets: Budget[] = budgets.map(mapApiBudget)
    return mappedBudgets
  } catch {
    throw new Error('Error al obtener los presupuestos')
  }
}

export const getBudgetSummaryService = async (
  {
    filters
  }: {
    filters?: string
  } = {},
  userId: string
): Promise<BudgetSummary[]> => {
  try {
    const res = await fetch(`${API_URL}/summary/${userId}?${filters}`, options)
    if (!res.ok) return []
    const data = await res.json()
    return data
  } catch {
    throw new Error('Error al obtener el resumen de presupuestos')
  }
}
