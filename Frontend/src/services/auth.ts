import { User } from '../types/User'
const API_URL_LOGIN = `${import.meta.env.VITE_API_URL}/auth/login`
const API_URL_REGISTER = `${import.meta.env.VITE_API_URL}/auth/register`

export const loginService = async (email: string, password: string) => {
  try {
    const response = await fetch(API_URL_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    })

    if (response.ok) {
      return response.json()
    } else {
      console.error('Failed to login')
    }
  } catch (e) {
    console.error('Failed to login', e)
  }
}

export const registerService = async (data: User) => {
  try {
    const response = await fetch(API_URL_REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'
    })

    if (response.ok) {
      return response.json()
    } else {
      console.error('Failed to register')
    }
  } catch (e) {
    console.error('Failed to register', e)
  }
}
