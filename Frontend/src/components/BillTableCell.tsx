import { Key } from 'react'
import { Bill } from '../Models/BillsModel'
import { Button } from '@nextui-org/react'
import { convertDate, convertValue } from '../utils/formatters.ts'
import { usePaymentMethod } from '../hooks/usePaymentMethod.ts'

type BillTableCellProps = {
  bill: Bill;
  columnKey: Key;
  deleteBill: ({ id }: { id: number }) => Promise<void>;
  toggleModal: (bill: Bill) => void;
}

const TableCellComponent = ({ bill, columnKey, deleteBill, toggleModal }: BillTableCellProps) => {
  const cellValue = bill[columnKey as keyof Bill]

  const { paymentMethod } = usePaymentMethod()

  const handleEdit = () => {
    toggleModal(bill)
  }

  const handleDelete = () => {
    if (bill.id_gasto !== undefined) {
      deleteBill({ id: bill.id_gasto })
    } else {
      console.error('El id_gasto es indefinido')
    }
  }

  const metodoNombre = paymentMethod.find((metodo) => metodo.id === cellValue)?.nombre

  return (
    <>
      {columnKey === 'gasto_fijo' && <span>{cellValue ? 'Si' : 'No'}</span>}
      {columnKey === 'id_metodo_pago' && <span>{metodoNombre}</span>}
      {columnKey === 'valor' &&
        <span> {convertValue(cellValue as number)} </span>}
      {columnKey === 'fecha' &&
        <span>{convertDate(cellValue as string)}</span>
      }
      {columnKey !== 'gasto_fijo' && columnKey !== 'id_metodo_pago' && columnKey !== 'fecha' && columnKey !== 'valor' && (
        <span>{cellValue}</span>
      )}
      {columnKey === 'actions' && (
        <div className="flex gap-2">
          <Button color='secondary' variant='flat' onPress={handleEdit}>
            Editar
          </Button>
          <Button color='danger' variant='light' onPress={handleDelete}>
            Eliminar
          </Button>
        </div>
      )}
    </>
  )
}

export default TableCellComponent
