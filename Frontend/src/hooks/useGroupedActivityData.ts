import { useMemo } from 'react'
import { useCategories } from '../hooks/UseCategories'

type Activity = {
  id: number
  text: string
  amount: string
  type: 'ingreso' | 'gasto'
  date: string
  idCategory?: number
}

type ChartData = {
  month: string
  ingresos: number
  gastos: number
}

type CategoryData = {
  category: string
  gasto: number
  fill: string
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

const useGroupedActivityData = (activityData: Activity[]) => {
  const categories = useCategories()

  const groupedByMonth = useMemo(() => {
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

  const groupedByCategory = useMemo(() => {
    const categoryData: Record<string, CategoryData> = {}
    activityData.forEach((item) => {
      if (item.type === 'gasto' && item.idCategory) {
        const category =
          categories.categories.find(
            (category) => category.id === item.idCategory
          )?.nombre || 'Sin categoría'

        if (!categoryData[category]) {
          categoryData[category] = {
            category,
            gasto: 0,
            fill: `var(--color-${category.toLowerCase().replace(/\s+/g, '-')})`
          }
        }

        const numericAmount = parseInt(item.amount.replace(/\D/g, ''))
        categoryData[category].gasto += numericAmount
      }
    })

    return Object.entries(categoryData).map(([category, { gasto, fill }]) => ({
      category,
      gasto,
      fill
    }))
  }, [activityData, categories])

  return { groupedByMonth, groupedByCategory }
}

export default useGroupedActivityData
