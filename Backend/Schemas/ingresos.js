import z from 'zod'

const ingresoSchema = z.object({
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
  })
})

export function validateIngreso (object) {
  return ingresoSchema.safeParse(object)
}

export function validatepartialIngreso (object) {
  return ingresoSchema.partial().safeParse(object)
}
