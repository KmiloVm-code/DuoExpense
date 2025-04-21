import { useDataTable } from '../hooks/useDataTable'

import { Transaction } from '../types/Transaction'
import { convertValue } from '../utils/formatters'
import { CreditCard } from 'lucide-react'
import { useDataContext } from '../contexts/DataContext'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '../components/TableComponent'

const TransactionPage = () => {
  const { pickerValue } = useDataContext()
  const { transactions, loading, error } = useDataTable(
    `startDate=${pickerValue.start}&endDate=${pickerValue.end}`
  )

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'transactionDate',
      header: 'Date',
      cell: ({ row }) => {
        return (
          <span className="text-slate-700">
            {new Date(row.getValue('transactionDate')).toLocaleDateString(
              'es-ES',
              {
                year: 'numeric',
                month: 'short',
                day: '2-digit'
              }
            )}
          </span>
        )
      }
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        return (
          <span className="text-slate-700">{row.getValue('description')}</span>
        )
      }
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        return (
          <span
            className={
              'px-3 py-1 rounded-full text-sm bg-purple-100 text-gray-700'
            }
          >
            {row.getValue('category')}
          </span>
        )
      }
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        const isIncome = row.original.type === 'income'
        return (
          <span
            className={`${
              isIncome
                ? 'text-green-500 font-semibold'
                : 'text-red-500 font-semibold'
            } border-b-1 border-b-purple-100`}
          >
            {isIncome ? '+' : '-'}
            {convertValue(row.getValue('amount'))}
          </span>
        )
      }
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
      cell: ({ row }) => {
        const paymentMethod = row.getValue('paymentMethod') as string
        const colors: Record<string, string> = {
          Efectivo: 'bg-green-100 text-green-700',
          Credito: 'bg-blue-100 text-blue-700',
          Debito: 'bg-yellow-100 text-yellow-700',
          Otro: 'bg-gray-100 text-gray-700'
        }
        const colorClass = colors[paymentMethod] || 'bg-gray-100 text-gray-700'
        return (
          <span className={`px-3 py-1 rounded-full text-sm ${colorClass}`}>
            {paymentMethod}
          </span>
        )
      }
    },
    {
      header: 'Actions',
      cell: () => {
        return (
          <span className="flex items-center justify-center space-x-4">
            <button className="text-blue-500 hover:text-blue-700">Edit</button>
            <button className="text-red-500 hover:text-red-700">Delete</button>
          </span>
        )
      }
    }
  ]

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-2xl shadow-md">
      <span className="flex items-center space-x-2">
        <CreditCard color="#9333EA" />
        <h3 className="text-2xl font-semibold">Todas las Transacciones</h3>
      </span>
      <p className="text-sm mb-3">Historial completo de tus transacciones</p>
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 space-y-4 sm:space-y-0">
        <span className="flex items-center w-full sm:w-auto space-x-2">
          <input
            type="text"
            id="filters"
            className="w-full sm:w-auto border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Buscar Transacciones..."
          />
        </span>
        <button className="w-full sm:w-auto px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700">
          Agregar Transaction
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {!loading && !error && <div className="overflow-x-auto"></div>}
      {!loading && !error && transactions.length > 0 && (
        <DataTable columns={columns} data={transactions} />
      )}
      {!loading && !error && transactions.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No hay transacciones disponibles</p>
        </div>
      )}
    </div>
  )
}

export default TransactionPage
