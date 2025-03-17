import NavbarComponent from '../components/NavbarComponent'
import Sidebar from '../components/Sidebar'
import { useState } from 'react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
    console.log(sidebarOpen)
  }

  const sideBarHandleRender = () => {
    return sidebarOpen ? 'translate-x-0' : '-translate-x-full'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px,1fr] grid-rows-[140px,1fr] h-screen">
      <aside
        className={`fixed lg:sticky h-full top-0 w-2/3 lg:w-auto lg:col-start-1 lg:col-end-2 row-start-1 lg:row-end-3 shadow-sm z-30 bg-white transform lg:transform-none transition-transform duration-300 ${sideBarHandleRender()}`}
        aria-label="Sidebar"
      >
        <Sidebar handle={handleSidebar} />
      </aside>

      <header className="sticky top-0 z-20">
        <NavbarComponent handle={handleSidebar} />
      </header>

      <main
        className="lg:col-start-2 bg-gray-200 py-6 px-4"
        aria-label="Main content"
      >
        {children}
      </main>
    </div>
  )
}

export default Layout
