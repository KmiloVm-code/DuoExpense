import client from '../../db/dbClient.js'

export class IngresoFijoModel {
  static async getAll ({ concepto }) {
    if (concepto) {
      const lowerCaseConcepto = concepto.toLowerCase()
      const result = await client.query('SELECT * FROM ingresofijo WHERE LOWER(concepto) = $1', [lowerCaseConcepto])
      return result.rows
    }

    const result = await client.query('SELECT * FROM ingresofijo')
    return result.rows
  }

  static async getbyIdUser ({ idUsuario }) {
    const result = await client.query('SELECT * FROM ingresofijo WHERE id_usuario = $1', [idUsuario])
    return result.rows
  }

  static async create ({ input }) {
    const { idUsuario, concepto, valor, fecha } = input
    try {
      const result = await client.query('INSERT INTO ingresofijo (id_usuario, concepto, valor, fecha) VALUES ($1, $2, $3, $4) RETURNING *', [idUsuario, concepto, valor, fecha])
      return result.rows[0]
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }

  static async update ({ id, input }) {
    const { concepto, valor, fecha } = input
    const result = await client.query('UPDATE ingresofijo SET concepto = COALESCE($1, concepto), valor = COALESCE($2, valor), fecha = COALESCE($3, fecha) WHERE id_ingreso_fijo = $4 RETURNING *', [concepto, valor, fecha, id])
    return result.rows[0]
  }

  static async delete ({ id }) {
    await client.query('DELETE FROM ingresofijo WHERE id_ingreso_fijo = $1', [id])
    return 'ingreso fijo deleted'
  }
}
