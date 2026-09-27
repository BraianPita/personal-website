import { useState } from 'react'
import { Moon, Sun, Sparkles } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import LinkTree from './LinkTree'
import HomeHeader from './components/HomeHeader'

export default function HomePage() {
  const origin = window.location.origin
  const [mode, setMode] = useState<'light' | 'dark'>('dark')
  const toggleColorMode = () =>
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))

  return (
    <div className="flex min-h-svh flex-col">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center px-4">
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
        <Button variant="outline" className="mt-6 w-40" asChild>
          <Link to="/skills">
            <Sparkles />
            Skills & Experience
          </Link>
        </Button>
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
