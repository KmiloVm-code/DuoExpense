const API_URL = `${import.meta.env.VITE_API_URL}/ingresos-fijos`

export const getFixedIncomeService = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (response) {
      return response.json()
    } else {
      console.error('Failed to get fixed income')
    }
  } catch {
    console.error('Failed to get fixed income')
  }
}
