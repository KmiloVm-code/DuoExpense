import { convertValue } from '../utils/formatters'

import { ChartLine, Plus, CreditCard, ChartPie } from 'lucide-react'
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
import { useData } from '../hooks/useData'
import { Transaction } from '../types/Transaction'
import { useDateRange } from '../contexts/DateRangeContext'
import { useChartData } from '../hooks/useChartData'
import BudgetComponent from '../components/BudgetComponent'
import { useHandlerModal } from '../hooks/useHandlerModal'
import ModalTransactionComponent from '../components/ModalTransactionComponent'

function DashboardPage() {
  const statsData = useStatsData()
  const { dateRange } = useDateRange()
  const { lastTransaction } = useData()
  const { handleOpen, handleClose, handleSubmit, isOpen } = useHandlerModal()

  const { chartSummary, chartSummaryByCategory } = useChartData(
    dateRange.start?.toString() ?? '',
    dateRange.end?.toString() ?? ''
  )

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

  return (
    <>
      <ModalTransactionComponent
        open={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
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
              label="Nueva Transacción"
              bgColor="bg-primary"
              icon={<Plus color="white" />}
              onClick={() => handleOpen()}
            />
          </div>
        </article>

        <article className="grid justify-items-stretch col-span-2 lg:col-span-4 lg:row-span-1 xl:col-span-4 xl:row-start-2 xl:row-span-2 bg-white rounded-2xl shadow-md p-6">
          <span className="flex items-center space-x-2">
            <ChartLine color="#9333EA" />
            <h3 className="text-2xl font-semibold">Resumen Financiero</h3>
          </span>
          <p className="text-sm mb-5">Visión general de tus finanzas</p>

          <ChartContainer
            config={chartConfig}
            className="aspect-square max-h-96"
          >
            <LineChart
              accessibilityLayer
              data={chartSummary}
              margin={{ top: 30, right: 30, left: 30, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  const options: Intl.DateTimeFormatOptions = {
                    month: 'short',
                    day: '2-digit'
                  }
                  return date.toLocaleDateString('es-ES', options)
                }}
                interval={0}
              />
              <ChartTooltip
                cursor={true}
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  padding: 0,
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}
                labelFormatter={(value) => {
                  const date = new Date(value)
                  const options: Intl.DateTimeFormatOptions = {
                    month: 'long',
                    day: '2-digit'
                  }
                  return date.toLocaleDateString('es-ES', options)
                }}
                formatter={(value, name) => {
                  const formattedValue = convertValue(value as number)
                  const label =
                    name === 'total_income'
                      ? chartConfig.ingresos.label
                      : chartConfig.gastos.label
                  return [
                    <span key={0} className="text-gray-500 font-semibold">
                      {label}
                    </span>,
                    <span key={1} className="text-gray-500 font-semibold">
                      {formattedValue}
                    </span>
                  ]
                }}
                active={true}
                content={<ChartTooltipContent />}
              />
              <ChartLegend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ paddingTop: 0, paddingBottom: 0 }}
                layout="vertical"
                payload={[
                  {
                    dataKey: 'ingresos',
                    color: chartConfig.ingresos.color,
                    value: chartConfig.ingresos.label
                  },
                  {
                    dataKey: 'gastos',
                    color: chartConfig.gastos.color,
                    value: chartConfig.gastos.label
                  }
                ]}
                content={<ChartLegendContent />}
              />
              <Line
                type="monotone"
                dataKey="total_income"
                stroke="#34d399"
                strokeWidth={2}
                dot={true}
              />
              <Line
                type="monotone"
                dataKey="total_expense"
                stroke="#f87171"
                strokeWidth={2}
                dot={true}
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
          {lastTransaction.map((transaction: Transaction) => (
            <RecentTransaction
              key={transaction.transactionId}
              title={transaction.description}
              date={transaction.transactionDate}
              type={transaction.type}
              amount={convertValue(Number(transaction.amount))}
            />
          ))}
        </article>

        <article className="grid justify-items-stretch sm:row-start-5 col-span-2 sm:col-span-1 lg:col-span-2 xl:col-span-3 xl:row-span-2 xl:row-start-4 bg-white rounded-2xl shadow-md p-6">
          <span className="flex items-center space-x-2">
            <ChartPie color="#9333EA" />
            <h3 className="text-2xl font-semibold">Gastos Mensuales</h3>
          </span>
          <p className="text-sm mb-5">
            Distribución de tus gastos por categoría
          </p>

          <ChartContainer
            config={chartConfig}
            className="aspect-square max-h-96"
          >
            <PieChart accessibilityLayer>
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartSummaryByCategory}
                dataKey="total_expense"
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
                              chartSummaryByCategory.reduce(
                                (acc, curr) => acc + (curr.total_expense || 0),
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

        <article className="bg-white p-6 rounded-2xl shadow-md col-span-2 xl:col-span-3 xl:row-span-2 xl:col-start-4 xl:row-start-4">
          <BudgetComponent />
        </article>
        <div className="xl:col-span-6 xl:row-start-6">10</div>
      </main>
    </>
  )
}

export default DashboardPage
