import { useState, useEffect, useCallback } from 'react'
import {
  createBillService,
  deleteBillService,
  getBillsService,
  updateBillService
} from '../services/bills.ts'
import { Bill } from '../Models/BillsModel.ts'
import debounce from 'just-debounce-it'

export const useBills = (userid: string) => {
  const [bills, setBills] = useState<Bill[]>([])
  const [error, setError] = useState<string | null>(null)

  const getBills = useCallback(async () => {
    console.log('userid', userid)
    try {
      if (!userid) return
      const bills = await getBillsService({ filters: `id_usuario=${userid}` })
      setBills(bills)
      setError(null)
    } catch {
      setError('Error al cargar los gastos')
    }
  }, [userid])

  useEffect(() => {
    getBills()
  }, [getBills, userid])

  const createBill = async (bill: Bill) => {
    const newBill = await createBillService({ bill })
    console.log(newBill)
    const formattedBill = {
      ...newBill
    }

    setBills((prevBills: Bill[]) => [...prevBills, formattedBill])
  }

  const updateBill = async (bill: Bill) => {
    const updatedBill = await updateBillService({ bill })

    const formattedBill = {
      ...updatedBill
    }

    console.log('formattedBill', formattedBill)

    setBills((prevBills: Bill[]) => {
      const billsCopy = [...prevBills]
      const billIndex = billsCopy.findIndex((b) => b.id_gasto === bill.id_gasto)
      billsCopy[billIndex] = formattedBill
      return billsCopy
    })
  }

  const deleteBill = async (id: number): Promise<void> => {
    try {
      await deleteBillService({ id })
      setBills((prevBills: Bill[]) => prevBills.filter((bill) => bill.id_gasto !== id))
    } catch {
      setError('Error al eliminar el gasto')
    }
  }

  const searchBill = debounce(async (query: string) => {
    if (!userid) return
    if (!query) {
      getBills()
      return
    }
    const queryParams = {
      id_usuario: userid,
      concepto: query
    }
    try {
      const bills = await getBillsService({
        filters: new URLSearchParams(queryParams).toString()
      })
      setBills(bills)
      setError(null)
    } catch {
      setError('Error al cargar los gastos')
    }
  }, 500)

  const handleErrors = () => {
    setError(null)
  }

  return { bills, deleteBill, createBill, searchBill, updateBill, error, handleErrors }
}
