import { Key } from 'react'
import { Bill } from '../Models/BillsModel'
import { Button } from '@nextui-org/react'

type BillTableCellProps = {
  bill: Bill;
  columnKey: Key;
  deleteBill: ({ id }: { id: number }) => Promise<void>;
  metodoPago: { id: number, nombre: string }[];
  toggleModal: () => void;
}

const TableCellComponent = ({ bill, columnKey, deleteBill, metodoPago, toggleModal }: BillTableCellProps) => {
  const cellValue = bill[columnKey as keyof Bill]
  return (
    <>
      {columnKey === 'gasto_fijo' && <span>{cellValue ? 'Si' : 'No'}</span>}
      {columnKey === 'id_metodo_pago' && (
        <span>{metodoPago.find(mp => mp.id === cellValue)?.nombre}</span>
      )}
      {columnKey !== 'gasto_fijo' && columnKey !== 'id_metodo_pago' && (
        <span>{cellValue}</span>
      )}
      {columnKey === 'actions' && (
        <div className="flex gap-2">
          <Button color='secondary' variant='flat' onPress={toggleModal}>
            Editar
          </Button>
          <Button color='danger' variant='light' onPress={() => bill.id_gasto !== undefined && deleteBill({ id: bill.id_gasto })}>
            Eliminar
          </Button>
        </div>
      )}
    </>
  )
}

export default TableCellComponent
