import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LinkTree from './LinkTree'
import HomeHeader from './components/HomeHeader'

interface HomePageProps {
  mode: 'light' | 'dark'
  toggleColorMode: () => void
}

export default function HomePage({ mode, toggleColorMode }: HomePageProps) {
  const origin = window.location.origin

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col items-center justify-center px-4">
      <Button
        variant="ghost"
        onClick={toggleColorMode}
        className="mb-4 text-foreground"
      >
        {mode === 'dark' ? <Moon /> : <Sun />}
        {mode} mode
      </Button>
      <HomeHeader contact="contact.braianpita@gmail.com" />
      <LinkTree />
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
