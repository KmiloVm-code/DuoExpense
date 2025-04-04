import z from 'zod'

export const FinancialTransactionSchema = z.object({
  userId: z.string().uuid(),
  categoryId: z.number().int().nullable(),
  paymentMethodId: z.number().int().nullable(),
  cardId: z.number().int().nullable(),
  type: z.enum(['income', 'expense', 'savings']),
  amount: z.number().positive(),
  description: z.string().optional(),
  transactionDate: z.date().default(new Date()),
  recurring: z.boolean().default(false),
  months: z.number().int().optional(),
  recurringTransactionId: z.number().int().optional()
})

export function validateFinancialTransaction(object) {
  return FinancialTransactionSchema.safeParse(object)
}

export function validatePartialFinancialTransaction(object) {
  return FinancialTransactionSchema.partial().safeParse(object)
}
