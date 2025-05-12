import { createContext, useContext, useState, useCallback } from 'react'

const RefreshContext = createContext<
  { refreshKey: number; triggerRefresh: () => void } | undefined
>(undefined)

export const RefreshProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [refreshKey, setRefreshKey] = useState(0)

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  return (
    <RefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  )
}

export const useRefresh = () => {
  const context = useContext(RefreshContext)
  if (!context)
    throw new Error('useRefresh debe usarse dentro de RefreshProvider')
  return context
}
