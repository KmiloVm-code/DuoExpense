import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { User } from '../types/User'
import { logoutService, checkAuthService } from '../services/auth'

interface AuthContextProps {
  isAuthenticated: boolean
  loading: boolean
  login: (user: User) => void
  logout: () => void
  user: User
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    password: ''
  })

  const checkAuthentication = async () => {
    setLoading(true)
    try {
      const response = await checkAuthService()
      if (response) {
        setIsAuthenticated(true)
        setUser(response)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Error checking authentication', error)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuthentication()
  }, [])

  const login = (user: User) => {
    setIsAuthenticated(true)
    console.log('Login2', user)
    setUser(user)
  }

  const logout = async () => {
    setLoading(true)
    try {
      const response = await logoutService()
      if (response) {
        setIsAuthenticated(false)
        setUser({
          name: '',
          email: '',
          password: ''
        })
      }
    } catch (error) {
      console.error('Error logging out', error)
    } finally {
      setLoading(false)
    }
  }

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      loading,
      user
    }),
    [isAuthenticated, loading, user]
  )

  if (loading) {
    return null
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
