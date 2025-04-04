import z from 'zod'

const PaymentMethodSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Name must be a string',
      required_error: 'Name is required'
    })
    .min(1, { message: 'Name must be at least 1 character long' })
    .max(50, { message: 'Name must be at most 50 characters long' })
})

export function validatePaymentMethod(object) {
  return PaymentMethodSchema.safeParse(object)
}

export function validatePartialPaymentMethod(object) {
  return PaymentMethodSchema.partial().safeParse(object)
}
