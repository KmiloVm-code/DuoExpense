import { User } from '../types/User'
const API_URL = `${import.meta.env.VITE_API_URL}/auth`

interface ApiUser {
  user_id: string
  name: string
  email: string
}

function mapApiUser(apiUser: ApiUser): User {
  return {
    userId: apiUser.user_id,
    name: apiUser.name,
    email: apiUser.email
  }
}

export const loginService = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    })

    if (response.ok) {
      const data = await response.json()
      const user = mapApiUser(data.publicUser)
      return user
    } else {
      console.error('Failed to login')
      return null
    }
  } catch (e) {
    console.error('Failed to login', e)
    return null
  }
}

export const registerService = async (data: User) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
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

export const logoutService = async () => {
  try {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    })

    if (response.ok) {
      return true
    } else {
      console.error('Failed to logout')
      return false
    }
  } catch (e) {
    console.error('Failed to logout', e)
    return false
  }
}

export const checkAuthService = async () => {
  try {
    const response = await fetch(`${API_URL}/check-session`, {
      method: 'GET',
      credentials: 'include'
    })

    if (response.ok) {
      const data = await response.json()
      const user = mapApiUser(data.publicUser)
      return user
    } else {
      console.error('Failed to check authentication')
      return null
    }
  } catch (e) {
    console.error('Failed to check authentication', e)
    return null
  }
}
