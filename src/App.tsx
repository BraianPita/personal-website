import * as React from 'react'
import { Toaster } from '@/components/ui/sonner'
import HomePage from './HomePage'

export default function App() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('dark')

  const toggleColorMode = React.useCallback(() => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }, [])

  React.useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
  }, [mode])

  return (
    <>
      <HomePage mode={mode} toggleColorMode={toggleColorMode} />
      <Toaster position="bottom-center" />
    </>
  )
}
