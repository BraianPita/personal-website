import { createRootRoute, createRoute, createRouter, Outlet, Link } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'
import { initTheme } from '@/stores/theme-store'
import HomePage from './HomePage'
import SkillTreePage from './components/SkillTreePage'

function RootLayout() {
  // Applies the persisted theme to <html> and syncs system preference changes
  initTheme()

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
