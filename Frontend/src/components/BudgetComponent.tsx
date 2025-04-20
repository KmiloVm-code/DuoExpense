import { useData } from '../hooks/useData'
import { ChartColumn } from 'lucide-react'
import { Progress } from './ui/progress'
import { convertValue } from '../utils/formatters'

const BudgetComponent = () => {
  const { budgetSummary } = useData()

  function ramdomBgColor() {
    const colors = [
      'purple',
      'blue',
      'green',
      'red',
      'yellow',
      'pink',
      'orange'
    ]
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
  }

  return (
    <>
      <span className="flex items-center space-x-2">
        <ChartColumn color="#9333EA" />
        <h3 className="text-2xl font-semibold">Progreso del Presupuesto</h3>
      </span>
      <p className="text-sm mb-5">Tu progreso de presupuesto por categoría</p>

      {budgetSummary.length === 0 && (
        <div className="flex items-center justify-center h-2/4 w-full p-4 text-gray-500">
          No hay datos para mostrar
        </div>
      )}

      {budgetSummary.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {budgetSummary.map((budget, index) => (
            <div key={index} className="flex flex-col space-y-2 p-4">
              <div className="flex justify-between items-center">
                <span className="text-medium font-medium">
                  {budget.category}
                </span>
                <div className="text-sm font-normal">
                  <span className="text-gray-500">
                    {convertValue(budget.spent)}
                  </span>
                  <span className="text-gray-500"> / </span>
                  <span className="text-gray-800 font-medium">
                    {convertValue(budget.budgeted)}
                  </span>
                </div>
              </div>
              <Progress
                value={budget.usage_percentage}
                max={100}
                className="bg-gray-300 rounded-lg"
                indicatorClassName={`bg-${ramdomBgColor()}-500 rounded-lg`}
              />
              <div className="text-sm font-normal text-gray-500">
                {budget.usage_percentage > 100 ? (
                  <span className="text-red-500">
                    Te has pasado un {budget.usage_percentage - 100}% de tu
                    presupuesto
                  </span>
                ) : (
                  <span>
                    {budget.usage_percentage}% de tu presupuesto utilizado
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default BudgetComponent
