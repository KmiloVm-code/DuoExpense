import { Button } from '@nextui-org/react'
import { Link, useLocation } from 'react-router-dom'
import {
  FiPieChart,
  FiMenu,
  FiX,
  FiUser,
  FiBell,
  FiDollarSign,
  FiTrendingUp
} from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/logo.png'
import { useState } from 'react'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { DateRangePicker } from '@nextui-org/date-picker'

import { useDataContext } from '../contexts/DataContext'

function NavbarComponent () {
  const { logout, user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pickerValue, setPickerValue } = useDataContext()

  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 h-screen z-30">
      <header className="bg-gray-200 shadow-md">
        <div className="px-4 py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
        <img src={logo} alt="DuoExpense Logo" className="w-12 h-12" />
        <span className="ml-2 text-xl font-bold">DuoExpense</span>
          </Link>
        </div>

        <div className="fixed lg:left-64 top-0 z-20 bg-white w-full lg:w-[calc(100%-256px)] px-4 py-6 flex flex-col">
          <div className="flex justify-between items-center">
          <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
        aria-label="Toggle Sidebar"
          >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        <h2 className="text-lg lg:text-2xl font-bold">Bienvenido {user?.nombre}</h2>
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

          <div className="flex items-center space-x-4 mt-4 w-full lg:w-fit justify-center lg:justify-start px-8 lg:px-0">
        <DateRangePicker
          value={pickerValue}
          onChange={setPickerValue}
          defaultValue={{
            start: today(getLocalTimeZone()).subtract({ days: 1 }),
            end: parseDate(new Date().toISOString().split('T')[0])
          }}
        />
        <Button
          color="secondary"
          onClick={() => {
            setPickerValue({
              start: today(getLocalTimeZone()).subtract({ months: 1 }),
              end: today(getLocalTimeZone())
            })
          }}
        >
          Último Mes
        </Button>
          </div>
        </div>
      </header>

      <menu className="flex h-screen">
        <div className={`fixed bg-gray-200 lg:relative inset-y-0 left-0 w-64 shadow-md z-30 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex justify-end lg:hidden p-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close Sidebar"
            >
              <FiX size={24} />
            </button>
          </div>
          <nav className="space-y-4 p-4">
            <Link to="/" className={`flex items-center px-6 py-2 rounded-md ${isActive('/') ? 'bg-violet-400 text-gray-900' : 'text-gray-700 hover:bg-violet-400'}`}>
              <FiPieChart className="mr-3 text-lg" /> Dashboard
            </Link>
            <Link to="/bills" className={`flex items-center px-6 py-2 rounded-md ${isActive('/bills') ? 'bg-violet-400 text-gray-900' : 'text-gray-700 hover:bg-violet-400'}`}>
              <FiDollarSign className="mr-3 text-lg" /> Gastos
            </Link>
            <Link to="/ingresos" className={`flex items-center px-6 py-2 rounded-md ${isActive('/ingresos') ? 'bg-violet-400 text-gray-900' : 'text-gray-700 hover:bg-violet-400'}`}>
              <FiTrendingUp className="mr-3 text-lg" /> Ingresos
            </Link>
          </nav>
        </div>
      </menu>
    </nav>
  )
}

export default NavbarComponent
