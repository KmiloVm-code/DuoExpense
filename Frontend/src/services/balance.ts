import { Balance } from '../types/Balance'

const API_URL = `${import.meta.env.VITE_API_URL}/balance`
const options: RequestInit = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include' as RequestCredentials
}

export const getCurrentBalance = async (
  {
    filters
  }: {
    filters?: string
  } = {},
  userId: string
): Promise<Balance> => {
  try {
    const res = await fetch(`${API_URL}/current/${userId}?${filters}`, options)
    if (!res.ok) throw new Error('Error al obtener el balance')

    const data = await res.json()
    return data
  } catch {
    throw new Error('Error al obtener el balance')
  }
}
