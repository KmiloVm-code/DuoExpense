import { Input } from '@heroui/input'
import { useState, useEffect } from 'react'

function EmailComponent() {
  const [email, setEmail] = useState<string>('')
  const [isInvalid, setIsInvalid] = useState<boolean>(false)

  const validateEmail = (email: string) =>
    email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)

  useEffect(() => {
    if (email === '') return
    setIsInvalid(!validateEmail(email))
  }, [email])

  return (
    <Input
      value={email}
      isRequired
      label="Correo electrónico"
      type="email"
      variant="underlined"
      isInvalid={isInvalid}
      errorMessage="Correo electrónico inválido"
      onValueChange={setEmail}
      isClearable
      onClear={() => setEmail('')}
      name="email"
    />
  )
}

export default EmailComponent
