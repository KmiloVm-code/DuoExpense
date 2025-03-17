import { useState } from 'react'
import { useDataContext } from '../contexts/DataContext'
import { convertValue } from '../utils/formatters'

import {
  ChartLine,
  TrendingUp,
  CreditCard,
  CircleDollarSign
} from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

// import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
// import { Line } from 'react-chartjs-2'
// import {
//   FiDollarSign,
//   FiCreditCard,
//   FiTrendingUp
//   // FiFilter
// } from 'react-icons/fi'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '../components/ui/chart'
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// } from 'chart.js'

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// )

function DashboardPage() {
  const { billsData, icomeData } = useDataContext(undefined)

  const [panels, setPanels] = useState<
    { id: string; type: 'stats' | 'activity' | 'chart'; title: string }[]
  >([
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
      icon: <CircleDollarSign color="white" />
    },
    {
      title: 'Ingresos',
      value: `${convertValue(icomeData.data.reduce((acc, icome) => acc + Number(icome.valor), 0))}`,
      icon: <TrendingUp color="#34d399" />
    },
    {
      title: 'Gastos',
      value: `${convertValue(billsData.data.reduce((acc, bill) => acc + (bill.valor || 0), 0))}`,
      icon: <CreditCard color="#f87171" />
    },
    {
      title: 'Ahorros',
      value: `${convertValue(icomeData.data.reduce((acc, icome) => acc + Number(icome.valor), 0) - billsData.data.reduce((acc, bill) => acc + Number(bill.valor), 0))}`, // Cambiar por el valor de los ahorros
      icon: <CircleDollarSign color="#9333ea" />
    }
  ]

  type Activity = {
    id: number
    text: string
    amount: string
    type: 'ingreso' | 'gasto'
    date: string
  }

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
        date: bill.fecha?.split('T')[0] ?? ''
      })
    )
  ]

  console.log('ActivityData: ', activityData)

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

  const groupActivityData = (activityData: Activity[]): ChartData[] => {
    const groupedData: Record<string, ChartData> = {}

    activityData.forEach((item) => {
      const [year, month] = item.date.split('-')
      const monthName = months[Number(month) - 1]
      const key = `${year}-${month}`

      if (!groupedData[key]) {
        groupedData[key] = { month: monthName, ingresos: 0, gastos: 0 }
      }

      console.log('Item amount: ', item.amount)

      const numericAmount = parseInt(item.amount.replace(/\D/g, ''))

      if (item.type === 'ingreso') {
        groupedData[key].ingresos += numericAmount
      } else {
        groupedData[key].gastos += numericAmount
      }
    })

    console.log('GroupedData: ', groupedData)

    return Object.values(groupedData)
  }

  const chartData: ChartData[] = groupActivityData(activityData)

  console.log('ChartData: ', chartData)

  const chartConfig = {
    gastos: {
      color: '#f87171',
      label: 'Gastos'
    },
    ingresos: {
      color: '#34d399',
      label: 'Ingresos'
    }
  } satisfies ChartConfig

  console.log('ChartData: ', chartData)

  const filterActivityData = () => {
    return activityData
      .sort(
        (a, b) =>
          new Date(b.date || '').getTime() - new Date(a.date || '').getTime()
      )
      .slice(0, 5)
  }

  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl::grid-cols-[2fr,repeat(4,1fr)] gap-4">
      {statsData.map((stat, index) =>
        index === 0 ? (
          <article
            key={index}
            className="flex flex-col relative p-6 bg-[#9333ea] rounded-2xl shadow-md md:col-span-2"
          >
            <span className="flex items-center justify-between mb-3 w-full space-x-2">
              <h3 className="text-white text-base lg:text-lg font-bold">
                {statsData[0].title}
              </h3>
              <figure className="p-1 border rounded-full bg-[#fff3]">
                {statsData[0].icon}
              </figure>
            </span>
            <p className="text-white text-xl md:text-2xl lg:text-3xl font-extrabold mb-12">
              {statsData[0].value}
            </p>
          </article>
        ) : (
          <article
            key={index}
            className="flex flex-col relative p-6 bg-white rounded-2xl shadow-md"
          >
            <span className="flex items-center justify-between mb-3 w-full space-x-2">
              <h3 className="text-sm font-medium">{stat.title}</h3>
              <figure className="p-1 border rounded-full">{stat.icon}</figure>
            </span>
            <p className="font-bold text-2xl mb-20">{stat.value}</p>
          </article>
        )
      )}

      <article className="flex flex-col relative p-6 bg-white rounded-2xl shadow-md lg:col-span-1 sm:col-span-2 md:col-start-3 md:row-start-1 lg:col-start-6">
        <span className="flex items-center justify-between mb-3 w-full space-x-2">
          <h3 className="text-sm font-medium">Acciones Rápidas</h3>
        </span>
        <div className="flex flex-col space-y-4">
          <button className="flex items-center justify-between py-1 px-2 rounded-lg bg-[#f87171] text-white">
            <span className="flex items-center space-x-2">
              <CreditCard />
              <span>Gasto</span>
            </span>
          </button>
          <button className="flex items-center justify-between py-1 px-2 rounded-lg bg-[#34d399] text-white">
            <span className="flex items-center space-x-2">
              <TrendingUp />
              <span>Ingreso</span>
            </span>
          </button>
        </div>
      </article>

      <article className="grid justify-items-stretch lg:col-span-4 lg:row-start-2 md:col-span-2 md:row-span-1 lg:row-span-2 bg-white rounded-2xl shadow-md p-6">
        <span className="flex items-center space-x-2">
          <ChartLine color="#9333EA" />
          <h3 className="text-2xl font-semibold">Resumen Financiero</h3>
        </span>
        <p className="text-sm mb-5">
          Visión general de tus finanzas en los últimos 30 días
        </p>

        <ChartContainer config={chartConfig} className="max-h-96">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 20,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              className="text-gray-500 font-semibold"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => convertValue(value)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="w-48" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="ingresos"
              stroke="#34d399"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="gastos"
              stroke="#f87171"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </article>

      <article className="bg-white p-6 rounded-2xl shadow-md md:col-span-1 md:row-span-1 lg:col-span-2 lg:row-span-2">
        <span className="flex items-center space-x-2">
          <CreditCard color="#9333EA" />
          <h3 className="text-2xl font-semibold">Transacciones Recientes</h3>
        </span>
        <p className="text-sm mb-3">Tus últimas 5 transacciones</p>
        {filterActivityData().map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between p-4"
          >
            <div className="flex flex-col">
              <h3 className="text-sm font-medium">{activity.text}</h3>
              <small className="text-xs text-gray-500">{activity.date}</small>
            </div>
            <p
              className={`text-sm font-bold ${activity.type === 'ingreso' ? 'text-green-500' : 'text-red-500'}`}
            >
              {activity.amount}
            </p>
          </div>
        ))}
      </article>

      <div className="lg:col-span-3 lg:row-span-2 md:row-start-5 lg:row-start-4">
        8
      </div>
      <div className="lg:col-span-3 lg:row-span-2 lg:col-start-4 md:row-start-5 lg:row-start-4">
        9
      </div>
      <div className="lg:col-span-6 md:row-start-6 lg:row-start-6">10</div>
    </main>
  )
}

export default DashboardPage
