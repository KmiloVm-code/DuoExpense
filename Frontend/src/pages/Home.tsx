import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getFixedIncomeService } from '../services/FixedIncome'

function Home () {
  const { user } = useAuth()
  const username = user.nombre

  // convert date 2024-08-20T05:00:00.000Z en 20/08/2024
  const convertDate = (date: string) => {
    const newDate = new Date(date)
    return newDate.toLocaleDateString()
  }

  // convert valor 2000 en cop $2.000 y eliminar decimales
  const convertValue = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value)
  }

  const [icome, setIncome] = useState([{ concepto: '', valor: 0, fecha: '' }])

  const getIcome = async () => {
    if (user.id_usuario) {
      const response = await getFixedIncomeService(user.id_usuario)
      if (response) {
        const data = response.map((income: { concepto: string, valor: number, fecha: string }) => {
          return {
            concepto: income.concepto,
            valor: convertValue(income.valor),
            fecha: convertDate(income.fecha)
          }
        })
        setIncome(data)
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-1/2 m-auto h-screen gap-5">
      <h1 className="text-4xl font-bold">Welcome {username}</h1>
      <button onClick={getIcome} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Get Income
      </button>
      <div className="flex flex-col gap-5">
        {icome.length > 0 && icome.map((income, index) => (
          <div key={index} className="flex flex-col gap-2">
            <p className="font-extrabold">Concepto: <span className="font-medium">{income.concepto}</span></p>
            <p className="font-bold">Valor: <span className="font-medium">{income.valor}</span></p>
            <p className="font-bold">Fecha: <span className="font-medium">{income.fecha}</span></p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
