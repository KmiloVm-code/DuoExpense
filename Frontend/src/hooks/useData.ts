import { useState, useEffect, useCallback } from 'react'
import debounce from 'just-debounce-it'

interface useDataProps<T> {
  getDataService: (params: { filters?: string }) => Promise<T[]>
  createDataService: (data: T) => Promise<T>
  updateDataService: (data: T) => Promise<T>
  deleteDataService: (params: { id: number }) => Promise<void>
  filters?: string
}

export const useData = <T extends { id: number }, >(userid: string, services: useDataProps<T>) => {
  const [data, setData] = useState<T[]>([])
  const [error, setError] = useState<string | null>(null)

  const getData = useCallback(async () => {
    try {
      if (!userid) return
      const fetchedData = await services.getDataService({ filters: `id_usuario=${userid}${services.filters || ''}` })
      fetchedData.sort((a, b) => a.id - b.id)
      setData(fetchedData)
      console.log(fetchedData)
      setError(null)
    } catch {
      setError('Error al cargar los datos')
    }
  }, [userid, services])

  useEffect(() => {
    if (userid) {
      getData()
    }
  }, [getData, userid])

  const createData = async (newData: T) => {
    try {
      const createdData = await services.createDataService(newData)
      setData((prevData: T[]) => [...prevData, createdData])
    } catch {
      setError('Error al crear el registro')
    }
  }

  const updateData = async (updatedData: T) => {
    try {
      await services.updateDataService(updatedData)
      getData()
    } catch {
      setError('Error al actualizar el registro')
    }
  }

  const deleteData = async (id: number) => {
    try {
      await services.deleteDataService({ id })
      getData()
    } catch {
      setError('Error al eliminar el registro')
    }
  }

  const searchData = debounce(async (query: string) => {
    if (!userid) return
    if (!query) {
      getData()
      return
    }

    const filters = new URLSearchParams({ id_usuario: userid, concepto: query }).toString()
    try {
      const filteredData = await services.getDataService({ filters })
      setData(filteredData)
      setError(null)
    } catch {
      setError('Error al buscar el registro')
    }
  }, 500)

  const handleErrors = () => {
    setError(null)
  }

  return { data, error, createData, updateData, deleteData, searchData, handleErrors }
}
