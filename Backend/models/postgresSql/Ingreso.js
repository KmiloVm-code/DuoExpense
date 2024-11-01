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
    const { idUsuario, concepto, valor, fecha, cuotas, descripcion, ingresoFijo, idCategoria, idTarjeta, idMetodoPago, empresa } = input
    try {
      const result = await client.query('INSERT INTO ingreso (id_usuario, concepto, valor, fecha, cuotas, descripcion, ingreso_fijo, id_categoria, id_tarjeta, id_metodo_pago, empresa) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *', [idUsuario, concepto, valor, fecha, cuotas, descripcion, ingresoFijo, idCategoria, idTarjeta, idMetodoPago, empresa])
      return result.rows[0]
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }

  static async update ({ id, input }) {
    const { concepto, valor, fecha, cuotas, descripcion, ingresoFijo, idCategoria, idTarjeta, idMetodoPago, empresa } = input
    const result = await client.query('UPDATE ingreso SET concepto = COALESCE($1, concepto), valor = COALESCE($2, valor), fecha = COALESCE($3, fecha), cuotas = COALESCE($4, cuotas), descripcion = COALESCE($5, descripcion), ingreso_fijo = COALESCE($6, ingreso_fijo), id_categoria = COALESCE($7, id_categoria), id_tarjeta = COALESCE($8, id_tarjeta), id_metodo_pago = COALESCE($9, id_metodo_pago), empresa = COALESCE($10, empresa) WHERE id_ingreso = $11 RETURNING *', [concepto, valor, fecha, cuotas, descripcion, ingresoFijo, idCategoria, idTarjeta, idMetodoPago, empresa, id])
    return result.rows[0]
  }

  static async delete ({ id }) {
    await client.query('DELETE FROM ingreso WHERE id_ingreso = $1', [id])
    return 'ingreso deleted'
  }
}
