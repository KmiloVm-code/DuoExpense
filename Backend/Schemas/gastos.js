import z from 'zod'

const gastoSchema = z.object({
  idUsuario: z.string({
    invalid_type_error: 'Id_usuario must be a string',
    required_error: 'Id_usuario is required'
  }),
  concepto: z.string({
    invalid_type_error: 'Concepto must be a string',
    required_error: 'Concepto is required'
  }),
  valor: z.number({
    invalid_type_error: 'Valor must be a number',
    required_error: 'Valor is required'
  }),
  fecha: z.string({
    invalid_type_error: 'Fecha must be a string',
    required_error: 'Fecha is required'
  }),
  cuotas: z.union([
    z.literal(null),
    z.number().int().positive({ invalid_type_error: 'Cuotas must be a number' })
  ]),
  descripcion: z.string({
    invalid_type_error: 'Descripcion must be a string'
  }),
  gastoFijo: z.boolean({
    invalid_type_error: 'GastoFijo must be a boolean',
    required_error: 'GastoFijo is required'
  }),
  idCategoria: z.number({
    invalid_type_error: 'IdCategoria must be a number',
    required_error: 'IdCategoria is required'
  }),
  idTarjeta: z.union([
    z.literal(null),
    z
      .number()
      .int()
      .positive({ invalid_type_error: 'IdTarjeta must be a number' })
  ]),
  idMetodoPago: z.number({
    invalid_type_error: 'IdMetodoPago must be a number',
    required_error: 'IdMetodoPago is required'
  }),
  empresa: z.string({
    invalid_type_error: 'Empresa must be a string',
    required_error: 'Empresa is required'
  })
})

export function validateGasto(object) {
  return gastoSchema.safeParse(object)
}

export function validatepartialGasto(object) {
  return gastoSchema.partial().safeParse(object)
}
