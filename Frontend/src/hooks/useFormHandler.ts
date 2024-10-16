import { useState, FormEvent, useEffect } from 'react'

interface UseFormHandlerProps<T> {
  initialData: T;
  onSubmit: (data: T) => Promise<void>;
  dataToEdit?: T | null;
}

export const useFormHandler = <T, >({ initialData, onSubmit, dataToEdit }: UseFormHandlerProps<T>) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<unknown | null>(null)

  useEffect(() => {
    if (dataToEdit) {
      setIsSubmitting(false)
    }
  }, [dataToEdit])

  const formFieldsCapture = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formDataEntries = new FormData(event.target as HTMLFormElement)
    const newFormData = {} as Record<string, unknown>
    const formElements = (event.target as HTMLFormElement).elements

    // Recorremos los elementos del formulario para asegurar capturar todos los checkboxes
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i] as HTMLInputElement

      if (!element.name) continue

      // Verificamos si es checkbox
      if (element.type === 'checkbox') {
        newFormData[element.name] = element.checked
      }
    }

    // Procesamos los campos que sí están presentes en FormData (campos activos)
    formDataEntries.forEach((value, key) => {
      const element = (event.target as HTMLFormElement).elements.namedItem(key)

      if (!element) return

      if (element instanceof HTMLInputElement) {
        switch (element.type) {
          case 'radio':
            if (element.checked) {
              newFormData[key] = value
            }
            break
          case 'number':
            newFormData[key] = Number(value.toString().replace(/[^0-9.-]+/g, ''))
            break
          default:
            // Otros inputs diferentes a checkbox (ya los manejamos)
            if (element.type !== 'checkbox') {
              newFormData[key] = value
            }
            break
        }
      } else if (element instanceof HTMLSelectElement) {
        newFormData[key] = value === '' ? null : Number(value)
      } else {
        newFormData[key] = value
      }
    })

    // Si estás editando datos (dataToEdit), los fusionamos
    if (dataToEdit) {
      return {
        ...dataToEdit,
        ...newFormData
      } as T
    }

    // Si estás creando un nuevo formulario, usas initialData
    return {
      ...initialData,
      ...newFormData
    } as T
  }

  const handleErrors = (error: unknown) => {
    setError(error)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true)
    try {
      const data = formFieldsCapture(event)
      await onSubmit(data)
      setIsSubmitting(false)
    } catch (error) {
      setIsSubmitting(false)
      setError(error)
    }
  }

  return {
    isSubmitting,
    error,
    handleSubmit,
    handleErrors,
    dataToEdit
  }
}
