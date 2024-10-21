import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, DatePicker, Select, SelectItem, Checkbox } from '@nextui-org/react'
import { FC } from 'react'
import { parseDate } from '@internationalized/date'

import ModalErrorComponent from './ModalErrorComponent'

import { Bill } from '../Models/BillsModel'
import { useAuth } from '../contexts/AuthContext'
import { useFormHandler } from '../hooks/useFormHandler'
import { usePaymentMethod } from '../hooks/usePaymentMethod'
import { useCategories } from '../hooks/UseCategories'

interface ModalNewBillProps {
  isOpen: boolean;
  addNewBill: (bill: Bill) => Promise<void>;
  onOpenChange: () => void;
  billToEdit?: Bill | null;
}

const ModalNewBill: FC<ModalNewBillProps> = ({ isOpen, addNewBill, onOpenChange, billToEdit }) => {
  const { user } = useAuth()

  const initialData: Bill = {
    id_usuario: user?.id_usuario,
    concepto: '',
    descripcion: '',
    valor: 0,
    empresa: '',
    id_categoria: 0,
    id_metodo_pago: 0,
    cuotas: null,
    id_tarjeta: null,
    fecha: new Date().toISOString()
  }

  const { dataToEdit, handleSubmit, handleErrors, error, isSubmitting } = useFormHandler<Bill>({
    initialData,
    onSubmit: async (data) => {
      await addNewBill(data)
      onOpenChange()
    },
    dataToEdit: billToEdit
  })

  const { showCreditCard, handlePaymentChange, paymentMethod } = usePaymentMethod()

  const { categories } = useCategories()

  if (!isOpen) return null
  if (error) {
    return (
      <ModalErrorComponent isOpen={!!error} handleErrors={handleErrors} />
    )
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onSubmit={handleSubmit} scrollBehavior='inside'>
      <ModalContent>
        {(onClose) => (
          <>
        <ModalHeader>
          <h1 className='text-xl font-semibold'> {billToEdit ? 'Editar Gasto' : 'Nuevo Gasto'} </h1>
        </ModalHeader>
        <ModalBody className='m-1'>
          <form className="flex flex-col gap-4">
            <Input type="text" name="concepto" placeholder="Concepto" defaultValue={dataToEdit?.concepto} required/>
            <DatePicker name="fecha" label="Fecha" labelPlacement='inside' defaultValue={parseDate(dataToEdit?.fecha?.split('T')[0] || new Date().toISOString().split('T')[0])} />
            <Input type="text" name="descripcion" placeholder="Descripcion" defaultValue={dataToEdit?.descripcion} />
            <Input type="number" onWheel={(e) => e.currentTarget.blur()} name="valor" placeholder="Valor" defaultValue={dataToEdit?.valor?.toString()} required
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">$</span>
              </div>
            }
            />
            <Input type="text" name="empresa" placeholder="Empresa" defaultValue={dataToEdit?.empresa} />
            <Select name="id_categoria" label="Categoria" labelPlacement='inside' defaultSelectedKeys={dataToEdit?.id_categoria ? [dataToEdit?.id_categoria.toString()] : []} isRequired items={categories}>
              {(category) => <SelectItem key={category.id}>{category.nombre}</SelectItem>}
            </Select>

            <Select name="id_metodo_pago" label="Metodo de Pago" labelPlacement='inside' isRequired items={paymentMethod} onChange={handlePaymentChange} defaultSelectedKeys={dataToEdit?.id_metodo_pago ? [dataToEdit?.id_metodo_pago.toString()] : []}>
              {(method) => <SelectItem key={method.id}>{method.nombre}</SelectItem>}
            </Select>

            {showCreditCard && (
              <div className="flex flex-col gap-5">
                <Input type="number" onWheel={(e) => e.currentTarget.blur()} name="cuotas" placeholder="Cuotas" defaultValue={dataToEdit?.cuotas?.toString()} required />
                <Input type="number" onWheel={(e) => e.currentTarget.blur()} name="id_tarjeta" placeholder="Tarjeta" defaultValue={dataToEdit?.id_tarjeta?.toString()} required />
              </div>
            )}

            <Checkbox type='checkbox' name='gasto_fijo' color='secondary' defaultSelected={dataToEdit?.gasto_fijo} >
              Gasto Fijo
            </Checkbox>

            <ModalFooter>
              <Button type="submit" color='secondary' disabled={isSubmitting} isLoading={isSubmitting}>
                {billToEdit ? 'Guardar Cambios' : 'Agregar Gasto'}
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
