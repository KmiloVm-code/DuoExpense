import { useState } from 'react'
import { useDataContext } from '../contexts/DataContext'
import { convertValue } from '../utils/formatters'

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Line } from 'react-chartjs-2'
import {
  FiDollarSign,
  FiCreditCard,
  FiTrendingUp
  // FiFilter
} from 'react-icons/fi'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

function DashboardPage () {
  const { billsData, icomeData } = useDataContext()

  const [panels, setPanels] = useState<{ id: string; type: 'stats' | 'activity' | 'chart'; title: string }[]>([
    {
      id: 'stats',
      type: 'stats',
      title: 'Resumen Financiero'
    },
    {
      id: 'activity',
      type: 'activity',
      title: 'Transacciones Recientes'
    },
    {
      id: 'chart',
      type: 'chart',
      title: 'Flujo de Dinero'
    }
  ])

  console.log(icomeData.data[0]?.valor)
  console.log(icomeData.data[0]?.valor)

  const statsData = [
    {
      title: 'Balance Total',
      value: `${convertValue(icomeData.data.reduce((acc, icome) => acc + Number(icome.valor), 0) - billsData.data.reduce((acc, bill) => acc + Number(bill.valor), 0))}`,
      icon: <FiDollarSign className="text-green-500" size={24} />
    },
    {
      title: 'Ingresos Mensuales',
      value: `${convertValue(icomeData.data.reduce((acc, icome) => acc + Number(icome.valor), 0))}`,
      icon: <FiTrendingUp className="text-blue-500" size={24} />
    },
    {
      title: 'Gastos Mensuales',
      value: `${convertValue(billsData.data.reduce((acc, bill) => acc + (bill.valor || 0), 0))}`,
      icon: <FiCreditCard className="text-red-500" size={24} />
    }
  ]

  const activityData = [
    ...icomeData.data.map((icome) => (
      {
        id: icome.id_ingreso,
        text: icome.concepto,
        amount: `+ ${convertValue(Number(icome.valor))}`,
        type: 'ingreso',
        date: icome.fecha?.split('T')[0]
      })),

    ...billsData.data.map((bill) => (
      {
        id: bill.id_gasto,
        text: bill.concepto,
        amount: `- ${convertValue(Number(bill.valor ?? 0))}`,
        type: 'gasto',
        date: bill.fecha?.split('T')[0]
      }))
  ]

  const chartData = {
    labels: activityData.map((activity) => activity.date),
    datasets: [
      {
        label: 'Ingresos',
        data: icomeData.data.map((icome) => Number(icome.valor)),
        borderColor: 'rgb(75, 192, 92)',
        tension: 0.1
      },
      {
        label: 'Gastos',
        data: billsData.data.map((bill) => Number(bill.valor)),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  }

  console.log('ChartData: ', chartData)

  const handleDragEnd = (result: { destination: { index: number } | null; source: { index: number } }) => {
    if (!result.destination) return
    const items = Array.from(panels)
    if (!result.destination) return
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setPanels(items)
  }

  const filterActivityData = () => {
    return activityData.sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime()).slice(0, 5)
  }

  const renderPanel = (panel: { id?: string; type: 'stats' | 'activity' | 'chart'; title?: string }) => {
    switch (panel.type) {
      case 'stats':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border-gray-200 border-solid border-small shadow-md text-center flex flex-col items-center"
              >
                {stat.icon}
                <h3 className="text-gray-500 text-sm mt-2">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            ))}
          </div>
        )
      case 'activity':
        return (
          <div>
            <div className="space-y-4">
              {filterActivityData().map((activity) => (
                <div
                  key={activity.id}
                  className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md border-gray-200 border-solid border-small text-wrap"
                >
                  <span className="text-gray-800">{activity.text}</span>
                  <div className="text-right">
                    <span className={`font-bold ${activity.type === 'ingreso' ? 'text-green-500' : 'text-red-500'}`}>
                      {activity.amount}
                    </span>
                    <p className="text-gray-500 text-sm">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'chart':
        return (
          <div className="bg-white p-4 rounded-lg shadow-md border-gray-200 border-solid border-small overflow-x-auto">
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        )
      default:
        return null
    }
  }

  return (

        <main className="relative top-36 lg:left-64 h-screen p-4 lg:w-[calc(100%-250px)]">

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="dashboard-panels">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-6"
                >
                  {panels.map((panel, index) => (
                    <Draggable
                      key={panel.id}
                      draggableId={panel.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white rounded-lg shadow-md border-gray-200 border-solid border-small p-4 md:p-6"
                        >
                          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                            {panel.title}
                          </h2>
                          {renderPanel(panel)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </main>
  )
}

export default DashboardPage
