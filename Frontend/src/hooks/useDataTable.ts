import { useEffect, useState, useCallback } from 'react'
import { getTransactionsService } from '../services/transactions'
import { Transaction } from '../types/Transaction'
import { useAuth } from '../contexts/AuthContext'
import { useDateRange } from '../contexts/DateRangeContext'
import { useRefresh } from '../contexts/RefreshContext'

export const useDataTable = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown | null>(null)
  const { user } = useAuth()
  const userId = user?.userId || ''
  const { dateRange } = useDateRange()
  const { refreshKey } = useRefresh()

  const getTransactions = useCallback(async () => {
    try {
      if (!userId) return
      setLoading(true)
      const startDate = dateRange.start.toString()
      const endDate = dateRange.end.toString()
      const transactionsData = await getTransactionsService(
        { filters: `&startDate=${startDate}&endDate=${endDate}` },
        userId
      )
      setTransactions(transactionsData)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [userId, dateRange])

  useEffect(() => {
    getTransactions()
  }, [getTransactions, refreshKey])

  return {
    transactions,
    loading,
    error
  }
}
