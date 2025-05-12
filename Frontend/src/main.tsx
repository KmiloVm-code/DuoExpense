import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import { DateRangeProvider } from './contexts/DateRangeContext.tsx'
import { RefreshProvider } from './contexts/RefreshContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RefreshProvider>
      <BrowserRouter>
        <AuthProvider>
          <DateRangeProvider>
            <App />
          </DateRangeProvider>
        </AuthProvider>
      </BrowserRouter>
    </RefreshProvider>
  </StrictMode>
)
