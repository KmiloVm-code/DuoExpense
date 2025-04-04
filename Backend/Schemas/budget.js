import z from 'zod'

export const budgetSchema = z.object({
  userId: z.string().uuid(),
  categoryId: z.number().int(),
  amount: z.number().positive(),
  period: z.enum(['weekly', 'bi-weekly', 'monthly', 'quarterly', 'annually']),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) // YYYY-MM-DD format
})

export function validateBudget(object) {
  return budgetSchema.safeParse(object)
}

export function validatePartialBudget(object) {
  return budgetSchema.partial().safeParse(object)
}
