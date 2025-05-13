import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { getLocalTimeZone, today } from '@internationalized/date'
import { DateRange } from 'react-day-picker'

interface DateRangeContextType {
  dateRange: DateRange | undefined
  changeDateRange: (dateRange: DateRange) => void
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
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(
      today(getLocalTimeZone()).subtract({ months: 1 }).toString()
    ),
    to: new Date(today(getLocalTimeZone()).toString())
  })

  const changeDateRange = (dateRange: DateRange) => {
    setDateRange(dateRange)
  }

  const value = useMemo(
    () => ({
      dateRange,
      changeDateRange,
      setDateRange
    }),
    [dateRange, changeDateRange, setDateRange]
  )

  return (
    <DateRangeContext.Provider value={value}>
      {children}
    </DateRangeContext.Provider>
  )
}
