import client from '../../db/dbClient.js'

export class IngresoModel {
  static async getAll ({ filters }) {
    try {
      let query = 'SELECT * FROM ingreso WHERE 1=1'
      const values = []

      for (const key in filters) {
        if (key === 'id_usuario' || key === 'id_ingreso') {
          query += ` AND ${key} = $${values.length + 1}`
          values.push(filters[key])
        } else {
          query += ` AND ${key} ILIKE $${values.length + 1}`
          values.push(`%${filters[key]}%`)
        }
      }

      console.log(query, values)

      const result = await client.query(query, values)
      return result.rows
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }

  static async create ({ input }) {
    const { idUsuario, concepto, descripcion, valor, ingresoFijo, fecha } = input
    try {
      const result = await client.query('INSERT INTO ingreso (id_usuario, concepto, descripcion, valor, ingreso_fijo, fecha) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [idUsuario, concepto, descripcion, valor, ingresoFijo, fecha])
      return result.rows[0]
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }

  static async update ({ id, input }) {
    const { concepto, descripcion, valor, ingresoFijo, fecha } = input
    const result = await client.query('UPDATE ingreso SET concepto = $1, descripcion = $2, valor = $3, ingreso_fijo = $4, fecha = $5 WHERE id_ingreso = $6 RETURNING *', [concepto, descripcion, valor, ingresoFijo, fecha, id])
    return result.rows[0]
  }

  static async delete ({ id }) {
    await client.query('DELETE FROM ingreso WHERE id_ingreso = $1', [id])
    return 'ingreso deleted'
  }
}
