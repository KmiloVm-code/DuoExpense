import { Input } from '@nextui-org/input'

function PasswordComponent ({ password, setPassword }: { password: string, setPassword: (password: string) => void }) {
  return (
    <Input
        isRequired
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        label="Password"
        placeholder="Enter your password"
        variant="bordered"
        className="max-w-xs"
      />
  )
}

export default PasswordComponent
