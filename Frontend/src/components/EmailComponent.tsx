import { Input } from '@nextui-org/input'
import { useMemo, useState, useRef } from 'react'

function EmailComponent ({ email, setEmail }: { email: string, setEmail: (email: string) => void }) {
  const validateEmail = (email: string) => email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)

  const [isInvalid, setIsInvalid] = useState<boolean>(false)

  const isFirstRender = useRef(true)

  useMemo(() => {
    if (isFirstRender.current) {
      isFirstRender.current = email === ''
      return
    }

    setIsInvalid(!validateEmail(email))
  }, [email])

  return (
    <Input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      isRequired
      type="email"
      label="Email"
      variant="bordered"
      placeholder="Enter your email"
      isInvalid={isInvalid}
      color={isInvalid ? 'danger' : undefined}
      errorMessage="Invalid email address"
      onValueChange={setEmail}
      isClearable
      onClear={() => setEmail('')}
      className="max-w-xs"
    />
  )
}

export default EmailComponent
