import {
  Button,
  Checkbox,
  DatePicker,
  Select,
  SelectItem,
  useDisclosure
} from '@heroui/react'
import { Input } from '@heroui/input'

import { useAuth } from '../contexts/AuthContext'

// import { useData } from '../hooks/useData.ts'
import { convertValue, convertDate } from '../utils/formatters.ts'

import TableComponent from '../components/TableComponent.tsx'
import ModalFormComponent from '../components/ModalFormComponent.tsx'

import { Bill } from '../Models/BillsModel.ts'
import { Key, useCallback, useMemo, useState } from 'react'
import { usePaymentMethod } from '../hooks/usePaymentMethod.ts'
import ModalErrorComponent from '../components/ModalErrorComponent.tsx'

// import {
//   createBillService,
//   deleteBillService,
//   getBillsService,
//   updateBillService
// } from '../services/bills.ts'

import { useFormHandler } from '../hooks/useFormHandler.ts'
import { parseDate } from '@internationalized/date'
import { useCategories } from '../hooks/UseCategories.ts'
import { useDataContext } from '../contexts/DataContext.tsx'

// const services = {
//   getDataService: getBillsService,
//   createDataService: createBillService,
//   updateDataService: updateBillService,
//   deleteDataService: deleteBillService
// }

function BillsPage() {
  const { user } = useAuth()
  const idUsuario = user?.id_usuario ?? ''
  const {
    data: bills,
    createData,
    updateData,
    deleteData,
    searchData
  } = useDataContext().billsData
  // const { data: bills, createData, updateData, deleteData, searchData } = useData<Bill>(idUsuario, services)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [billToEdit, setBillToEdit] = useState<Bill | null>(null)
  const { showCreditCard, handlePaymentChange, paymentMethod } =
    usePaymentMethod()
  const { categories } = useCategories()

  const initialData: Bill = useMemo(
    () => ({
      id: 0,
      id_usuario: idUsuario,
      concepto: '',
      descripcion: '',
      valor: 0,
      empresa: '',
      id_categoria: 0,
      id_metodo_pago: 0,
      cuotas: null,
      id_tarjeta: null,
      fecha: new Date().toISOString()
    }),
    [idUsuario]
  )

  const { dataToEdit, handleSubmit, handleErrors, error, isSubmitting } =
    useFormHandler<Bill>({
      initialData,
      onSubmit: async (data) => {
        await handleBill(data)
      },
      dataToEdit: billToEdit
    })

  const editOpen = useCallback(
    (bill: Bill) => {
      setBillToEdit(bill)
      onOpen()
    },
    [onOpen]
  )

  const newOpen = useCallback(() => {
    setBillToEdit(null)
    onOpen()
  }, [onOpen])

  const handleBill = useCallback(
    async (bill: Bill): Promise<void> => {
      if (bill.id_gasto) {
        await updateData(bill)
      } else {
        await createData(bill)
      }
      onOpenChange()
    },
    [createData, updateData, onOpenChange]
  )

  const columns = useMemo(
    () => [
      { key: 'concepto', label: 'Concepto' },
      { key: 'descripcion', label: 'Descripcion' },
      { key: 'gasto_fijo', label: 'Gasto Fijo' },
      { key: 'id_metodo_pago', label: 'Metodo de Pago' },
      { key: 'valor', label: 'Valor' },
      { key: 'fecha', label: 'Fecha' },
      { key: 'actions', label: 'Acciones' }
    ],
    []
  )

  const getId = useCallback((item: Bill) => item.id_gasto ?? 0, [])

  const method = useCallback(
    (id: Key) => paymentMethod.find((metodo) => metodo.id === id)?.nombre,
    [paymentMethod]
  )

  const renderItems = useCallback(
    (item: Bill, columnKey: Key) => {
      switch (columnKey) {
        case 'gasto_fijo':
          return <span>{item.gasto_fijo ? 'Si' : 'No'}</span>
        case 'id_metodo_pago':
          return (
            <span>
              {item.id_metodo_pago !== undefined
                ? method(item.id_metodo_pago)
                : 'N/A'}
            </span>
          )
        default:
          return <span>{String(item[columnKey as keyof Bill])}</span>
      }
    },
    [method]
  )

  const renderFormFields = useCallback(() => {
    return (
      <>
        <Input
          type="text"
          name="concepto"
          placeholder="Concepto"
          defaultValue={dataToEdit?.concepto}
          required
        />
        <DatePicker
          name="fecha"
          label="Fecha"
          labelPlacement="inside"
          defaultValue={parseDate(
            dataToEdit?.fecha?.split('T')[0] ||
              new Date().toISOString().split('T')[0]
          )}
        />
        <Input
          type="text"
          name="descripcion"
          placeholder="Descripcion"
          defaultValue={dataToEdit?.descripcion}
        />
        <Input
          type="number"
          onWheel={(e) => e.currentTarget.blur()}
          name="valor"
          placeholder="Valor"
          defaultValue={dataToEdit?.valor?.toString()}
          required
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
        />
        <Input
          type="text"
          name="empresa"
          placeholder="Empresa"
          defaultValue={dataToEdit?.empresa}
        />
        <Select
          name="id_categoria"
          label="Categoria"
          labelPlacement="inside"
          defaultSelectedKeys={
            dataToEdit?.id_categoria
              ? [dataToEdit?.id_categoria.toString()]
              : []
          }
          isRequired
          items={categories}
        >
          {(category) => (
            <SelectItem key={category.id}>{category.nombre}</SelectItem>
          )}
        </Select>

        <Select
          name="id_metodo_pago"
          label="Metodo de Pago"
          labelPlacement="inside"
          isRequired
          items={paymentMethod}
          onChange={handlePaymentChange}
          defaultSelectedKeys={
            dataToEdit?.id_metodo_pago
              ? [dataToEdit?.id_metodo_pago.toString()]
              : []
          }
        >
          {(method) => <SelectItem key={method.id}>{method.nombre}</SelectItem>}
        </Select>

        {showCreditCard && (
          <div className="flex flex-col gap-5">
            <Input
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              name="cuotas"
              placeholder="Cuotas"
              defaultValue={dataToEdit?.cuotas?.toString()}
              required
            />
            <Input
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              name="id_tarjeta"
              placeholder="Tarjeta"
              defaultValue={dataToEdit?.id_tarjeta?.toString()}
              required
            />
          </div>
        )}

        <Checkbox
          type="checkbox"
          name="gasto_fijo"
          color="secondary"
          defaultSelected={dataToEdit?.gasto_fijo}
        >
          Gasto Fijo
        </Checkbox>
      </>
    )
  }, [
    dataToEdit,
    showCreditCard,
    categories,
    paymentMethod,
    handlePaymentChange
  ])

  const renderButton = useCallback(
    (onClose: () => void) => (
      <>
        <Button
          type="submit"
          color="secondary"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          {billToEdit ? 'Guardar Cambios' : 'Agregar Gasto'}
        </Button>
        <Button
          type="reset"
          color="danger"
          variant="bordered"
          onPress={onClose}
        >
          Cancelar
        </Button>
      </>
    ),
    [billToEdit, isSubmitting]
  )

  return (
    <>
      {typeof error === 'string' && (
        <ModalErrorComponent isOpen={!!error} handleErrors={handleErrors} />
      )}

      <section className="flex gap-2 mb-4 justify-between w-full">
        <div className="md:w-1/3">
          <Input
            placeholder="Buscar"
            radius="lg"
            isClearable
            onClear={() => searchData('')}
            onChange={(e) => searchData(e.target.value)}
            startContent={<i className="bx bx-search-alt-2" />}
          />
        </div>
        <Button onPress={newOpen} color="secondary" variant="shadow">
          <h1 className="font-bold text-xl">+</h1> Agregar Gasto
        </Button>
      </section>

      <ModalFormComponent<Bill>
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        renderFormFields={renderFormFields}
        renderButtons={renderButton}
        submit={handleSubmit}
      />

      <TableComponent<Bill>
        data={bills}
        toggleModal={editOpen}
        dataDelete={deleteData}
        columns={columns}
        formatDate={convertDate}
        formatValue={convertValue}
        getId={getId}
        renderItems={renderItems}
      />
    </>
  )
}

export default BillsPage
