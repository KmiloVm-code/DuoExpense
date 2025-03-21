import NavbarComponent from '../components/NavbarComponent'
import { SidebarProvider } from '../components/ui/sidebar'
import AppSidebar from '../components/AppSidebar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider className="grid grid-cols-1 md:grid-cols-[auto_1fr] grid-rows-[auto_1fr] min-h-screen">
      <AppSidebar />

      <header className="sticky top-0 z-10 bg-white shadow-sm px-4 py-6">
        <NavbarComponent />
      </header>

      <main
        className="md:col-start-2 bg-gray-200 py-6 px-4"
        aria-label="Main content"
      >
        {children}
      </main>
    </SidebarProvider>
  )
}

export default Layout
