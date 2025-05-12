import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  getTransactionsSummaryService,
  getExpensesByCategoryService
} from '../services/transactions'
import { SummaryTransaction } from '../types/Transaction'
import { useRefresh } from '../contexts/RefreshContext'

export const useChartData = (startDate: string, endDate: string) => {
  const [chartSummary, setChartSummary] = useState<SummaryTransaction[]>([])
  const [chartSummaryByCategory, setChartSummaryByCategory] = useState<
    SummaryTransaction[]
  >([])
  const [error, setError] = useState<unknown | null>(null)
  const { user } = useAuth()
  const userId = user?.userId || ''
  const { refreshKey } = useRefresh()

  const getChartSummaryData = useCallback(async () => {
    const filters = new URLSearchParams({
      startDate,
      endDate
    }).toString()
    try {
      const summaryData = await getTransactionsSummaryService(
        { filters },
        userId
      )
      setChartSummary(summaryData)
    } catch (error) {
      setError(error)
    }
  }, [startDate, endDate, userId])

  const getChartSummaryByCategory = useCallback(async () => {
    const filters = new URLSearchParams({
      startDate,
      endDate
    }).toString()
    try {
      const summaryData = await getExpensesByCategoryService(
        { filters },
        userId
      )
      setChartSummaryByCategory(summaryData)
    } catch (error) {
      setError(error)
    }
  }, [startDate, endDate, userId])

  useEffect(() => {
    getChartSummaryData()
    getChartSummaryByCategory()
  }, [getChartSummaryData, getChartSummaryByCategory, refreshKey])

  return { chartSummary, chartSummaryByCategory, error }
}
