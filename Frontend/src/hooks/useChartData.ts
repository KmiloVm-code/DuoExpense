import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  getTransactionsSummaryService,
  getExpensesByCategoryService
} from '../services/transactions'
import { SummaryTransaction } from '../types/Transaction'
import { useRefresh } from '../contexts/RefreshContext'
import { useDateRange } from '../contexts/DateRangeContext'

export const useChartData = () => {
  const [chartSummary, setChartSummary] = useState<SummaryTransaction[]>([])
  const [chartSummaryByCategory, setChartSummaryByCategory] = useState<
    SummaryTransaction[]
  >([])
  const [error, setError] = useState<unknown | null>(null)
  const { user } = useAuth()
  const userId = user?.userId || ''
  const { refreshKey } = useRefresh()
  const { dateRange } = useDateRange()

  const getChartSummaryData = useCallback(async () => {
    const filters = new URLSearchParams({
      startDate: dateRange?.from?.toISOString() ?? '',
      endDate: dateRange?.to?.toISOString() ?? ''
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
  }, [dateRange, userId])

  const getChartSummaryByCategory = useCallback(async () => {
    const filters = new URLSearchParams({
      startDate: dateRange?.from?.toISOString() ?? '',
      endDate: dateRange?.to?.toISOString() ?? ''
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
  }, [dateRange, userId])

  useEffect(() => {
    getChartSummaryData()
    getChartSummaryByCategory()
  }, [getChartSummaryData, getChartSummaryByCategory, refreshKey])

  return { chartSummary, chartSummaryByCategory, error }
}
