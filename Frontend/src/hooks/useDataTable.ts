import { useEffect, useState, useCallback } from 'react'
import { getTransactionsService } from '../services/transactions'
import { Transaction } from '../types/Transaction'
import { useAuth } from '../contexts/AuthContext'

export const useDataTable = (filters: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown | null>(null)
  const { user } = useAuth()
  const userId = user?.userId || ''

  const getTransactions = useCallback(async () => {
    try {
      if (!userId) return
      setLoading(true)
      const transactionsData = await getTransactionsService({ filters }, userId)
      setTransactions(transactionsData)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [filters, userId])

  useEffect(() => {
    getTransactions()
  }, [getTransactions])

  return { transactions, loading, error }
}
