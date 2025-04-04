import z from 'zod'

export const creditCardSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1).max(50),
  bank: z.string().min(1).max(50),
  creditLimit: z.number().min(0),
  expirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/)
})

export function validateCreditCard(object) {
  return creditCardSchema.safeParse(object)
}

export function validatePartialCreditCard(object) {
  return creditCardSchema.partial().safeParse(object)
}
