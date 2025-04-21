import { Routes, Route, useNavigate } from 'react-router-dom'

import Home from './pages/DashboardPage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'
import { HeroUIProvider } from '@heroui/react'
import './App.css'
import RegisterPage from './pages/RegisterPage.tsx'
import TransactionPage from './pages/TransactionPage.tsx'

function App() {
  const navigate = useNavigate()
  return (
    <HeroUIProvider navigate={navigate}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<TransactionPage />} />
        </Route>
      </Routes>
    </HeroUIProvider>
  )
}

export default App
