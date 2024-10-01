import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@nextui-org/table'
import { Input } from '@nextui-org/react'

import { useAuth } from '../contexts/AuthContext'

import { useBills } from '../hooks/useBills.ts'
import { useModal } from '../hooks/useModal'

import TableCellComponent from '../components/BillTableCell.tsx'
import ModalNewBill from '../components/ModalNewBillComponent'
import BillCard from '../components/BillCard.tsx'

import { Bill } from '../Models/BillsModel.ts'

function BillsPage () {
  const { user } = useAuth()
  const idUsuario = user.id_usuario || ''
  const { bills, createBill, deleteBill, searchBill } = useBills(idUsuario)
  const { isOpen, toggleModal } = useModal()

  const metodoPago = [
    { id: 1, nombre: 'Tarjeta de Credito' },
    { id: 2, nombre: 'Tarjeta de Debito' },
    { id: 3, nombre: 'Efectivo' },
    { id: 4, nombre: 'Transferencia' },
    { id: 5, nombre: 'Otro' }
  ]

  const categorias = [
    { id: 1, nombre: 'Alimentacion' },
    { id: 2, nombre: 'Electronicos' },
    { id: 3, nombre: 'Salud y Belleza' }
  ]

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
        <button onClick={toggleModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Nuevo Gasto
        </button>
      </section>

      <ModalNewBill
        isOpen={isOpen}
        closeModal={toggleModal}
        categorias={categorias}
        metodoPago={metodoPago}
        addNewBill={createBill}
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
              {(columnKey) => <TableCell>{<TableCellComponent bill={bill} columnKey={columnKey} deleteBill={deleteBill} metodoPago={metodoPago} />}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="md:hidden w-full">
        {bills.map((bill) => (
          <BillCard key={bill.id_gasto} bill={bill} deleteBill={deleteBill} />
        ))}
      </div>
    </main>
  )
}

export default BillsPage
