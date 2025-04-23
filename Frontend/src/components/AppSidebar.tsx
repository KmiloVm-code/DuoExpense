import logo from '../assets/logo.png'
import { Link, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from './ui/sidebar'
import { LayoutDashboard, CreditCard, HandCoins } from 'lucide-react'
const items = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard
  },
  {
    title: 'Transacciones',
    url: '/transactions',
    icon: CreditCard
  }
]

const AppSidebar = () => {
  const location = useLocation()

  return (
    <Sidebar collapsible="icon" className="group">
      <SidebarHeader className="flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center space-y-2 group-data-[collapsible=icon]:hidden">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-24 h-24" />
          </Link>
          <h1 className="text-2xl font-bold">Duo Expense</h1>
          <p className="text-sm text-gray-500">Tu asistente financiero</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size={'lg'}
                    className="[&>svg]:size-6 group-data-[collapsible=icon]:[&>svg]:ml-1"
                  >
                    <Link
                      to={item.url}
                      className={`flex items-center rounded-md hover:text-white p-2 transition-colors duration-200 ease-in-out ${
                        location.pathname === item.url
                          ? 'bg-primary text-white'
                          : ''
                      }`}
                    >
                      <item.icon className="mr-2" />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
