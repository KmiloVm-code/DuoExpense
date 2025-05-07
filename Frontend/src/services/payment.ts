import { PaymentMethod } from '../types/PaymentMethod'

const API_URL = `${import.meta.env.VITE_API_URL}/payment-methods`

const options: RequestInit = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include' as RequestCredentials
}

interface apiPaymentMethod {
  payment_method_id: number
  name: string
}

function mapApiPaymentMethod(
  apiPaymentMethod: apiPaymentMethod
): PaymentMethod {
  return {
    paymentMethodId: apiPaymentMethod.payment_method_id.toString(),
    name: apiPaymentMethod.name
  }
}

export const getPaymentMethodsService = async (): Promise<PaymentMethod[]> => {
  try {
    const response = await fetch(API_URL, options)
    const data = await response.json()
    const paymentMethods: apiPaymentMethod[] = data
    const mappedPaymentMethods: PaymentMethod[] =
      paymentMethods.map(mapApiPaymentMethod)
    return mappedPaymentMethods
  } catch (error) {
    console.error(error)
    throw error
  }
}
