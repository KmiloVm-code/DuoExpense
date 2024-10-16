import { useState, ChangeEvent, useCallback, useEffect } from 'react'

export const usePaymentMethod = () => {
  const [showCreditCard, setShowCreditCard] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState([{ id: 0, nombre: '' }])

  const getPaymentMethod = useCallback(async () => {
    try {
      const metodoPago = [
        { id: 1, nombre: 'Tarjeta de Credito' },
        { id: 2, nombre: 'Tarjeta de Debito' },
        { id: 3, nombre: 'Efectivo' },
        { id: 4, nombre: 'Transferencia' },
        { id: 5, nombre: 'Otro' }
      ]
      setPaymentMethod(metodoPago)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    getPaymentMethod()
  }, [getPaymentMethod])

  const handlePaymentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    setShowCreditCard(value === '1')
  }

  return {
    showCreditCard,
    handlePaymentChange,
    paymentMethod
  }
}
