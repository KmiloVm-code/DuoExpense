import { Icome } from '../Models/IcomeModel'

const API_URL = `${import.meta.env.VITE_API_URL}/ingresos`
const options: RequestInit = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include' as RequestCredentials
}

const buildIcomeRequest = (icome: Icome) => ({
  idUsuario: icome.id_usuario,
  concepto: icome.concepto,
  descripcion: icome.descripcion,
  fecha: icome.fecha,
  ingresoFijo: icome.ingreso_fijo,
  valor: icome.valor
})

export const getIncomeService = async ({ filters }: {filters?: string}): Promise<Icome[]> => {
  try {
    const res = await fetch(`${API_URL}?${filters}`, options)
    if (!res.ok) throw new Error('Error al obtener los ingresos')

    const data = await res.json()
    return data
  } catch {
    throw new Error('Error al obtener los ingresos')
  }
}

export const createIcomeService = async (icome: Icome): Promise<Icome> => {
  try {
    const icomeRequest = buildIcomeRequest(icome)
    const res = await fetch(API_URL, {
      ...options,
      method: 'POST',
      body: JSON.stringify(icomeRequest)
    })

    if (!res.ok) throw new Error('Error al crear el ingreso')

    return res.json()
  } catch {
    throw new Error('Error al crear el ingreso')
  }
}

export const updateIcomeService = async (icome: Icome): Promise<Icome> => {
  try {
    const icomeRequest = buildIcomeRequest(icome)
    const res = await fetch(`${API_URL}/${icome.id_ingreso}`, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(icomeRequest)
    })

    if (!res.ok) throw new Error('Error al actualizar el ingreso')

    return res.json()
  } catch {
    throw new Error('Error al actualizar el ingreso')
  }
}

export const deleteIcomeService = async ({ id }: {id: number}) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      ...options,
      method: 'DELETE'
    })

    if (!res.ok) throw new Error('Error al eliminar el ingreso')
  } catch {
    throw new Error('Error al eliminar el ingreso')
  }
}
