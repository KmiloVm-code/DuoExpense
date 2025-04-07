import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import EmailComponent from '../components/EmailComponent'
import PasswordComponent from '../components/PasswordComponent'
import { useAuth } from '../contexts/AuthContext'
import { loginService } from '../services/auth'
import { Button } from '@heroui/react'

function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault()
    const email = e.currentTarget.email.value
    const password = e.currentTarget.password.value

    try {
      const user = await loginService(email, password)
      setLoading(false)
      if (user) {
        login(user)
        navigate('/')
      }
    } catch {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <section className="w-full max-w-sm p-5 space-y-5">
        <h1 className="text-2xl font-semibold text-center">Iniciar sesión</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-5"
        >
          <EmailComponent />
          <PasswordComponent />
          {error && <div className="text-red-500">{error}</div>}
          <div className="w-full text-right text-sm text-purple-500">
            <Link to="/forgot-password">Olvidaste tu contraseña?</Link>
          </div>
          <Button
            type="submit"
            color="secondary"
            fullWidth
            className="mt-5"
            isLoading={loading}
            isDisabled={loading}
          >
            Ingresar
          </Button>
        </form>

        <div className="text-center text-sm">
          <p>
            Usuario nuevo?{' '}
            <Link to="/register" className="text-purple-500">
              Crear cuenta
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
