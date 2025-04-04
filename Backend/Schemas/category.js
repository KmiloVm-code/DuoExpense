import z from 'zod'

const categorySchema = z.object({
  name: z.string({
    invalid_type_error: 'Name must be a string',
    required_error: 'Name is required'
  }),
  parentCategoryId: z.number().optional().nullable()
})

export function validateCategory(object) {
  return categorySchema.safeParse(object)
}

export function validatePartialCategory(object) {
  return categorySchema.partial().safeParse(object)
}
