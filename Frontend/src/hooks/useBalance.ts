import { useEffect, useState, useCallback } from 'react'
import { getCurrentBalance } from '../services/balance'
import { Balance } from '../types/Balance'
import { useAuth } from '../contexts/AuthContext'

export const useBalance = (startDate: string, endDate: string) => {
  const [balance, setBalance] = useState<Balance>({
    totalIncome: 0,
    totalExpense: 0,
    totalSavings: 0,
    balance: 0
  })

  const [error, setError] = useState<unknown | null>(null)
  const { user } = useAuth()
  const userId = user?.userId || ''

  const getBalance = useCallback(async () => {
    const filters = new URLSearchParams({
      startDate,
      endDate
    }).toString()
    try {
      const balanceData = await getCurrentBalance({ filters }, userId)
      setBalance(balanceData)
    } catch (error) {
      setError(error)
    }
  }, [startDate, endDate, userId])

  useEffect(() => {
    getBalance()
  }, [getBalance])

  return { balance, error }
}
