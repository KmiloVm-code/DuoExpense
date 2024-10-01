import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card'
import { Bill } from '../Models/BillsModel'

type billCardProps = {
  bill: Bill;
  deleteBill: ({ id }: { id: number }) => Promise<void>;
}

const BillCard = ({ bill, deleteBill }: billCardProps) => {
  return (
    <Card key={bill.id_gasto} className="mb-3">
    <CardHeader>
      <h3 className="text-xl font-bold">{bill.concepto}</h3>
    </CardHeader>
    <CardBody className="flex flex-col gap-2">
      <p><span className="font-bold">Fecha:</span> {bill.fecha}</p>
      <p><span className="font-bold">Descripcion:</span> {bill.descripcion}</p>
      <p><span className="font-bold">Valor:</span> {bill.valor}</p>
      <p><span className="font-bold">Gasto Fijo:</span> {bill.gasto_fijo ? 'Si' : 'No'}</p>
      <p><span className="font-bold">Empresa:</span> {bill.empresa}</p>
    </CardBody>
    <CardFooter>
      <div className="flex gap-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Editar
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => bill.id_gasto !== undefined && deleteBill({ id: bill.id_gasto })}>
          Eliminar
        </button>
      </div>
    </CardFooter>
  </Card>
  )
}

export default BillCard
