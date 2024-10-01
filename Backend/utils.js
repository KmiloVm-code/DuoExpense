import { createRequire } from 'node:module'
import bcrypt from 'bcrypt'

const require = createRequire(import.meta.url)

export const readJSON = (path) => require(path)

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export const comparePassword = async (password, hash) => bcrypt.compare(password, hash)
