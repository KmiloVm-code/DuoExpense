import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card'
import { Bill } from '../Models/BillsModel'
import { Button } from '@nextui-org/react'

type billCardProps = {
  bill: Bill;
  deleteBill: ({ id }: { id: number }) => Promise<void>;
  toggleModal: () => void;
}

const BillCard = ({ bill, deleteBill, toggleModal }: billCardProps) => {
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
        <Button color='secondary' variant='flat' onPress={toggleModal}>
          Editar
        </Button>
        <Button color='danger' variant='light' onPress={() => bill.id_gasto !== undefined && deleteBill({ id: bill.id_gasto })}>
          Eliminar
        </Button>
      </div>
    </CardFooter>
  </Card>
  )
}

export default BillCard
