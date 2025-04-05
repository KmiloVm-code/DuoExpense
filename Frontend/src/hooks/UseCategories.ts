import { useState, useEffect, useCallback } from 'react'
import {
  getCategoriesService,
  createCategoryService
} from '../services/category'
import { Category } from '../types/Category'

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<unknown | null>(null)

  const getCategories = useCallback(async () => {
    try {
      const categorias = await getCategoriesService()
      setCategories(categorias)
    } catch (error) {
      setError(error)
    }
  }, [])

  const createCategory = useCallback(async (category: Category) => {
    try {
      const newCategory = await createCategoryService(category)
      setCategories((prev) => [...prev, newCategory])
    } catch (error) {
      setError(error)
    }
  }, [])

  useEffect(() => {
    getCategories()
  }, [getCategories])

  return {
    categories,
    createCategory,
    error
  }
}
