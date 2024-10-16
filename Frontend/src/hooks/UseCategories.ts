import { useState, useEffect, useCallback } from 'react'

export const useCategories = () => {
  const [categories, setCategories] = useState([{ id: 0, nombre: '' }])
  const [error, setError] = useState<unknown | null>(null)

  const getCategories = useCallback(async () => {
    try {
      const categorias = [
        { id: 1, nombre: 'Alimentacion' },
        { id: 2, nombre: 'Electronicos' },
        { id: 3, nombre: 'Salud y Belleza' }
      ]
      setCategories(categorias)
    } catch (error) {
      setError(error)
    }
  }, [])

  useEffect(() => {
    getCategories()
  }, [getCategories])

  return {
    categories,
    error
  }
}
