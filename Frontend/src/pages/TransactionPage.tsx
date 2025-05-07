import { useDataTable } from '../hooks/useDataTable'

import { Transaction } from '../types/Transaction'
import { convertValue } from '../utils/formatters'
import { CreditCard } from 'lucide-react'
import { useDataContext } from '../contexts/DataContext'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '../components/TableComponent'
import ModalFormComponent from '../components/ModalFormComponent'
import { Input } from '../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../components/ui/dialog'
import { Label } from '../components/ui/label'
import { Checkbox } from '../components/ui/checkbox'

import { useState, useEffect } from 'react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../components/ui/form'

import { useCategories } from '../hooks/UseCategories'
import { usePayments } from '../hooks/usePayments'

const transactionSchema = z
  .object({
    type: z.string().min(1),
    description: z.string().min(1),
    amount: z.coerce.number().min(0),
    paymentMethodId: z.number().min(1),
    paymentMethod: z.string().min(1),
    categoryId: z.number().min(1),
    transactionDate: z.string().min(1),
    recurring: z.boolean().default(false),
    months: z.number().min(0).nullable(),
    cardId: z.number().min(1).nullable(),
    installments: z.number().min(1).optional().nullable()
  })
  .refine(
    (data) => {
      if (data.recurring) {
        return !!data.months
      }
      return true
    },
    {
      path: ['months'],
      message: 'El número de repeticiones es requerido'
    }
  )
  .refine(
    (data) => {
      if (data.paymentMethod === 'Crédito') {
        return !!data.cardId
      }
      return true
    },
    {
      path: ['cardId'],
      message: 'La franquicia es requerida'
    }
  )
  .refine(
    (data) => {
      if (data.paymentMethod === 'Crédito') {
        return !!data.installments
      }
      return true
    },
    {
      path: ['installments'],
      message: 'El número de cuotas es requerido'
    }
  )

type TransactionFormData = z.infer<typeof transactionSchema>

const CardBrands = [
  {
    cardId: 1,
    name: 'Visa',
    bank: 'Bancolombia'
  },
  {
    cardId: 2,
    name: 'MasterCard',
    bank: 'Bancolombia'
  },
  {
    cardId: 3,
    name: 'Amex',
    bank: 'Bancolombia'
  },
  {
    cardId: 4,
    name: 'Otro',
    bank: 'Bancolombia'
  }
]

const TransactionPage = () => {
  const { pickerValue } = useDataContext()
  const {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction
  } = useDataTable(`startDate=${pickerValue.start}&endDate=${pickerValue.end}`)
  const { categories } = useCategories()
  const { paymentMethods } = usePayments()

  const [open, setOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)

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
            }`}
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

  const defaultValues: Partial<TransactionFormData> = {
    type: 'expense',
    description: '',
    amount: 0,
    categoryId: 1,
    transactionDate: new Date().toISOString().split('T')[0],
    cardId: null,
    months: null,
    installments: null,
    paymentMethodId: 1,
    paymentMethod: 'Efectivo',
    recurring: false
  }
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues,
    mode: 'onChange'
  })

  const paymentMethod = form.watch('paymentMethod')
  const recurring = form.watch('recurring')

  useEffect(() => {
    if (paymentMethod !== 'Crédito') {
      form.setValue('cardId', null)
      form.setValue('installments', null)
    }
    if (!recurring) {
      form.setValue('months', null)
    }
  }, [paymentMethod, form, recurring])

  function onSubmit(data: TransactionFormData) {
    const transaction: Transaction = {
      ...data
    }

    if (editingTransaction?.transactionId) {
      transaction.transactionId = editingTransaction.transactionId
      updateTransaction(transaction)
    } else {
      createTransaction(transaction)
    }

    setOpen(false)
    setEditingTransaction(null)
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    form.reset(transaction)
    setOpen(true)
  }

  function handleDelete(transaction: Transaction) {
    deleteTransaction(transaction.transactionId?.toString() || '')
  }

  const handleClose = () => {
    setEditingTransaction(null)
    setOpen(false)
  }

  function handleAddTransaction() {
    setOpen(true)
    form.reset(defaultValues)
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) {
            setEditingTransaction(null)
            form.reset(defaultValues)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTransaction
                ? 'Editar transacción'
                : 'Añadir nueva transacción'}
            </DialogTitle>
            <DialogDescription>
              {editingTransaction
                ? 'Modifica los detalles de la transacción. Haz clic en guardar cuando hayas terminado.'
                : 'Completa los detalles de la transacción. Haz clic en guardar cuando hayas terminado.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4"
            >
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de transacción</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value?.toString()}
                        onValueChange={(value) =>
                          field.onChange(
                            value as 'expense' | 'income' | 'savings'
                          )
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="expense">Gasto</SelectItem>
                          <SelectItem value="income">Ingreso</SelectItem>
                          <SelectItem value="savings">Ahorro</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Ejemplo: Compra de supermercado"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ejemplo: 50000"
                        className="w-full"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value =
                            e.target.value === '' ? 0 : Number(e.target.value)
                          field.onChange(value)
                        }}
                        onBlur={(e) => {
                          const value =
                            e.target.value === '' ? 0 : Number(e.target.value)
                          field.onChange(value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethodId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de pago</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value?.toString()}
                        onValueChange={(value: string) => {
                          const method = paymentMethods.find(
                            (m) => m.paymentMethodId.toString() === value
                          )
                          field.onChange(parseInt(value))
                          if (method) {
                            form.setValue('paymentMethod', method.name)
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un método" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem
                              key={method.paymentMethodId}
                              value={method.paymentMethodId.toString()}
                            >
                              {method.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {paymentMethod === 'Crédito' && (
                <>
                  <FormField
                    control={form.control}
                    name="cardId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Franquicia de la tarjeta</FormLabel>
                        <FormControl>
                          <Select
                            defaultValue={field.value?.toString()}
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecciona una franquicia" />
                            </SelectTrigger>
                            <SelectContent>
                              {CardBrands.map((card) => (
                                <SelectItem
                                  key={card.cardId}
                                  value={card.cardId.toString()}
                                >
                                  <span className="flex flex-col items-start">
                                    <span className="font-semibold">
                                      {card.name}
                                    </span>
                                    <small className="ml-2 text-xs text-gray-500">
                                      {card.bank}
                                    </small>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="installments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de cuotas</FormLabel>
                        <FormControl>
                          <Select
                            defaultValue={field.value?.toString()}
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecciona cuotas" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 3, 6, 9, 12, 18, 24].map((numCuotas) => (
                                <SelectItem
                                  key={numCuotas}
                                  value={numCuotas.toString()}
                                  onClick={() => field.onChange(numCuotas)}
                                >
                                  {numCuotas}
                                  {numCuotas === 1 ? ' cuota' : ' cuotas'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value?.toString()}
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.categoryId}
                              value={category.categoryId?.toString() ?? '1'}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transactionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de la transacción</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Ejemplo: 2023-10-01"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="flex flex-col space-y-1 leading-none">
                      <FormLabel>Transacción recurrente</FormLabel>
                      <FormDescription>
                        Si la transacción es recurrente, se repetirá cada mes.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {recurring && (
                <FormField
                  control={form.control}
                  name="months"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de repeticiones</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ejemplo: 5"
                          className="w-full"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const value =
                              e.target.value === ''
                                ? null
                                : parseInt(e.target.value)
                            field.onChange(value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>
          <DialogFooter className="flex justify-end space-x-2">
            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
              className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700"
            >
              Save
            </button>
            <button
              type="reset"
              className="px-4 py-2 text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300"
              onClick={handleClose}
            >
              Cancel
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            onClick={handleAddTransaction}
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
