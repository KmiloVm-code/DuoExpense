import { useState, useMemo, Key } from 'react'
import TableComponent from '../components/TableComponent'
import { useAuth } from '../contexts/AuthContext'
import { Button, Input, useDisclosure } from '@nextui-org/react'
import { convertValue, convertDate } from '../utils/formatters.ts'
import { Icome } from '../Models/IcomeModel.ts'

import {
  createIcomeService,
  deleteIcomeService,
  getIncomeService,
  updateIcomeService
} from '../services/incomes.ts'

import { useData } from '../hooks/useData.ts'
import ModalNewBill from '../components/ModalNewBillComponent.tsx'
import ModalErrorComponent from '../components/ModalErrorComponent.tsx'

const IcomePage = () => {
  const { user } = useAuth()
  const services = useMemo(() => ({
    getDataService: getIncomeService,
    createDataService: createIcomeService,
    updateDataService: updateIcomeService,
    deleteDataService: deleteIcomeService
  }), [])

  const { data: icome, error, createData, updateData, deleteData, searchData, handleErrors } = useData<Icome>(user?.id_usuario ?? '', services)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [incomeToEdit, setIncomeToEdit] = useState<Icome | null>(null)

  const edit = (income: Icome) => {
    setIncomeToEdit(income)
    onOpen()
  }

  const newIncome = () => {
    setIncomeToEdit(null)
    onOpen()
  }

  const handleIncome = async (income: Icome): Promise<void> => {
    if (income.id_ingreso) {
      await updateData(income)
    } else {
      await createData(income)
    }
    onOpenChange()
  }

  const columns = [
    { key: 'concepto', label: 'Concepto' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'ingreso_fijo', label: 'Ingreso Fijo' },
    { key: 'valor', label: 'Valor' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'actions', label: 'Acciones' }
  ]

  const getId = (item: Icome) => item.id_ingreso ?? 0

  const renderItems = (item: Icome, columnKey: Key) => {
    switch (columnKey) {
      case 'ingreso_fijo':
        return <span>{item.ingreso_fijo ? 'Si' : 'No'}</span>
      default:
        return <span>{String(item[columnKey as keyof Icome])}</span>
    }
  }

  return (
    <main className="flex flex-col items-center justify-center w-full m-auto gap-8 p-8">
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

      {error && <ModalErrorComponent isOpen={!!error} handleErrors={handleErrors} />}

      <ModalNewBill
        isOpen={isOpen}
        addNewBill={handleIncome}
        onOpenChange={onOpenChange}
        billToEdit={incomeToEdit}
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
