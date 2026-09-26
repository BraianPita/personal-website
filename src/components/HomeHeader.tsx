import { toast } from 'sonner'
import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomeHeader({ contact }: { contact: string }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(contact)
    toast.success('Copied to clipboard')
  }

  return (
    <header className="mb-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Braian Pita</h1>
      <p className="mt-2 flex items-center justify-center gap-1 text-sm text-muted-foreground">
        {contact}
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={copyToClipboard}
          aria-label="Copy email to clipboard"
        >
          <Copy />
        </Button>
      </p>
    </header>
  )
}
