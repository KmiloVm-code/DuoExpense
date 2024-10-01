import client from '../../db/dbClient.js'

export class GastoModel {
  static async getAll ({ filters }) {
    try {
      let query = 'SELECT * FROM gasto WHERE 1=1'
      const values = []

      for (const key in filters) {
        if (key === 'id_usuario') {
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
    const { idUsuario, concepto, valor, fecha, cuotas, descripcion, gastoFijo, idCategoria, idTarjeta, idMetodoPago, empresa } = input
    try {
      const result = await client.query('INSERT INTO gasto (id_usuario, concepto, valor, fecha, cuotas, descripcion, gasto_fijo, id_categoria, id_tarjeta, id_metodo_pago, empresa) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *', [idUsuario, concepto, valor, fecha, cuotas, descripcion, gastoFijo, idCategoria, idTarjeta, idMetodoPago, empresa])
      return result.rows[0]
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }

  static async update ({ id, input }) {
    const { concepto, valor, fecha, cuotas, descripcion, gastoFijo, idCategoria, idTarjeta, idMetodoPago, empresa } = input
    const result = await client.query('UPDATE gasto SET concepto = COALESCE($1, concepto), valor = COALESCE($2, valor), fecha = COALESCE($3, fecha), cuotas = COALESCE($4, cuotas), descripcion = COALESCE($5, descripcion), gasto_fijo = COALESCE($6, gasto_fijo), id_categoria = COALESCE($7, id_categoria), id_tarjeta = COALESCE($8, id_tarjeta), id_metodo_pago = COALESCE($9, id_metodo_pago), empresa = COALESCE($10, empresa) WHERE id_gasto = $11 RETURNING *', [concepto, valor, fecha, cuotas, descripcion, gastoFijo, idCategoria, idTarjeta, idMetodoPago, empresa, id])
    return result.rows[0]
  }

  static async delete ({ id }) {
    await client.query('DELETE FROM gasto WHERE id_gasto = $1', [id])
    return 'gasto deleted'
  }
}
