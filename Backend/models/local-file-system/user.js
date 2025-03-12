import { readJSON } from '../../utils.js'
import { randomUUID } from 'node:crypto'

const users = readJSON('./users.json')

export class UserModel {
  static async getAll({ name }) {
    if (name) {
      return users.filter((user) =>
        user.nombre.toLowerCase().includes(name.toLowerCase())
      )
    }
    return users
  }

  static async getById({ id }) {
    const user = users.find((user) => user.id_usuario === id)
    return user
  }

  static async create({ input }) {
    const newUser = {
      id: randomUUID(),
      ...input,
      timestamp: Date.now()
    }

    users.push(newUser)

    return newUser
  }

  static async delete({ id }) {
    const userIndex = users.findIndex((user) => user.id_usuario === id)
    if (userIndex === -1) return false

    users.splice(userIndex, 1)
    return true
  }

  static async update({ id, input }) {
    const userIndex = users.findIndex((user) => user.id_usuario === id)
    if (userIndex === -1) return false

    users[userIndex] = {
      ...users[userIndex],
      ...input
    }

    return users[userIndex]
  }
}
