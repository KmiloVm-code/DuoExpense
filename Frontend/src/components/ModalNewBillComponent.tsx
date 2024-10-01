import { ChangeEvent, FC, FormEvent, useState } from 'react'
import { Bill } from '../Models/BillsModel'
import { useAuth } from '../contexts/AuthContext'

interface ModalNewBillProps {
  isOpen: boolean;
  closeModal: () => void;
  categorias: Array<{ id: number; nombre: string }>;
  metodoPago: Array<{ id: number; nombre: string }>;
  addNewBill: (bill: Bill) => Promise<void>;
}

const ModalNewBill: FC<ModalNewBillProps> = ({ isOpen, closeModal, categorias, metodoPago, addNewBill }) => {
  const [showCreditCard, setShowCreditCard] = useState(false)
  const { user } = useAuth()

  const handlePaymentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setShowCreditCard(event.target.value === '1')
  }

  const addBill = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const fields = Object.fromEntries(new window.FormData(event.target as HTMLFormElement).entries())
    const bill: Bill = {
      id_usuario: user.id_usuario,
      concepto: fields.concepto as string,
      valor: Number(fields.valor),
      fecha: fields.fecha as string,
      cuotas: showCreditCard ? Number(fields.cuotas) : null,
      descripcion: fields.descripcion as string,
      gasto_fijo: fields.gastoFijo === 'on',
      id_categoria: Number(fields.idCategoria),
      id_tarjeta: showCreditCard ? Number(fields.idTarjeta) : null,
      id_metodo_pago: Number(fields.idMetodoPago),
      empresa: fields.empresa as string
    }

    try {
      await addNewBill(bill)
      closeModal()
    } catch {
      throw new Error('Error al agregar el gasto')
    }
  }

  if (!isOpen) return null
  return (
    <main className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          <form onSubmit={addBill} onReset={closeModal} className="flex flex-col gap-5 p-5">
            <h1 className="text-2xl font-bold">Agregar Gasto</h1>
            <input type="text" name="concepto" placeholder="Concepto" className="p-2 border border-gray-300 rounded" required/>
            <input type="date" name="fecha" placeholder="Fecha" className="p-2 border border-gray-300 rounded" required/>
            <input type="text" name="descripcion" placeholder="Descripcion" className="p-2 border border-gray-300 rounded" />
            <input type="number" name="valor" placeholder="Valor" className="p-2 border border-gray-300 rounded" required/>
            <input type="text" name="empresa" placeholder="Empresa" className="p-2 border border-gray-300 rounded" />
            <select name="idCategoria" className="p-2 border border-gray-300 rounded" required>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            <select name="idMetodoPago" onChange={handlePaymentChange} className="p-2 border border-gray-300 rounded" required>
              {metodoPago.map((metodo) => (
                <option key={metodo.id} value={metodo.id}>
                  {metodo.nombre}
                </option>
              ))}
            </select>

            {showCreditCard && (
              <div className="flex flex-col gap-5">
                <input type="number" name="cuotas" placeholder="Cuotas" className="p-2 border border-gray-300 rounded" required />
                <input type="number" name="idTarjeta" placeholder="Tarjeta" className="p-2 border border-gray-300 rounded" required />
              </div>
            )}

            <div className="flex gap-2">
              <input type="checkbox" name='gastoFijo' />
              <label>Gasto Fijo</label>
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Agregar Gasto
            </button>
            <button type="reset" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default ModalNewBill
