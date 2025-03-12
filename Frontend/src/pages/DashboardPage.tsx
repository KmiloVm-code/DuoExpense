import { useState } from 'react'
import { useDataContext } from '../contexts/DataContext'
import { convertValue } from '../utils/formatters'

// import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
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
      icon: <FiDollarSign className="text-white" size={24} />
    },
    {
      title: 'Ingresos',
      value: `${convertValue(icomeData.data.reduce((acc, icome) => acc + Number(icome.valor), 0))}`,
      icon: <FiTrendingUp className="text-green-500" size={24} />
    },
    {
      title: 'Gastos',
      value: `${convertValue(billsData.data.reduce((acc, bill) => acc + (bill.valor || 0), 0))}`,
      icon: <FiCreditCard className="text-red-500" size={24} />
    },
    {
      title: 'Ahorros',
      value: `${convertValue(icomeData.data.reduce((acc, icome) => acc + Number(icome.valor), 0) - billsData.data.reduce((acc, bill) => acc + Number(bill.valor), 0))}`, // Cambiar por el valor de los ahorros
      icon: <FiDollarSign className="text-green-500" size={24} />
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  return (
    <main className="grid grid-cols-1 lg:grid-cols-[2fr,repeat(4,1fr)] lg:grid-rows-6 gap-4 p-4">

        {statsData.map((stat, index) => (
          index === 0
            ? (
            <article key={index} className="flex flex-col relative p-6 bg-[#9333ea] rounded-2xl shadow-md">
            <span className='flex items-center justify-between mb-3 w-full space-x-2'>
            <h3 className="text-white text-lg font-bold">{statsData[0].title}</h3>
            <figure className='p-1 border rounded-full bg-[#fff3]'>
              {statsData[0].icon}
            </figure>
            </span>
            <p className="text-white text-4xl font-extrabold mb-12">{statsData[0].value}</p>
        </article>
              )
            : (
        <article key={index} className="flex flex-col relative p-6 bg-white rounded-2xl shadow-md">
            <span className='flex items-center justify-between mb-3 w-full space-x-2'>
            <h3 className="text-sm font-medium">{stat.title}</h3>
            <figure className='p-1 border rounded-full'>
              {stat.icon}
            </figure>
            </span>
            <p className="font-bold text-2xl mb-20">{stat.value}</p>
        </article>
              )
        ))}

      <article className="lg:col-span-3 lg:row-start-2 lg:row-span-2 bg-white rounded-2xl shadow-md p-6">
        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </article>

      <article className="lg:col-span-2 lg:row-span-2 lg:col-start-4 lg:row-start-2">
      {filterActivityData().map((activity) => (
        <div key={activity.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium">{activity.text}</h3>
            <span className={`text-sm font-bold ${activity.type === 'ingreso' ? 'text-green-500' : 'text-red-500'}`}>{activity.amount}</span>
          </div>
          <span className="text-xs text-gray-500">{activity.date}</span>
        </div>
      ))}
      </article>
    <div className="lg:col-span-3 lg:row-span-2 lg:row-start-4">8</div>
    <div className="lg:col-span-3 lg:row-span-2 lg:col-start-4 lg:row-start-4">9</div>
    <div className="lg:col-span-6 lg:row-start-6">10</div>
    </main>
  )
}

export default DashboardPage
