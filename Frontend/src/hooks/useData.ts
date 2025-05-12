import { useState, useEffect, useCallback } from 'react'
import { getLastTransactionsService } from '../services/transactions'
import { Transaction } from '../types/Transaction'
import { useAuth } from '../contexts/AuthContext'
import { getBudgetsService, getBudgetSummaryService } from '../services/budget'
import { Budget, BudgetSummary } from '../types/Budget'
import { useDateRange } from '../contexts/DateRangeContext'
import { useRefresh } from '../contexts/RefreshContext'

export const useData = () => {
  const [lastTransaction, setLastTransaction] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary[]>([])
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const userId = user?.userId || ''
  const { dateRange } = useDateRange()
  const { refreshKey } = useRefresh()

  const getLastTransactions = useCallback(async () => {
    try {
      if (!userId) return
      const fetchedData = await getLastTransactionsService({}, userId)
      setLastTransaction(fetchedData)
      setError(null)
    } catch {
      setError('Error al cargar los datos')
    }
  }, [userId])

  const getBudgets = useCallback(async () => {
    try {
      if (!userId) return
      const fetchedData = await getBudgetsService(userId)
      console.log('fetchedData: ', fetchedData)
      setBudgets(fetchedData)
      setError(null)
    } catch {
      setError('Error al cargar los datos')
    }
  }, [userId, dateRange])

  const getBudgetSummary = useCallback(async () => {
    try {
      if (!userId) return
      const fetchedData = await getBudgetSummaryService(
        {
          filters: new URLSearchParams({
            startDate: dateRange.start.toString(),
            endDate: dateRange.end.toString()
          }).toString()
        },
        userId
      )
      console.log('BudgetSummary: ', fetchedData)
      setBudgetSummary(fetchedData)
      setError(null)
    } catch {
      setError('Error al cargar los datos')
    }
  }, [userId, dateRange])

  useEffect(() => {
    if (userId) {
      getLastTransactions()
      getBudgets()
      getBudgetSummary()
    }
  }, [getLastTransactions, getBudgets, getBudgetSummary, userId, refreshKey])

  return {
    lastTransaction,
    budgets,
    budgetSummary,
    error
  }
}
