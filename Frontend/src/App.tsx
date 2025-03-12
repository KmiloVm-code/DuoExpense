import { Routes, Route, useNavigate } from 'react-router-dom'

import Home from './pages/DashboardPage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import BillsPage from './pages/BillsPage.tsx'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'
import { HeroUIProvider } from "@heroui/react"
import IcomePage from './pages/IcomePage.tsx'
import './App.css'
import RegisterPage from './pages/RegisterPage.tsx'

function App() {
  const navigate = useNavigate()
  return (
    <HeroUIProvider navigate={navigate}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/bills" element={<BillsPage />} />
          <Route path="/ingresos" element={<IcomePage />} />
        </Route>
      </Routes>
    </HeroUIProvider>
  )
}

export default App
