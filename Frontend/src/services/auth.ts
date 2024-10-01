const API_URL_LOGIN = `${import.meta.env.VITE_API_URL}/auth/login`

export const loginService = async (email: string, password: string) => {
  try {
    const response = await fetch(API_URL_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    })

    if (response.ok) {
      return response.json()
    } else {
      console.error('Failed to login')
    }
  } catch (e) {
    console.error('Failed to login', e)
  }
}
