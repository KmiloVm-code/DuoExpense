import { Input } from '@heroui/input'
import { useState, useEffect } from 'react'

function PasswordComponent() {
  const [password, setPassword] = useState<string>('')
  const validatePassword = (password: string) => password.length >= 8
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    if (password === '') return
    setError(!validatePassword(password))
  }, [password])

  return (
    <Input
      isRequired
      value={password}
      onValueChange={setPassword}
      type="password"
      label="Contraseña"
      variant="underlined"
      name="password"
      isInvalid={error}
      errorMessage="La contraseña debe tener al menos 8 caracteres"
    />
  )
}

export default PasswordComponent
