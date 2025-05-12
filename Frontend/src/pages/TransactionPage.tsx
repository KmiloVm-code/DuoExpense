import { useDataTable } from '../hooks/useDataTable'
import { Transaction } from '../types/Transaction'
import { convertValue } from '../utils/formatters'
import { CreditCard } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '../components/TableComponent'
import ModalTransactionComponent from '../components/ModalTransactionComponent'
import { useHandlerModal } from '../hooks/useHandlerModal'

const TransactionPage = () => {
  const { transactions, loading, error } = useDataTable()

  const {
    isOpen,
    editingItem: editingTransaction,
    handleOpen,
    handleClose,
    handleEdit,
    handleDelete,
    handleSubmit,
    isEditing
  } = useHandlerModal()

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
        const type = row.original.type
        return (
          <span
            className={`${
              type === 'income'
                ? 'text-green-500 font-semibold'
                : type === 'savings'
                  ? 'text-purple-600 font-semibold'
                  : 'text-red-500 font-semibold'
            }`}
          >
            {type === 'expense' ? '-' : '+'}
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
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const transaction = row.original
        return (
          <span className="flex items-center justify-end gap-2 m-0">
            <button
              type="button"
              onClick={() => handleEdit(transaction)}
              className="text-blue-500 hover:text-blue-700 bg-blue-100 px-2 py-1 rounded-md"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => handleDelete(transaction)}
              className="text-red-500 hover:text-red-700 bg-red-100 px-2 py-1 rounded-md"
            >
              Eliminar
            </button>
          </span>
        )
      }
    }
  ]

  return (
    <>
      <ModalTransactionComponent
        open={isOpen}
        onClose={handleClose}
        transaction={editingTransaction}
        isEditing={isEditing}
        onSubmit={handleSubmit}
      />

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
          <button
            onClick={() => handleOpen()}
            className="w-full sm:w-auto px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700"
          >
            <span className="flex items-center space-x-2">
              <CreditCard color="#fff" />
              <span className="text-sm font-semibold">Agregar Transacción</span>
            </span>
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
    </>
  )
}

export default TransactionPage
