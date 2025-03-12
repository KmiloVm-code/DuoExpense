import z from 'zod'

const userSchema = z.object({
  name: z.string({
    invalid_type_error: 'Name must be a string',
    required_error: 'Name is required'
  }),
  email: z.string().email({
    invalid_type_error: 'Email must be a string',
    required_error: 'Email is required',
    message: 'Invalid email format'
  }),
  password: z.string().min(6, {
    invalid_type_error: 'Password must be a string',
    required_error: 'Password is required',
    message: 'Password must have at least 6 characters'
  })
})

export function validateUser(object) {
  return userSchema.safeParse(object)
}

export function validatepartialUser(object) {
  return userSchema.partial().safeParse(object)
}
