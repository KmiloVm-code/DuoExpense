import { Bill } from '../Models/BillsModel.ts'

const API_URL = `${import.meta.env.VITE_API_URL}/gastos`
const options: RequestInit = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include' as RequestCredentials
}

const buildBillRequest = (bill: Bill) => ({
  idUsuario: bill.id_usuario,
  concepto: bill.concepto,
  fecha: bill.fecha,
  descripcion: bill.descripcion,
  idMetodoPago: bill.id_metodo_pago,
  idTarjeta: bill.id_tarjeta || null,
  cuotas: bill.cuotas || null,
  valor: bill.valor,
  gastoFijo: bill.gasto_fijo,
  idCategoria: bill.id_categoria,
  empresa: bill.empresa
})

export const getBillsService = async ({ filters }: {filters?: string}): Promise<Bill[]> => {
  try {
    const res = await fetch(`${API_URL}?${filters}`, options)
    if (!res.ok) throw new Error('Error al obtener los gastos')

    const data = await res.json()
    return data
  } catch {
    throw new Error('Error al obtener los gastos')
  }
}

export const createBillService = async (bill: Bill): Promise<Bill> => {
  try {
    const billRequest = buildBillRequest(bill)
    const res = await fetch(API_URL, {
      ...options,
      method: 'POST',
      body: JSON.stringify(billRequest)
    })

    if (!res.ok) throw new Error('Error al crear el gasto')

    return res.json()
  } catch {
    throw new Error('Error al crear el gasto')
  }
}

export const updateBillService = async (bill: Bill): Promise<Bill> => {
  try {
    const billRequest = buildBillRequest(bill)
    const res = await fetch(`${API_URL}/${bill.id_gasto}`, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(billRequest)
    })

    if (!res.ok) throw new Error('Error al actualizar el gasto')

    return res.json()
  } catch {
    throw new Error('Error al actualizar el gasto')
  }
}

export const deleteBillService = async ({ id }: {id: number}) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      ...options,
      method: 'DELETE'
    })

    if (!res.ok) throw new Error('Error al eliminar el gasto')

    return res.json()
  } catch {
    throw new Error('Error al eliminar el gasto')
  }
}
