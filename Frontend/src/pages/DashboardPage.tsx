import { convertValue } from '../utils/formatters'

import { ChartLine, TrendingUp, CreditCard, ChartPie } from 'lucide-react'
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis
} from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '../components/ui/chart'
import StatCard from '../components/StatCard'
import QuickActionButton from '../components/QuickActionButton'
import RecentTransaction from '../components/RecentTransaction'
import useStatsData from '../hooks/useStatsData'
import useActivityData from '../hooks/useActivityData'
import useGroupedActivityData from '../hooks/useGroupedActivityData'

function DashboardPage() {
  const statsData = useStatsData()
  const activityData = useActivityData()
  const { groupedByMonth, groupedByCategory } =
    useGroupedActivityData(activityData)

  console.log('Categorias', groupedByCategory)

  const chartConfig = {
    alimentacion: {
      label: 'Alimentacion',
      color: 'hsl(var(--chart-1))'
    },
    'salud-y-belleza': {
      label: 'Salud y Belleza',
      color: 'hsl(var(--chart-2))'
    },
    electronicos: {
      label: 'Electronicos',
      color: 'hsl(var(--chart-3))'
    },
    gastos: {
      color: '#f87171',
      label: 'Gastos'
    },
    ingresos: {
      color: '#34d399',
      label: 'Ingresos'
    }
  } satisfies ChartConfig

  const filterActivityData = () => {
    return activityData
      .sort(
        (a, b) =>
          new Date(b.date || '').getTime() - new Date(a.date || '').getTime()
      )
      .slice(0, 5)
  }

  return (
    <main className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-[2fr,repeat(4,1fr)] gap-4">
      {statsData.map((stat, index) =>
        index === 0 ? (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            type="mainCard"
          />
        ) : (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        )
      )}

      <article className="flex flex-col relative p-6 bg-white rounded-2xl shadow-md col-span-2 sm:col-span-1 lg:col-span-2 lg:row-start-2 lg:row-span-2 xl:row-start-1 xl:col-span-1 xl:row-span-1 xl:col-start-6">
        <span className="flex items-center justify-between mb-3 w-full space-x-2">
          <h3 className="text-sm font-medium">Acciones Rápidas</h3>
        </span>
        <div className="flex flex-col space-y-4">
          <QuickActionButton
            label="Ingresos"
            bgColor="bg-[#f87171]"
            icon={<TrendingUp color="white" />}
            onClick={() => console.log('Ingresos')}
          />
          <QuickActionButton
            label="Gastos"
            bgColor="bg-[#34d399]"
            icon={<CreditCard color="white" />}
            onClick={() => console.log('Gastos')}
          />
        </div>
      </article>

      <article className="grid justify-items-stretch col-span-2 lg:col-span-4 lg:row-span-1 xl:col-span-4 xl:row-start-2 xl:row-span-2 bg-white rounded-2xl shadow-md p-6">
        <span className="flex items-center space-x-2">
          <ChartLine color="#9333EA" />
          <h3 className="text-2xl font-semibold">Resumen Financiero</h3>
        </span>
        <p className="text-sm mb-5">
          Visión general de tus finanzas en los últimos 30 días
        </p>

        <ChartContainer config={chartConfig} className="aspect-square max-h-96">
          <LineChart
            accessibilityLayer
            data={groupedByMonth}
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

      <article className="bg-white p-6 rounded-2xl shadow-md col-span-2 sm:col-span-1 lg:col-span-2 lg:row-span-2 lg:row-start-2 xl:row-start-2">
        <span className="flex items-center space-x-2">
          <CreditCard color="#9333EA" />
          <h3 className="text-2xl font-semibold">Transacciones Recientes</h3>
        </span>
        <p className="text-sm mb-3">Tus últimas 5 transacciones</p>
        {filterActivityData().map((activity) => (
          <RecentTransaction
            key={activity.id}
            title={activity.text}
            date={activity.date}
            type={activity.type}
            amount={activity.amount}
          />
        ))}
      </article>

      <article className="grid justify-items-stretch sm:row-start-5 col-span-2 sm:col-span-1 lg:col-span-2 xl:col-span-3 xl:row-span-2 xl:row-start-4 bg-white rounded-2xl shadow-md p-6">
        <span className="flex items-center space-x-2">
          <ChartPie color="#9333EA" />
          <h3 className="text-2xl font-semibold">Gastos Mensuales</h3>
        </span>
        <p className="text-sm mb-5">Distribución de tus gastos por categoría</p>

        <ChartContainer config={chartConfig} className="aspect-square max-h-96">
          <PieChart accessibilityLayer>
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={groupedByCategory}
              dataKey="gasto"
              nameKey="category"
              innerRadius={85}
              strokeWidth={5}
              paddingAngle={3}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-semibold"
                        >
                          {convertValue(
                            groupedByCategory.reduce(
                              (acc, { gasto }) => acc + gasto,
                              0
                            )
                          )}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Gastos
                        </tspan>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </article>
      <div className="xl:col-span-3 xl:row-span-2 xl:col-start-4 xl:row-start-4">
        9
      </div>
      <div className="xl:col-span-6 xl:row-start-6">10</div>
    </main>
  )
}

export default DashboardPage
