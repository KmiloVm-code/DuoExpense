import { useAuth } from '../contexts/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

interface ProtectedRouteProps {
  redirectTo?: string;
  children?: React.ReactNode;
}

export const ProtectedRoute = ({ children, redirectTo = '/login' }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />
  }

  return children || <Outlet />
}
