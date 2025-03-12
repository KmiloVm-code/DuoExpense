import logo from '../assets/logo.png'
import { FiPieChart, FiDollarSign, FiTrendingUp, FiX } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = ({ handle }: { handle: () => void }) => {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <div className="lg:sticky top-0">
        <div className="px-4 py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="DuoExpense Logo" className="w-12 h-12" />
            <span className="hidden lg:block ml-2 text-xl font-bold">
              DuoExpense
            </span>
          </Link>
          <FiX
            className="block lg:hidden text-gray-500 cursor-pointer hover:text-gray-700 focus:outline-none"
            onClick={handle}
            size={24}
          />
        </div>

        <nav className="space-y-4 p-4">
          <Link
            to="/"
            className={`flex items-center px-6 py-2 rounded-md ${isActive('/') ? 'bg-violet-400 text-gray-900' : 'text-gray-700 hover:bg-violet-400'}`}
          >
            <FiPieChart className="mr-3 text-lg" /> Dashboard
          </Link>
          <Link
            to="/bills"
            className={`flex items-center px-6 py-2 rounded-md ${isActive('/bills') ? 'bg-violet-400 text-gray-900' : 'text-gray-700 hover:bg-violet-400'}`}
          >
            <FiDollarSign className="mr-3 text-lg" /> Gastos
          </Link>
          <Link
            to="/ingresos"
            className={`flex items-center px-6 py-2 rounded-md ${isActive('/ingresos') ? 'bg-violet-400 text-gray-900' : 'text-gray-700 hover:bg-violet-400'}`}
          >
            <FiTrendingUp className="mr-3 text-lg" /> Ingresos
          </Link>
        </nav>
      </div>
    </>
  )
}

export default Sidebar
