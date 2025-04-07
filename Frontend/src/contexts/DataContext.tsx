import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { useData } from '../hooks/useData'
import { Bill } from '../Models/BillsModel'
import { Icome } from '../Models/IcomeModel'
import {
  createBillService,
  deleteBillService,
  getBillsService,
  updateBillService
} from '../services/bills'
import {
  createIcomeService,
  deleteIcomeService,
  getIncomeService,
  updateIcomeService
} from '../services/incomes'
import { useAuth } from './AuthContext'
import { DateValue, getLocalTimeZone, today } from '@internationalized/date'
import { RangeValue } from '@heroui/react'
import { useBalance } from '../hooks/useBalance'
import { Balance } from '../types/Balance'

interface DataContextType {
  pickerValue: RangeValue<DateValue>
  setPickerValue: (value: RangeValue<DateValue>) => void

  balance: Balance

  billsData: {
    data: Bill[]
    error: string | null
    createData: (newData: Bill) => Promise<void>
    updateData: (updatedData: Bill) => Promise<void>
    deleteData: (id: number) => Promise<void>
    searchData: (query: string) => void
    handleErrors: () => void
  }

  icomeData: {
    data: Icome[]
    error: string | null
    createData: (newData: Icome) => Promise<void>
    updateData: (updatedData: Icome) => Promise<void>
    deleteData: (id: number) => Promise<void>
    searchData: (query: string) => void
    handleErrors: () => void
  }
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const useDataContext = (p0: unknown) => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider')
  }
  return context
}

interface DataProviderProps {
  children: ReactNode
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const { user } = useAuth()
  const idUsuario = user?.userId ?? ''
  const [pickerValue, setPickerValue] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()).subtract({ months: 1 }),
    end: today(getLocalTimeZone())
  })
  const { balance } = useBalance(
    pickerValue.start?.toString() ?? '',
    pickerValue.end?.toString() ?? ''
  )

  console.log(pickerValue)

  const billServices = useMemo(
    () => ({
      getDataService: getBillsService,
      createDataService: createBillService,
      updateDataService: updateBillService,
      deleteDataService: deleteBillService
    }),
    []
  )

  const icomeServices = useMemo(
    () => ({
      getDataService: getIncomeService,
      createDataService: createIcomeService,
      updateDataService: updateIcomeService,
      deleteDataService: deleteIcomeService
    }),
    []
  )

  const billsData = useData<Bill>(idUsuario, billServices, pickerValue)
  const icomeData = useData<Icome>(idUsuario, icomeServices, pickerValue)

  const value = useMemo(
    () => ({
      billsData,
      icomeData,
      pickerValue,
      setPickerValue,
      balance
    }),
    [billsData, icomeData, pickerValue, setPickerValue, balance]
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
