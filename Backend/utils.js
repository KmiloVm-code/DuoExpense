import { createRequire } from 'node:module'
import bcrypt from 'bcrypt'

const require = createRequire(import.meta.url)

export const readJSON = (path) => require(path)

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export const comparePassword = async (password, hash) =>
  bcrypt.compare(password, hash)

// Function to calculate safe dates, avoiding errors like "February 31st"
export function calculateSafeDate(originalDate, monthsAhead) {
  const date = new Date(originalDate)
  date.setMonth(date.getMonth() + monthsAhead)

  // Adjustment to prevent overflow (e.g., 31/01 + 1 month → 28/02 or 31/03)
  if (date.getDate() !== new Date(originalDate).getDate()) {
    date.setDate(0) // Last day of the previous month
  }
  return date.toISOString()
}
