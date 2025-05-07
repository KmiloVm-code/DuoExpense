import { useState, useEffect, useCallback } from 'react'
import { getPaymentMethodsService } from '../services/payment'
import { PaymentMethod } from '../types/PaymentMethod'

export const usePayments = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [error, setError] = useState<unknown | null>(null)

  const getPaymentMethods = useCallback(async () => {
    try {
      const paymentMethods = await getPaymentMethodsService()
      setPaymentMethods(paymentMethods)
    } catch (error) {
      setError(error)
    }
  }, [])

  useEffect(() => {
    getPaymentMethods()
  }, [getPaymentMethods])

  return { paymentMethods, error }
}
