import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link as ReactLink, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar } from '@nextui-org/react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/logo.png'

function NavbarComponent () {
  const { user, logout } = useAuth()

  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <Navbar isBordered isBlurred position="sticky" className="z-10 top-0 bg-white">
      <NavbarBrand>
        <Link to={'/'} className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-16" />
          <h1 className="sm:block hidden text-lg font-bold">DuoExpense</h1>
        </Link>
      </NavbarBrand>
      <NavbarContent className="sm:flex gap-4" justify="center">
      <NavbarItem isActive={isActive('/')}>
        <ReactLink as={Link} to={'/'} color={isActive('/') ? 'secondary' : 'foreground'} aria-current="page">
          Inicio
        </ReactLink>
      </NavbarItem>
      <NavbarItem isActive={isActive('/bills')}>
        <ReactLink as={Link} to={'/bills'} color={isActive('/bills') ? 'secondary' : 'foreground'} aria-current="page">
          Gastos
        </ReactLink>
      </NavbarItem>
      <NavbarItem isActive={isActive('/ingresos')}>
        <ReactLink as={Link} to={'/ingresos'} color={isActive('/ingresos') ? 'secondary' : 'foreground'}>
          Ingresos
        </ReactLink>
      </NavbarItem>
    </NavbarContent>

    <NavbarContent as="div" justify="end">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            color="secondary"
            name={user.nombre}
            size="sm"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{user.email}</p>
          </DropdownItem>
          <DropdownItem key="settings">My Settings</DropdownItem>
          <DropdownItem key="team_settings">Team Settings</DropdownItem>
          <DropdownItem key="analytics">Analytics</DropdownItem>
          <DropdownItem key="system">System</DropdownItem>
          <DropdownItem key="configurations">Configurations</DropdownItem>
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
          <DropdownItem key="logout" color="danger" onClick={logout}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarContent>
    </Navbar>
  )
}

export default NavbarComponent
