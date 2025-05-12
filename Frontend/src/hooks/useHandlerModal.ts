import { useState } from 'react'
import { Transaction } from '../types/Transaction'
import { useTransaction } from './useTransaction'

export function useHandlerModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Transaction | null>(null)
  const { createTransaction, updateTransaction, deleteTransaction } =
    useTransaction()

  const handleOpen = (item?: Transaction) => {
    if (item) {
      setEditingItem(item)
    } else {
      setEditingItem(null)
    }
    setIsOpen(true)
  }

  const handleClose = () => {
    setEditingItem(null)
    setIsOpen(false)
  }

  const handleEdit = (item: Transaction) => {
    setEditingItem(item)
    setIsOpen(true)
  }

  function handleDelete(transaction: Transaction) {
    deleteTransaction(transaction.transactionId?.toString() || '')
  }

  const handleSubmit = (data: Transaction) => {
    if (editingItem?.transactionId) {
      updateTransaction({
        ...data,
        transactionId: editingItem.transactionId
      })
    } else {
      createTransaction(data)
    }
    handleClose()
  }

  return {
    isOpen,
    editingItem,
    handleOpen,
    handleClose,
    handleEdit,
    handleDelete,
    handleSubmit,
    isEditing: !!editingItem
  }
}
