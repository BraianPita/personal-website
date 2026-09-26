import type { ComponentProps } from 'react'
import { toast } from 'sonner'
import { siGithub } from 'simple-icons'
import { ExternalLink, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

function LinkedInIcon(props: ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function GithubIcon(props: ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d={siGithub.path} />
    </svg>
  )
}

const links = [
  {
    icon: LinkedInIcon,
    text: 'LinkedIn',
    link: 'https://www.linkedin.com/in/braian-pita/',
    className: 'border-blue-600 text-blue-600 hover:bg-blue-600/10 hover:text-blue-600 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400/10 dark:hover:text-blue-400',
  },
  {
    icon: GithubIcon,
    text: 'Github',
    link: 'https://github.com/BraianPita',
    className: 'border-zinc-500 text-zinc-600 hover:bg-zinc-500/10 hover:text-zinc-700 dark:border-zinc-300 dark:text-zinc-300 dark:hover:bg-zinc-300/10 dark:hover:text-zinc-100',
  },
]

export default function LinkTree() {
  return (
    <div className="flex flex-col items-center gap-3">
      {links.map((item) => (
        <Button
          key={item.text}
          variant="outline"
          className={`w-40 ${item.className}`}
          asChild
        >
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            <item.icon />
            {item.text}
            <ExternalLink className="ml-auto size-3 opacity-50" />
          </a>
        </Button>
      ))}
      <ShareButton />
    </div>
  )
}

function ShareButton() {
  const shareAction = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Braian Pita',
        text: 'Share this website with others.',
        url: window.location.origin,
      })
    } else {
      toast.error('Share is not supported on this browser.')
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="mt-2 rounded-full"
      onClick={shareAction}
    >
      <Share2 />
    </Button>
  )
}
