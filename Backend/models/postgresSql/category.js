import client from '../../db/dbClient.js'

export class CategoryModel {
  static async getAll({ filters }) {
    const { categoryId, name } = filters
    let query = 'SELECT * FROM category WHERE 1=1'
    const values = []
    if (categoryId) {
      query += ` AND category_id = $${values.length + 1}`
      values.push(categoryId)
    }
    if (name) {
      query += ` AND name ILIKE '%' || $${values.length + 1} || '%'`
      values.push(name)
    }
    const result = await client.query(query, values)
    if (result.rows.length === 0) {
      return false
    }
    return result.rows
  }

  static async create({ input }) {
    const { name, parentCategoryId } = input
    try {
      const result = await client.query(
        'INSERT INTO category (name, parent_category_id) VALUES ($1, $2) RETURNING *',
        [name, parentCategoryId || null]
      )
      return result.rows[0]
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }

  static async update({ id, input }) {
    const { name, parentCategoryId } = input
    try {
      const result = await client.query(
        'UPDATE category SET name = COALESCE($1, name), parent_category_id = COALESCE($2, parent_category_id) WHERE category_id = $3 RETURNING *',
        [name, parentCategoryId || null, id]
      )
      return result.rows[0]
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }

  static async delete({ id }) {
    try {
      const result = await client.query(
        'DELETE FROM category WHERE category_id = $1 RETURNING *',
        [id]
      )
      return result.rows[0]
    } catch (error) {
      console.error(error)
      return 'Error'
    }
  }
}
