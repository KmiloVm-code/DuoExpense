import { useDataContext } from '../contexts/DataContext'
import { convertValue } from '../utils/formatters'

type Activity = {
  id: number
  text: string
  amount: string
  type: 'ingreso' | 'gasto'
  date: string
  idCategory?: number
}

const useActivityData = () => {
  const { billsData, icomeData } = useDataContext(undefined)

  const activityData = [
    ...icomeData.data.map(
      (icome): Activity => ({
        id: icome.id_ingreso ?? 0,
        text: icome.concepto,
        amount: `+ ${convertValue(Number(icome.valor))}`,
        type: 'ingreso' as 'ingreso',
        date: icome.fecha?.split('T')[0] ?? ''
      })
    ),

    ...billsData.data.map(
      (bill): Activity => ({
        id: bill.id_gasto ?? 0,
        text: bill.concepto,
        amount: `- ${convertValue(Number(bill.valor ?? 0))}`,
        type: 'gasto' as 'gasto',
        date: bill.fecha?.split('T')[0] ?? '',
        idCategory: bill.id_categoria
      })
    )
  ]

  return activityData
}

export default useActivityData
