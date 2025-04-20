import { useState, useEffect, useCallback } from 'react'
import debounce from 'just-debounce-it'

import { DateValue } from '@internationalized/date'
import { RangeValue } from '@heroui/react'
import { getLastTransactionsService } from '../services/transactions'
import { Transaction } from '../types/Transaction'
import { useAuth } from '../contexts/AuthContext'
import { getBudgetsService, getBudgetSummaryService } from '../services/budget'
import { Budget, BudgetSummary } from '../types/Budget'
import { useDataContext } from '../contexts/DataContext'

interface useDataProps<T> {
  getDataService: (params: { filters?: string }) => Promise<T[]>
  createDataService: (data: T) => Promise<T>
  updateDataService: (data: T) => Promise<T>
  deleteDataService: (params: { id: number }) => Promise<void>
}

export const useData = <T extends Transaction>() => {
  const [data, setData] = useState<T[]>([])
  const [lastTransaction, setLastTransaction] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary[]>([])
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const userId = user?.userId || ''
  const { pickerValue } = useDataContext()

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
  }, [userId, pickerValue])

  const getBudgetSummary = useCallback(async () => {
    try {
      if (!userId) return
      const fetchedData = await getBudgetSummaryService(
        {
          filters: new URLSearchParams({
            startDate: pickerValue.start.toString(),
            endDate: pickerValue.end.toString()
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
  }, [userId, pickerValue])

  useEffect(() => {
    if (userId) {
      getLastTransactions()
      getBudgets()
      getBudgetSummary()
    }
  }, [getLastTransactions, getBudgets, getBudgetSummary, userId])

  // const getData = useCallback(async () => {
  //   try {
  //     if (!userid) return
  //     const filters = new URLSearchParams({
  //       id_usuario: userid,
  //       startDate: new Date(pickerValue.start.toString()).toISOString(),
  //       endDate: new Date(pickerValue.end.toString()).toISOString()
  //     }).toString()
  //     console.log('filters: ', filters)
  //     const fetchedData = await services.getDataService({ filters })
  //     fetchedData.sort((a, b) => a.id - b.id)
  //     setData(fetchedData)
  //     setError(null)
  //   } catch {
  //     setError('Error al cargar los datos')
  //   }
  // }, [userid, services, pickerValue])

  // useEffect(() => {
  //   if (userid) {
  //     getData()
  //   }
  // }, [getData, userid])

  // const createData = async (newData: T) => {
  //   try {
  //     const createdData = await services.createDataService(newData)
  //     setData((prevData: T[]) => [...prevData, createdData])
  //   } catch {
  //     setError('Error al crear el registro')
  //   }
  // }

  // const updateData = async (updatedData: T) => {
  //   try {
  //     await services.updateDataService(updatedData)
  //     getData()
  //   } catch {
  //     setError('Error al actualizar el registro')
  //   }
  // }

  // const deleteData = async (id: number) => {
  //   try {
  //     await services.deleteDataService({ id })
  //     getData()
  //   } catch {
  //     setError('Error al eliminar el registro')
  //   }
  // }

  // const searchData = debounce(async (query: string) => {
  //   if (!userid) return
  //   if (!query) {
  //     getData()
  //     return
  //   }

  //   const filters = new URLSearchParams({
  //     id_usuario: userid,
  //     concepto: query
  //   }).toString()
  //   try {
  //     const filteredData = await services.getDataService({ filters })
  //     setData(filteredData)
  //     setError(null)
  //   } catch {
  //     setError('Error al buscar el registro')
  //   }
  // }, 500)

  // const handleErrors = () => {
  //   setError(null)
  // }

  return {
    data,
    error,
    lastTransaction,
    budgets,
    budgetSummary
  }
}
