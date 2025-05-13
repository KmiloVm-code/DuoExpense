import { useDateRange } from '../contexts/DateRangeContext'
import { convertValue } from '../utils/formatters'
import { TrendingUp, CreditCard, CircleDollarSign } from 'lucide-react'
import React from 'react'
import { useBalance } from '../hooks/useBalance'

const useStatsData = () => {
  const { dateRange } = useDateRange()
  const { balance } = useBalance(
    dateRange?.from?.toISOString() ?? '',
    dateRange?.to?.toISOString() ?? ''
  )

  const statsData = [
    {
      title: 'Balance Total',
      value: `${convertValue(balance.balance)}`,
      icon: React.createElement(CircleDollarSign, { color: 'white' }),
      bgColor: 'bg-[#9333ea]'
    },
    {
      title: 'Ingresos',
      value: `${convertValue(balance?.totalIncome || 0)}`,
      icon: React.createElement(TrendingUp, { color: '#34d399' })
    },
    {
      title: 'Gastos',
      value: `${convertValue(balance?.totalExpense || 0)}`,
      icon: React.createElement(CreditCard, { color: '#f87171' })
    },
    {
      title: 'Ahorros',
      value: `${convertValue(balance?.totalSavings || 0)}`,
      icon: React.createElement(CircleDollarSign, { color: '#9333ea' })
    }
  ]
  return statsData
}

export default useStatsData
