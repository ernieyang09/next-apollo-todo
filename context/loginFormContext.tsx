import { createContext, useState, useContext, useMemo } from 'react'
import LoadingDialog from '../components/LoginDialog'

const LoadingFormContext = createContext({ open: false, setOpen: (b: boolean) => {} })

export default ({ children }) => {
  const [open, setOpen] = useState(false)
  const value = useMemo(() => ({ open, setOpen }), [open, setOpen])
  return (
    <LoadingFormContext.Provider value={value}>
      {children}
      <LoadingDialog open={open} setOpen={setOpen} />
    </LoadingFormContext.Provider>
  )
}

export const useLoadingFormContext = () => useContext(LoadingFormContext)
