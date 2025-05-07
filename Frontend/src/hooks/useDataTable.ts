import { useEffect, useState, useCallback } from 'react'
import {
  getTransactionsService,
  createTransactionService,
  updateTransactionService,
  deleteTransactionService
} from '../services/transactions'
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

  const createTransaction = useCallback(
    async (transaction: Transaction) => {
      try {
        if (!userId) return
        const fetchedData = await createTransactionService(transaction, userId)
        setTransactions((prevTransactions) =>
          prevTransactions
            ? [...prevTransactions, fetchedData].sort(
                (a, b) =>
                  new Date(b.transactionDate).getTime() -
                  new Date(a.transactionDate).getTime()
              )
            : [fetchedData]
        )
        setError(null)
      } catch {
        setError('Error al cargar los datos')
      }
    },
    [userId]
  )

  const updateTransaction = useCallback(
    async (transaction: Transaction) => {
      try {
        if (!userId || !transaction.transactionId) return
        const fetchedData = await updateTransactionService(
          transaction,
          transaction.transactionId.toString()
        )
        setTransactions((prevTransactions) =>
          prevTransactions.map((t) =>
            t.transactionId === transaction.transactionId ? fetchedData : t
          )
        )
        setError(null)
      } catch {
        setError('Error al actualizar la transacción')
      }
    },
    [userId]
  )

  const deleteTransaction = useCallback(
    async (transactionId: string) => {
      try {
        if (!userId) return
        await deleteTransactionService(transactionId)
        setTransactions((prevTransactions) =>
          prevTransactions.filter(
            (t) => t.transactionId?.toString() !== transactionId
          )
        )
        setError(null)
      } catch {
        setError('Error al eliminar la transacción')
      }
    },
    [userId]
  )

  return {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction
  }
}
