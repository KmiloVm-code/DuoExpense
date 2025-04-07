import { Balance } from '../types/Balance'

const API_URL = `${import.meta.env.VITE_API_URL}/balance`
const options: RequestInit = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include' as RequestCredentials
}

interface ApiBalance {
  user_id: string
  month: string | null
  total_income: number
  total_expenses: number
  total_savings: number
  balance: number
}

function mapApiBalance(apiBalance: ApiBalance): Balance {
  return {
    userId: apiBalance.user_id,
    month: apiBalance.month ? new Date(apiBalance.month) : undefined,
    totalIncome: apiBalance.total_income,
    totalExpense: apiBalance.total_expenses,
    totalSavings: apiBalance.total_savings,
    balance: apiBalance.balance
  }
}

export const getCurrentBalance = async (
  {
    filters
  }: {
    filters?: string
  } = {},
  userId: string
): Promise<Balance> => {
  try {
    const res = await fetch(`${API_URL}/current/${userId}?${filters}`, options)
    if (!res.ok) throw new Error('Error al obtener el balance')

    const data = await res.json()
    const balance: ApiBalance = data
    const mappedBalance: Balance = mapApiBalance(balance)
    return mappedBalance
  } catch {
    throw new Error('Error al obtener el balance')
  }
}
