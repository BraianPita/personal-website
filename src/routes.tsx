import { useEffect } from 'react'
import { createRootRoute, createRoute, createRouter, Outlet, Link } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'
import HomePage from './HomePage'
import SkillTreePage from './components/SkillTreePage'

function RootLayout() {
  useEffect(() => {
    // Default to dark mode
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <>
      <Outlet />
      <Toaster position="bottom-center" />
    </>
  )
}

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const skillsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'skills',
  component: SkillTreePage,
})

export const routeTree = rootRoute.addChildren([indexRoute, skillsRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export { Link }
