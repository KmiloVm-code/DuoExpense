import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, DatePicker, Select, SelectItem, Checkbox } from '@nextui-org/react'

import { ChangeEvent, FC, FormEvent, useState } from 'react'
import { Bill } from '../Models/BillsModel'
import { useAuth } from '../contexts/AuthContext'

interface ModalNewBillProps {
  isOpen: boolean;
  categorias: Array<{ id: number; nombre: string }>;
  metodoPago: Array<{ id: number; nombre: string }>;
  addNewBill: (bill: Bill) => Promise<void>;
  onOpenChange: () => void;
}

const ModalNewBill: FC<ModalNewBillProps> = ({ isOpen, categorias, metodoPago, addNewBill, onOpenChange }) => {
  const [showCreditCard, setShowCreditCard] = useState(false)
  const [isGastoFijo, setIsGastoFijo] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const { user } = useAuth()

  const handlePaymentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setShowCreditCard(event.target.value === '1')
  }

  const addBill = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoaded(true)
    event.preventDefault()

    const fields = Object.fromEntries(new window.FormData(event.target as HTMLFormElement).entries())
    const bill: Bill = {
      id_usuario: user.id_usuario,
      concepto: fields.concepto as string,
      valor: Number(fields.valor),
      fecha: fields.fecha as string,
      cuotas: showCreditCard ? Number(fields.cuotas) : null,
      descripcion: fields.descripcion as string,
      gasto_fijo: isGastoFijo,
      id_categoria: Number(fields.idCategoria),
      id_tarjeta: showCreditCard ? Number(fields.idTarjeta) : null,
      id_metodo_pago: Number(fields.idMetodoPago),
      empresa: fields.empresa as string
    }

    try {
      await addNewBill(bill)
      setIsLoaded(false)
      onOpenChange()
    } catch {
      throw new Error('Error al agregar el gasto')
    }
  }

  if (!isOpen) return null
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='inside'>
      <ModalContent>
        {(onClose) => (
          <>
        <ModalHeader>
          <h1 className='text-xl font-semibold'>Agregar Gasto</h1>
        </ModalHeader>
        <ModalBody className='m-1'>
          <form onSubmit={addBill} className="flex flex-col gap-4">
            <Input type="text" name="concepto" placeholder="Concepto" required/>
            <DatePicker name="fecha" label="Fecha" isRequired />
            <Input type="text" name="descripcion" placeholder="Descripcion" />
            <Input type="number" name="valor" placeholder="Valor" required/>
            <Input type="text" name="empresa" placeholder="Empresa" />
            <Select name="idCategoria" label="Categoria" labelPlacement='inside' isRequired items={categorias}>
              {(categorias) => <SelectItem key={categorias.id}>{categorias.nombre}</SelectItem>}
            </Select>

            <Select name="idMetodoPago" label="Metodo de Pago" labelPlacement='inside' isRequired items={metodoPago} onChange={handlePaymentChange}>
              {(metodoPago) => <SelectItem key={metodoPago.id}>{metodoPago.nombre}</SelectItem>}
            </Select>

            {showCreditCard && (
              <div className="flex flex-col gap-5">
                <Input type="number" name="cuotas" placeholder="Cuotas" required />
                <Input type="number" name="idTarjeta" placeholder="Tarjeta" required />
              </div>
            )}

            <Checkbox name='gastoFijo' color='secondary' isSelected={isGastoFijo} onValueChange={setIsGastoFijo}>Gasto Fijo</Checkbox>

            <ModalFooter>
              <Button type="submit" color='secondary' isLoading={isLoaded}>
                Agregar Gasto
              </Button>
              <Button type="reset" color='danger' variant='bordered' onPress={onClose}>
                Cancelar
              </Button>
            </ModalFooter>

          </form>
        </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ModalNewBill
