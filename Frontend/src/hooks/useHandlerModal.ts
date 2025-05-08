import { useState } from 'react'

export function useHandlerModal<T>() {
  const [isOpen, setIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<T | null>(null)

  const handleOpen = (item?: T) => {
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

  const handleEdit = (item: T) => {
    setEditingItem(item)
    setIsOpen(true)
  }

  return {
    isOpen,
    editingItem,
    handleOpen,
    handleClose,
    handleEdit,
    isEditing: !!editingItem
  }
}
