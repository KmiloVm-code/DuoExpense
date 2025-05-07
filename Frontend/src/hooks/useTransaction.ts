import { useEffect, useState, useCallback } from 'react'

import { createTransactionService } from '../services/transactions'
import { Transaction } from '../types/Transaction'
import { useAuth } from '../contexts/AuthContext'

export const useTransaction = () => {
  const [transaction, setTransaction] = useState<Transaction>()
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const userId = user?.userId || ''

  const createTransaction = useCallback(
    async (transaction: Transaction) => {
      try {
        if (!userId) return
        const fetchedData = await createTransactionService(transaction, userId)
        setTransaction((prevTransaction) =>
          prevTransaction ? { ...prevTransaction, ...fetchedData } : fetchedData
        )
        setError(null)
      } catch {
        setError('Error al cargar los datos')
      }
    },
    [userId]
  )

  return { transaction, error, createTransaction }
}
