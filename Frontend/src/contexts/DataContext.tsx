import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { DateValue, getLocalTimeZone, today } from '@internationalized/date'
import { RangeValue } from '@heroui/react'
import { useBalance } from '../hooks/useBalance'
import { Balance } from '../types/Balance'

interface DataContextType {
  pickerValue: RangeValue<DateValue>
  setPickerValue: (value: RangeValue<DateValue>) => void

  balance: Balance
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const useDataContext = () => {
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
  const [pickerValue, setPickerValue] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()).subtract({ months: 1 }),
    end: today(getLocalTimeZone())
  })

  const { balance } = useBalance(
    pickerValue.start?.toString() ?? '',
    pickerValue.end?.toString() ?? ''
  )

  const value = useMemo(
    () => ({
      pickerValue,
      setPickerValue,
      balance
    }),
    [pickerValue, setPickerValue, balance]
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
