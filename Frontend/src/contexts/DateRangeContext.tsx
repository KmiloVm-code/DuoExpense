import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { DateValue, getLocalTimeZone, today } from '@internationalized/date'
import { RangeValue } from '@heroui/react'

interface DateRangeContextType {
  dateRange: RangeValue<DateValue>
  setDateRange: (value: RangeValue<DateValue>) => void
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(
  undefined
)

export const useDateRange = () => {
  const context = useContext(DateRangeContext)
  if (!context) {
    throw new Error('useDateRange must be used within a DateRangeProvider')
  }
  return context
}

interface DateRangeProviderProps {
  children: ReactNode
}

export const DateRangeProvider = ({ children }: DateRangeProviderProps) => {
  const [dateRange, setDateRange] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()).subtract({ months: 1 }),
    end: today(getLocalTimeZone())
  })

  const value = useMemo(
    () => ({
      dateRange,
      setDateRange
    }),
    [dateRange, setDateRange]
  )

  return (
    <DateRangeContext.Provider value={value}>
      {children}
    </DateRangeContext.Provider>
  )
}
