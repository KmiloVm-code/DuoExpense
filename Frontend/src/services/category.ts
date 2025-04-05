import { Category } from '../types/Category'

const API_URL = `${import.meta.env.VITE_API_URL}/categories`
const options: RequestInit = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include' as RequestCredentials
}

export const getCategoriesService = async ({
  filters
}: { filters?: string } = {}): Promise<Category[]> => {
  try {
    const res = await fetch(`${API_URL}?${filters}`, options)
    if (!res.ok) throw new Error('Error al obtener las categorías')

    const data = await res.json()
    return data
  } catch {
    throw new Error('Error al obtener las categorías')
  }
}

export const createCategoryService = async (
  category: Category
): Promise<Category> => {
  try {
    const res = await fetch(API_URL, {
      ...options,
      method: 'POST',
      body: JSON.stringify(category)
    })

    if (!res.ok) throw new Error('Error al crear la categoría')

    return res.json()
  } catch {
    throw new Error('Error al crear la categoría')
  }
}

export const updateCategoryService = async (
  category: Category
): Promise<Category> => {
  try {
    const res = await fetch(`${API_URL}/${category.categoryId}`, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(category)
    })

    if (!res.ok) throw new Error('Error al actualizar la categoría')

    return res.json()
  } catch {
    throw new Error('Error al actualizar la categoría')
  }
}

export const deleteCategoryService = async (categoryId: number) => {
  try {
    const res = await fetch(`${API_URL}/${categoryId}`, {
      ...options,
      method: 'DELETE'
    })

    if (!res.ok) throw new Error('Error al eliminar la categoría')
  } catch {
    throw new Error('Error al eliminar la categoría')
  }
}
