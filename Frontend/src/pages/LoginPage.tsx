import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EmailComponent from '../components/EmailComponent'
import PasswordComponent from '../components/PasswordComponent'
import { useAuth } from '../contexts/AuthContext'
import { loginService } from '../services/auth'

function LoginPage () {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const data = await loginService(email, password)
    if (data.publicUser) {
      login(data.publicUser)
      navigate('/')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-1/2 m-auto h-screen gap-5">
      <h1 className="text-4xl font-bold">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <EmailComponent email={email} setEmail={setEmail} />

        <PasswordComponent password={password} setPassword={setPassword} />

        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Login
        </button>
      </form>
    </div>
  )
}

export default LoginPage
