import { Transaction } from '../types/Transaction'

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
}

function mapApiTransaction(apiTransaction: ApiTransaction): Transaction {
  return {
    transactionId: apiTransaction.transaction_id,
    userId: apiTransaction.user_id,
    categoryId: apiTransaction.category_id,
    paymentMethodId: apiTransaction.payment_method_id,
    cardId: apiTransaction.card_id,
    type: apiTransaction.type,
    amount: apiTransaction.amount,
    description: apiTransaction.description,
    transactionDate: new Date(apiTransaction.transaction_date),
    recurringTransactionId: apiTransaction.recurring_transaction_id,
    recurring: apiTransaction.recurring,
    months: apiTransaction.months
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
    if (!res.ok) throw new Error('Error al obtener las transacciones')
    const data = await res.json()
    const transactions: Transaction[] = data.map(
      (transaction: ApiTransaction) => mapApiTransaction(transaction)
    )
    return transactions
  } catch {
    throw new Error('Error al obtener las transacciones')
  }
}
