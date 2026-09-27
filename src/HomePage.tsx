import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeStore, resolveTheme } from '@/stores/theme-store'
import LinkTree from './LinkTree'
import HomeHeader from './components/HomeHeader'

export default function HomePage() {
  const origin = window.location.origin
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const resolved = resolveTheme(theme)

  const toggleColorMode = () => setTheme(resolved === 'dark' ? 'light' : 'dark')

  return (
    <div className="flex min-h-svh flex-col">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center px-4">
        <Button
          variant="ghost"
          onClick={toggleColorMode}
          className="mb-4 text-foreground"
        >
          {resolved === 'dark' ? <Moon /> : <Sun />}
          {resolved} mode
        </Button>
        <HomeHeader contact="contact.braianpita@gmail.com" />
        <LinkTree />
      </div>
      <Copyright origin={origin} />
    </div>
  )
}

function Copyright({ origin }: { origin: string }) {
  return (
    <footer className="fixed bottom-0 left-0 w-full border-t bg-background py-2">
      <p className="text-center text-sm text-muted-foreground">
        {'Copyright © '}
        <a
          href={origin}
          className="hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {origin.replace(/^https?:\/\//, '')}
        </a>{' '}
        {new Date().getFullYear()}.
      </p>
    </footer>
  )
}
