import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@nextui-org/table'
import { Button, useDisclosure } from '@nextui-org/react'
import { Input } from '@nextui-org/input'

import { useAuth } from '../contexts/AuthContext'

import { useBills } from '../hooks/useBills.ts'
// import { useModal } from '../hooks/useModal'

import TableCellComponent from '../components/BillTableCell.tsx'
import ModalNewBill from '../components/ModalNewBillComponent'
import BillCard from '../components/BillCard.tsx'

import { Bill } from '../Models/BillsModel.ts'
import { useState } from 'react'

function BillsPage () {
  const { user } = useAuth()
  const idUsuario = user.id_usuario || ''
  const { bills, createBill, updateBill, deleteBill, searchBill } = useBills(idUsuario)
  // const { isOpen, toggleModal } = useModal()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [billToEdit, setBillToEdit] = useState<Bill | null>(null)

  const editOpen = (bill: Bill) => {
    setBillToEdit(bill)
    onOpen()
  }

  const newOpen = () => {
    setBillToEdit(null)
    onOpen()
  }

  return (
    <main className="flex flex-col items-center justify-center w-full m-auto gap-8 p-8">
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
        addNewBill={billToEdit ? updateBill : createBill}
        onOpenChange={onOpenChange}
        billToEdit={billToEdit}
      />

      <Table className='hidden md:block w-full'
        aria-label='Gastos'
        isHeaderSticky
        isStriped
        fullWidth
      >
        <TableHeader>
          <TableColumn key='concepto'>Concepto</TableColumn>
          <TableColumn key='fecha'>Fecha</TableColumn>
          <TableColumn key='descripcion'>Descripcion</TableColumn>
          <TableColumn key='valor'>Valor</TableColumn>
          <TableColumn key='gasto_fijo'>Gasto Fijo</TableColumn>
          <TableColumn key='empresa'>Empresa</TableColumn>
          <TableColumn key='id_metodo_pago'>Medio de Pago</TableColumn>
          <TableColumn key='actions'>Acciones</TableColumn>
        </TableHeader>
        <TableBody<Bill> emptyContent={<p>No Hay Gastos</p>} items={bills}>
          {(bill) => (
            <TableRow key={bill.id_gasto}>
              {(columnKey) => <TableCell>{<TableCellComponent bill={bill} columnKey={columnKey} deleteBill={deleteBill} toggleModal={editOpen} />}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="md:hidden w-full">
        {bills.map((bill) => (
          <BillCard key={bill.id_gasto} bill={bill} deleteBill={deleteBill} toggleModal={onOpen} />
        ))}
      </div>
    </main>
  )
}

export default BillsPage
