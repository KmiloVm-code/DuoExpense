import { Button, Input } from '@nextui-org/react'
import EmailComponent from '../components/EmailComponent'
import PasswordComponent from '../components/PasswordComponent'
import { loginService, registerService } from '../services/auth'
import { User } from '../types/User'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

function RegisterPage () {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault()
    const name = e.currentTarget.userName.value
    const email = e.currentTarget.email.value
    const password = e.currentTarget.password.value
    const confirmPassword = e.currentTarget.confirmPassword.value

    if (password !== confirmPassword) {
      setLoading(false)
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      const user: User = {
        name,
        email,
        password
      }
      await registerService(user)
      const userLogged = await loginService(email, password)
      setLoading(false)
      if (userLogged.publicUser) {
        login(userLogged.publicUser)
        navigate('/')
      }
    } catch {
      console.error('Failed to register')
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <section className="w-full max-w-sm p-5 space-y-5">
        <h1 className="text-2xl font-semibold text-center">Crear cuenta</h1>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
          <Input variant='underlined' label="Nombre" name='userName' isRequired />
          <EmailComponent />
          <PasswordComponent />

          <Input type='password' name='confirmPassword' variant='underlined' label="confirmar contraseña" isRequired isInvalid={!!error} errorMessage={error} />
          <Button type="submit" color='secondary' fullWidth className='mt-5' isLoading={loading} isDisabled={loading}>Registrarse</Button>
          <div className="text-center text-sm">
            <p>Ya tienes cuenta? <a href="/login" className="text-purple-500">Iniciar sesión</a></p>
          </div>
        </form>

      </section>
    </main>
  )
}

export default RegisterPage
