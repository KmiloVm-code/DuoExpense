import { useState, useMemo, Key, useCallback } from 'react'
import TableComponent from '../components/TableComponent'
import { useAuth } from '../contexts/AuthContext'
import { Button, Checkbox, DatePicker, Input, ModalFooter, useDisclosure } from '@nextui-org/react'
import { convertValue, convertDate } from '../utils/formatters.ts'
import { Icome } from '../Models/IcomeModel.ts'

// import {
//   createIcomeService,
//   deleteIcomeService,
//   getIncomeService,
//   updateIcomeService
// } from '../services/incomes.ts'

// import { useData } from '../hooks/useData.ts'
import ModalErrorComponent from '../components/ModalErrorComponent.tsx'
import { useFormHandler } from '../hooks/useFormHandler.ts'
import { parseDate } from '@internationalized/date'
import ModalFormComponent from '../components/ModalFormComponent.tsx'
import { useDataContext } from '../contexts/DataContext.tsx'

// const services = {
//   getDataService: getIncomeService,
//   createDataService: createIcomeService,
//   updateDataService: updateIcomeService,
//   deleteDataService: deleteIcomeService
// }

const IcomePage = () => {
  const { user } = useAuth()
  const idUsuario = user?.id_usuario ?? ''
  const { data: icome, createData, updateData, deleteData, searchData } = useDataContext().icomeData
  // const { data: icome, createData, updateData, deleteData, searchData } = useData<Icome>(idUsuario, services)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [incomeToEdit, setIncomeToEdit] = useState<Icome | null>(null)

  const initialData: Icome = useMemo(() => ({
    id: 0,
    id_ingreso: 0,
    id_usuario: idUsuario,
    concepto: '',
    descripcion: '',
    ingreso_fijo: false,
    valor: '',
    fecha: new Date().toISOString()
  }), [idUsuario])

  const { dataToEdit, handleSubmit, handleErrors, error, isSubmitting } = useFormHandler<Icome>({
    initialData,
    onSubmit: async (data) => {
      await handleIncome(data)
    },
    dataToEdit: incomeToEdit
  })

  const edit = useCallback((income: Icome) => {
    setIncomeToEdit(income)
    onOpen()
  }, [onOpen])

  const newIncome = useCallback(() => {
    setIncomeToEdit(null)
    onOpen()
  }, [onOpen])

  const handleIncome = useCallback(async (income: Icome): Promise<void> => {
    if (income.id_ingreso) {
      await updateData(income)
    } else {
      await createData(income)
    }
    onOpenChange()
  }, [createData, updateData, onOpenChange])

  const columns = useMemo(() => [
    { key: 'concepto', label: 'Concepto' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'ingreso_fijo', label: 'Ingreso Fijo' },
    { key: 'valor', label: 'Valor' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'actions', label: 'Acciones' }
  ], [])

  const getId = useCallback((item: Icome) => item.id_ingreso ?? 0, [])

  const renderItems = useCallback((item: Icome, columnKey: Key) => {
    switch (columnKey) {
      case 'ingreso_fijo':
        return <span>{item.ingreso_fijo ? 'Si' : 'No'}</span>
      default:
        return <span>{String(item[columnKey as keyof Icome])}</span>
    }
  }, [])

  const renderFormfields = useCallback(() => {
    return (
      <>
        <Input type="text" name="concepto" placeholder="Concepto" defaultValue={dataToEdit?.concepto} required />
        <Input type="text" name="descripcion" placeholder="Descripcion" defaultValue={dataToEdit?.descripcion} />
        <Input type="number" onWheel={(e) => e.currentTarget.blur()} name="valor" placeholder="Valor" defaultValue={dataToEdit?.valor?.toString()} required
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
        />
        <DatePicker name="fecha" label="Fecha" labelPlacement='inside' defaultValue={parseDate(dataToEdit?.fecha?.split('T')[0] || new Date().toISOString().split('T')[0])} />
        <Checkbox type='checkbox' name='ingreso_fijo' color='secondary' defaultSelected={dataToEdit?.ingreso_fijo} >
          Ingreso Fijo
        </Checkbox>
      </>
    )
  }, [dataToEdit])

  const renderButtons = useCallback((onClose: () => void) => {
    return (
      <ModalFooter>
        <Button type="submit" color='secondary' disabled={isSubmitting} isLoading={isSubmitting}>
          {incomeToEdit ? 'Guardar Cambios' : 'Agregar Ingreso'}
        </Button>
        <Button type="reset" color='danger' variant='bordered' onPress={onClose}>
          Cancelar
        </Button>
      </ModalFooter>
    )
  }, [isSubmitting, incomeToEdit])

  return (
    <main className="relative top-36 flex flex-col gap-8 lg:left-64 h-screen p-4 lg:w-[calc(100%-250px)]">
      <section className="flex gap-2 justify-between w-full">
        <div className="md:w-1/3">
          <Input
            placeholder="Buscar"
            radius='lg'
            isClearable
            onClear={() => searchData('')}
            onChange={(e) => searchData(e.target.value)}
            startContent={<i className="bx bx-search-alt-2" />}
          />
        </div>
        <Button onPress={newIncome} color='secondary' variant='shadow'>
          <h1 className='font-bold text-xl'>+</h1> Agregar Ingreso
        </Button>
      </section>

      {typeof error === 'string' && <ModalErrorComponent isOpen={!!error} handleErrors={handleErrors} />}

      <ModalFormComponent<Icome>
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        renderFormFields={renderFormfields}
        renderButtons={renderButtons}
        submit={handleSubmit}
      />
      <TableComponent<Icome>
        data={icome}
        columns={columns}
        getId={getId}
        dataDelete={deleteData}
        toggleModal={edit}
        formatDate={convertDate}
        formatValue={convertValue}
        renderItems={renderItems}
      />
    </main>
  )
}

export default IcomePage
