import { Routes, Route, useNavigate } from 'react-router-dom'

import Home from './pages/Home.tsx'
import LoginPage from './pages/LoginPage.tsx'
import BillsPage from './pages/BillsPage.tsx'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'
import NavbarComponent from './components/NavbarComponent.tsx'
import { NextUIProvider } from '@nextui-org/react'

function App () {
  const navigate = useNavigate()
  return (
    <NextUIProvider navigate={navigate} >
      <NavbarComponent />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/bills" element={<BillsPage />} />
        </Route>
      </Routes>
    </NextUIProvider>
  )
}

export default App
