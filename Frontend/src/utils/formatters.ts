// Función para convertir fecha en formato "dd/mm/yyyy"
export const convertDate = (date: string): string => {
  return date.split('T')[0].split('-').reverse().join('-')
}

// Función para convertir valor en formato COP sin decimales
export const convertValue = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value)
}
