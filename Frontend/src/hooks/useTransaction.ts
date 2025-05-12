import { useState, useCallback } from 'react'
import {
  createTransactionService,
  updateTransactionService,
  deleteTransactionService
} from '../services/transactions'
import { Transaction } from '../types/Transaction'
import { useAuth } from '../contexts/AuthContext'
import { useRefresh } from '../contexts/RefreshContext'

export const useTransaction = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown | null>(null)
  const { user } = useAuth()
  const userId = user?.userId || ''
  const { triggerRefresh } = useRefresh()

  const createTransaction = useCallback(
    async (transaction: Transaction) => {
      setLoading(true)
      try {
        if (!userId) return
        await createTransactionService(transaction, userId)
        triggerRefresh()
        setError(null)
      } catch {
        setError('Error al cargar los datos')
      } finally {
        setLoading(false)
      }
    },
    [userId]
  )

  const updateTransaction = useCallback(
    async (transaction: Transaction) => {
      setLoading(true)
      try {
        if (!userId || !transaction.transactionId) return
        await updateTransactionService(
          transaction,
          transaction.transactionId.toString()
        )
        triggerRefresh()
        setError(null)
      } catch {
        setError('Error al actualizar la transacción')
      } finally {
        setLoading(false)
      }
    },
    [userId]
  )

  const deleteTransaction = useCallback(
    async (transactionId: string) => {
      setLoading(true)
      try {
        if (!userId) return
        await deleteTransactionService(transactionId)
        triggerRefresh()
        setError(null)
      } catch {
        setError('Error al eliminar la transacción')
      } finally {
        setLoading(false)
      }
    },
    [userId]
  )

  return {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loading,
    error
  }
}
