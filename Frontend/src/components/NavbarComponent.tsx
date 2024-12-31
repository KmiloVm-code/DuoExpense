import { Button } from '@nextui-org/react'
import { Link, useLocation } from 'react-router-dom'
import {
  FiHome,
  FiMenu,
  FiX,
  FiUser,
  FiBell,
  FiDollarSign,
  FiTrendingUp
  // FiFilter
} from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/logo.png'
import { useState } from 'react'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { DateRangePicker } from '@nextui-org/date-picker'

import { useDataContext } from '../contexts/DataContext'

interface NavbarComponentProps {

  children?: React.ReactNode;

}

function NavbarComponent ({ children }: NavbarComponentProps) {
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pickerValue, setPickerValue } = useDataContext()

  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <header className="sticky top-0 z-30 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
              aria-label="Toggle Sidebar"
            >
              {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <Link to="/" className="flex items-center ml-4">
              <img src={logo} alt="DuoExpense Logo" className="h-8 w-auto" />
              <span className="ml-2 text-lg font-bold">DuoExpense</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <DateRangePicker
              value={pickerValue}
              onChange={setPickerValue}
              defaultValue={{
                start: today(getLocalTimeZone()).subtract({ days: 1 }),
                end: parseDate(new Date().toISOString().split('T')[0])
              }}
            />
            <Button color="secondary"
              onClick={() => {
                setPickerValue({
                  start: today(getLocalTimeZone()).subtract({ months: 1 }),
                  end: today(getLocalTimeZone())
                })
              }}
            >
              Limpiar Filtros
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700" aria-label="Notifications">
              <FiBell size={20} />
            </button>
            <button className="text-gray-500 hover:text-gray-700" aria-label="User Profile">
              <FiUser size={20} />
            </button>
            <Button color="danger" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-screen overflow-hidden">
        <aside className={`fixed lg:relative inset-y-0 left-0 w-64 bg-white shadow-md z-20 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex justify-end lg:hidden p-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close Sidebar"
            >
              <FiX size={24} />
            </button>
          </div>
          <nav className="mt-8 space-y-4">
            <Link to="/" className={`flex items-center px-6 py-2 ${isActive('/') ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>
              <FiHome className="mr-3" /> Inicio
            </Link>
            <Link to="/bills" className={`flex items-center px-6 py-2 ${isActive('/bills') ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>
              <FiDollarSign className="mr-3" /> Gastos
            </Link>
            <Link to="/ingresos" className={`flex items-center px-6 py-2 ${isActive('/ingresos') ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>
              <FiTrendingUp className="mr-3" /> Ingresos
            </Link>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </>
  )
}

export default NavbarComponent
