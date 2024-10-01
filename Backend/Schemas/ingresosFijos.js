import z from 'zod'

const ingresoFijoSchema = z.object({
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

export function validateIngresoFijo (object) {
  return ingresoFijoSchema.safeParse(object)
}

export function validatepartialIngresoFijo (object) {
  return ingresoFijoSchema.partial().safeParse(object)
}
