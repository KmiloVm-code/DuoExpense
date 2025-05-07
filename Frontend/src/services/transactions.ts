import { Transaction, SummaryTransaction } from '../types/Transaction'

const API_URL = `${import.meta.env.VITE_API_URL}/financial-transactions`
const options: RequestInit = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include' as RequestCredentials
}

interface ApiTransaction {
  transaction_id: number
  user_id: string
  category_id: number
  payment_method_id: number
  card_id: number
  type: 'income' | 'expense' | 'savings'
  amount: number
  description: string
  transaction_date: string
  recurring_transaction_id?: number
  recurring?: boolean
  months?: number
  category?: string
  paymentmethod?: string
}

function mapApiTransaction(apiTransaction: ApiTransaction): Transaction {
  return {
    transactionId: apiTransaction.transaction_id,
    userId: apiTransaction.user_id,
    categoryId: apiTransaction.category_id,
    paymentMethodId: apiTransaction.payment_method_id,
    paymentMethod: apiTransaction.paymentmethod || 'Efectivo',
    cardId: apiTransaction.card_id || null,
    type: apiTransaction.type,
    amount: apiTransaction.amount,
    description: apiTransaction.description,
    transactionDate: new Date(apiTransaction.transaction_date)
      .toISOString()
      .split('T')[0],
    recurringTransactionId: apiTransaction.recurring_transaction_id,
    recurring: apiTransaction.recurring || false,
    months: apiTransaction.months || null,
    category: apiTransaction.category,
    installments: null
  }
}

export const getTransactionsService = async (
  {
    filters
  }: {
    filters?: string
  } = {},
  userId: string
): Promise<Transaction[]> => {
  try {
    const res = await fetch(`${API_URL}/${userId}?${filters}`, options)
    if (!res.ok) return []
    const data = await res.json()
    const transactions: Transaction[] = data.map(
      (transaction: ApiTransaction) => mapApiTransaction(transaction)
    )
    return transactions
  } catch {
    throw new Error('Error al obtener las transacciones')
  }
}

export const getLastTransactionsService = async (
  {
    filters
  }: {
    filters?: string
  } = {},
  userId: string
): Promise<Transaction[]> => {
  try {
    const res = await fetch(`${API_URL}/last/${userId}?${filters}`, options)
    if (!res.ok) return []
    const data = await res.json()
    const transactions: Transaction[] = data.map(
      (transaction: ApiTransaction) => mapApiTransaction(transaction)
    )
    return transactions
  } catch {
    throw new Error('Error al obtener las transacciones')
  }
}

export const getTransactionsSummaryService = async (
  {
    filters
  }: {
    filters?: string
  } = {},
  userId: string
): Promise<SummaryTransaction[]> => {
  try {
    const res = await fetch(`${API_URL}/summary/${userId}?${filters}`, options)
    if (!res.ok) return []
    return await res.json()
  } catch {
    throw new Error('Error al obtener el resumen de transacciones')
  }
}

export const getExpensesByCategoryService = async (
  {
    filters
  }: {
    filters?: string
  } = {},
  userId: string
): Promise<SummaryTransaction[]> => {
  try {
    const res = await fetch(`${API_URL}/expenses/${userId}?${filters}`, options)
    if (!res.ok) return []
    const data = await res.json()
    const transactions: SummaryTransaction[] = data.map(
      (transaction: SummaryTransaction) => ({
        ...transaction,
        total_expense:
          parseInt(transaction.total_expense?.toString() || '0') || 0,
        fill: `var(--color-${transaction.category?.toLowerCase()})`
      })
    )
    console.log('transactions: ', transactions)
    return transactions
  } catch {
    throw new Error('Error al obtener el resumen de transacciones')
  }
}

export const createTransactionService = async (
  transaction: Transaction,
  userId: string
): Promise<Transaction> => {
  try {
    const res = await fetch(`${API_URL}/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction),
      credentials: 'include' as RequestCredentials
    })
    if (!res.ok) throw new Error('Error al crear la transacción')
    const data = await res.json()
    return mapApiTransaction(data)
  } catch (error) {
    console.error('Error creating transaction:', error)
    throw new Error('Error al crear la transacción')
  }
}

export const updateTransactionService = async (
  transaction: Transaction,
  transactionId: string
): Promise<Transaction> => {
  try {
    const res = await fetch(`${API_URL}/${transactionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction),
      credentials: 'include' as RequestCredentials
    })
    if (!res.ok) throw new Error('Error al actualizar la transacción')
    const data = await res.json()
    return mapApiTransaction(data)
  } catch (error) {
    console.error('Error updating transaction:', error)
    throw new Error('Error al actualizar la transacción')
  }
}

export const deleteTransactionService = async (
  transactionId: string
): Promise<void> => {
  try {
    const res = await fetch(`${API_URL}/${transactionId}`, {
      method: 'DELETE',
      credentials: 'include' as RequestCredentials
    })
    if (!res.ok) throw new Error('Error al eliminar la transacción')
  } catch (error) {
    console.error('Error deleting transaction:', error)
    throw new Error('Error al eliminar la transacción')
  }
}
