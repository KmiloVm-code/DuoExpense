import { Button, useDisclosure } from '@nextui-org/react'
import { Input } from '@nextui-org/input'

import { useAuth } from '../contexts/AuthContext'

import { useBills } from '../hooks/useBills.ts'
import { convertValue, convertDate } from '../utils/formatters.ts'

import TableCellComponent from '../components/BillTableCell.tsx'
import ModalNewBill from '../components/ModalNewBillComponent'

import { Bill } from '../Models/BillsModel.ts'
import { Key, useState } from 'react'
import { usePaymentMethod } from '../hooks/usePaymentMethod.ts'
import ModalErrorComponent from '../components/ModalErrorComponent.tsx'

function BillsPage () {
  const { user } = useAuth()
  const { bills, createBill, updateBill, deleteBill, searchBill, error, handleErrors } = useBills(user?.id_usuario ?? '')
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [billToEdit, setBillToEdit] = useState<Bill | null>(null)
  const { paymentMethod } = usePaymentMethod()

  const editOpen = (bill: Bill) => {
    setBillToEdit(bill)
    onOpen()
  }

  const newOpen = () => {
    setBillToEdit(null)
    onOpen()
  }

  const handleBill = async (bill: Bill): Promise<void> => {
    if (bill.id_gasto) {
      await updateBill(bill)
    } else {
      await createBill(bill)
    }
    onOpenChange()
  }

  const columns = [
    { key: 'concepto', label: 'Concepto' },
    { key: 'descripcion', label: 'Descripcion' },
    { key: 'gasto_fijo', label: 'Gasto Fijo' },
    { key: 'id_metodo_pago', label: 'Metodo de Pago' },
    { key: 'valor', label: 'Valor' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'actions', label: 'Acciones' }
  ]

  const getId = (item: Bill) => item.id_gasto ?? 0

  const method = (id: Key) => {
    return paymentMethod.find((metodo) => metodo.id === id)?.nombre
  }

  const renderItems = (item: Bill, columnKey: Key) => {
    switch (columnKey) {
      case 'gasto_fijo':
        return <span>{item.gasto_fijo ? 'Si' : 'No'}</span>
      case 'id_metodo_pago':
        return <span>{item.id_metodo_pago !== undefined ? method(item.id_metodo_pago) : 'N/A'}</span>
      default:
        return <span>{String(item[columnKey as keyof Bill])}</span>
    }
  }

  return (
    <main className="flex flex-col items-center justify-center w-full m-auto gap-8 p-8">

      {error && <ModalErrorComponent isOpen={!!error} handleErrors={handleErrors} />}

      <section className="flex gap-2 justify-between w-full">
        <div className="md:w-1/3">
          <Input
            placeholder="Buscar"
            radius='lg'
            isClearable
            onClear={() => searchBill('')}
            onChange={(e) => searchBill(e.target.value)}
            startContent={<i className="bx bx-search-alt-2" />}
          />
        </div>
        <Button onPress={newOpen} color='secondary' variant='shadow'>
          <h1 className='font-bold text-xl'>+</h1> Agregar Gasto
        </Button>
      </section>

      <ModalNewBill
        isOpen={isOpen}
        addNewBill={handleBill}
        onOpenChange={onOpenChange}
        billToEdit={billToEdit}
      />

      <TableCellComponent<Bill> data={bills} toggleModal={editOpen} dataDelete={deleteBill} columns={columns} formatDate={convertDate} formatValue={convertValue} getId={getId} renderItems={renderItems}/>
    </main>
  )
}

export default BillsPage
