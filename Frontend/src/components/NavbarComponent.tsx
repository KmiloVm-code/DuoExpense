import { Button } from '@nextui-org/react'
import { FiMenu, FiUser, FiBell } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { DateRangePicker } from '@nextui-org/date-picker'
import { useDataContext } from '../contexts/DataContext'

import { FC } from 'react'

interface NavbarComponentProps {
  handle: () => void
}

const NavbarComponent: FC<NavbarComponentProps> = ({ handle }) => {
  const { logout, user } = useAuth()
  const { pickerValue, setPickerValue } = useDataContext()

  return (
    <nav className="max-h-36 bg-white px-4 py-6 flex flex-col">
      <div className="flex justify-between items-center">
        <FiMenu
          className="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden cursor-pointer"
          onClick={handle}
          size={24}
          aria-label="Toggle Sidebar"
        />
        <h2 className="text-lg lg:text-2xl font-bold">
          Bienvenido {user?.nombre}
        </h2>
        <div className="flex items-center space-x-4">
          <button
            className="text-gray-500 hover:text-gray-700"
            aria-label="Notifications"
          >
            <FiBell size={20} />
          </button>
          <button
            className="text-gray-500 hover:text-gray-700"
            aria-label="User Profile"
          >
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
    </nav>
  )
}

export default NavbarComponent
