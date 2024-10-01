import { useState, useEffect, useCallback } from 'react'
import {
  createBillService,
  deleteBillService,
  getBillsService,
  updateBillService
} from '../services/bills.ts'
import { Bill } from '../Models/BillsModel.ts'
import { convertDate, convertValue } from '../utils/formatters.ts'
import debounce from 'just-debounce-it'

export const useBills = (userid: string) => {
  const [bills, setBills] = useState<Bill[]>([])
  const [, setError] = useState<string | null>(null)

  const getBills = useCallback(async () => {
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

    const formattedBill = {
      ...newBill,
      fecha: convertDate(newBill.fecha || ''),
      valor: convertValue(newBill.valor || 0)
    }

    setBills((prevBills: Bill[]) => [...prevBills, formattedBill])
  }

  const updateBill = async (bill: Bill) => {
    const updatedBill = await updateBillService(bill)

    const formattedBill = {
      ...updatedBill,
      fecha: convertDate(updatedBill.fecha || ''),
      valor: convertValue(updatedBill.valor || 0)
    }

    setBills((prevBills) =>
      prevBills.map((b) =>
        b.id_gasto === formattedBill.id_gasto ? formattedBill : b
      )
    )
  }

  const deleteBill = async ({ id }: { id: number }) => {
    await deleteBillService({ id }).then(() => {
      getBills()
    })
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

  return { bills, deleteBill, createBill, searchBill, updateBill }
}
