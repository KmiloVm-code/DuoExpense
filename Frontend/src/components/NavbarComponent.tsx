import { Button, RangeValue } from '@heroui/react'
import { FiUser, FiBell } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import {
  DateValue,
  getLocalTimeZone,
  parseDate,
  today
} from '@internationalized/date'
import { DateRangePicker } from '@heroui/date-picker'
import { useDataContext } from '../contexts/DataContext'

import { SidebarTrigger } from './ui/sidebar'

const NavbarComponent = () => {
  const { logout, user } = useAuth()

  const defaultRange: RangeValue<DateValue> = {
    start: today(getLocalTimeZone()).subtract({ days: 1 }),
    end: parseDate(new Date().toISOString().split('T')[0])
  }

  const { pickerValue, setPickerValue } = useDataContext(defaultRange)

  return (
    <nav className="max-h-36 bg-white shadow-sm px-4 py-6 flex flex-col">
      <div className="flex justify-between items-center">
        <span className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-lg lg:text-2xl font-bold">
            Bienvenido {user?.nombre}
          </h2>
        </span>

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
          <Button color="danger" onPress={logout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-4 w-full lg:w-fit justify-center lg:justify-start px-8 lg:px-0">
        <DateRangePicker
          value={pickerValue}
          onChange={(value) =>
            setPickerValue
              ? setPickerValue(value as RangeValue<DateValue>)
              : () => {}
          }
          defaultValue={defaultRange}
          aria-label="Seleccionar rango de fechas"
        />
        <Button
          color="secondary"
          onPress={() => {
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
