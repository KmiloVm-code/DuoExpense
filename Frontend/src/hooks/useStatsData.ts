import { useDataContext } from '../contexts/DataContext'
import { convertValue } from '../utils/formatters'
import { TrendingUp, CreditCard, CircleDollarSign } from 'lucide-react'
import React from 'react'

const useStatsData = () => {
  const { billsData, icomeData } = useDataContext(undefined)

  const statsData = [
    {
      title: 'Balance Total',
      value: `${convertValue(icomeData.data.reduce((acc, icome) => acc + Number(icome.valor), 0) - billsData.data.reduce((acc, bill) => acc + Number(bill.valor), 0))}`,
      icon: React.createElement(CircleDollarSign, { color: 'white' }),
      bgColor: 'bg-[#9333ea]'
    },
    {
      title: 'Ingresos',
      value: `${convertValue(icomeData.data.reduce((acc, icome) => acc + Number(icome.valor), 0))}`,
      icon: React.createElement(TrendingUp, { color: '#34d399' })
    },
    {
      title: 'Gastos',
      value: `${convertValue(billsData.data.reduce((acc, bill) => acc + Number(bill.valor), 0))}`,
      icon: React.createElement(CreditCard, { color: '#f87171' })
    },
    {
      title: 'Ahorros',
      value: `${convertValue(icomeData.data.reduce((acc, icome) => acc + Number(icome.valor), 0) - billsData.data.reduce((acc, bill) => acc + Number(bill.valor), 0))}`,
      icon: React.createElement(CircleDollarSign, { color: '#9333ea' })
    }
  ]
  return statsData
}

export default useStatsData
