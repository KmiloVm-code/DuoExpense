import { Routes, Route, useNavigate } from 'react-router-dom'

import Home from './pages/Home.tsx'
import LoginPage from './pages/LoginPage.tsx'
import BillsPage from './pages/BillsPage.tsx'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'
import { NextUIProvider } from '@nextui-org/react'
import IcomePage from './pages/IcomePage.tsx'
import './App.css'
import RegisterPage from './pages/registerPage.tsx'

function App () {
  const navigate = useNavigate()
  return (
    <NextUIProvider navigate={navigate} >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/bills" element={<BillsPage />} />
          <Route path="/ingresos" element={<IcomePage />} />
        </Route>
      </Routes>
    </NextUIProvider>
  )
}

export default App
