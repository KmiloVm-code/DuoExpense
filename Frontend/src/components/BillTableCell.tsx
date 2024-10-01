import { Key } from 'react'
import { Bill } from '../Models/BillsModel'

type BillTableCellProps = {
  bill: Bill;
  columnKey: Key;
  deleteBill: ({ id }: { id: number }) => Promise<void>;
  metodoPago: { id: number, nombre: string }[];
}

const TableCellComponent = ({ bill, columnKey, deleteBill, metodoPago }: BillTableCellProps) => {
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
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Editar
          </button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => bill.id_gasto !== undefined && deleteBill({ id: bill.id_gasto })}>
            Eliminar
          </button>
        </div>
      )}
    </>
  )
}

export default TableCellComponent
