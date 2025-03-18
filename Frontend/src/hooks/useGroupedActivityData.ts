import { useMemo } from 'react'

type Activity = {
  id: number
  text: string
  amount: string
  type: 'ingreso' | 'gasto'
  date: string
}

type ChartData = {
  month: string
  ingresos: number
  gastos: number
}

const months: string[] = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
]

const useGroupedActivityData = (activityData: Activity[]): ChartData[] => {
  return useMemo(() => {
    const groupedData: Record<string, ChartData> = {}
    activityData.forEach((item) => {
      const [year, month] = item.date.split('-')
      const monthName = months[Number(month) - 1]
      const key = `${year}-${month}`

      if (!groupedData[key]) {
        groupedData[key] = { month: monthName, ingresos: 0, gastos: 0 }
      }

      const numericAmount = parseInt(item.amount.replace(/\D/g, ''))

      if (item.type === 'ingreso') {
        groupedData[key].ingresos += numericAmount
      } else {
        groupedData[key].gastos += numericAmount
      }
    })

    return Object.values(groupedData)
  }, [activityData])
}

export default useGroupedActivityData
