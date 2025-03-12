import { createContext, useContext, useEffect, useMemo, useState } from 'react'

interface User {
  nombre?: string
  id_usuario?: string
  email?: string
}

interface AuthContextProps {
  isAuthenticated: boolean
  loading: boolean
  login: (user: User) => void
  logout: () => void
  user: User
}

const API_URL_CHECK_SESSION = `${import.meta.env.VITE_API_URL}/auth/check-session`
const API_URL_LOGOUT = `${import.meta.env.VITE_API_URL}/auth/logout`

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
  const [user, setUser] = useState<User>({})

  const checkAuthentication = async () => {
    try {
      if (window.location.pathname !== '/login') {
        const response = await fetch(API_URL_CHECK_SESSION, {
          method: 'GET',
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.publicUser)
          setIsAuthenticated(true)
        }
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.log(error)
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
    setUser(user)
  }

  const logout = async () => {
    setIsAuthenticated(false)
    setUser({})
    await fetch(API_URL_LOGOUT, {
      method: 'post',
      credentials: 'include'
    })
      .then(() => {
        console.log('Logged out')
      })
      .catch((error) => {
        console.log(error)
      })
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
