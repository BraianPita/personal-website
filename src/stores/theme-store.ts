import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'light' | 'system'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

/**
 * Theme store following the shadcn/ui dark-mode pattern:
 * the resolved theme is applied as a class ("light" | "dark") on
 * <html>, with "system" resolving via prefers-color-scheme.
 * Persisted to localStorage under "vite-ui-theme" (same key as the
 * shadcn docs so existing users keep their preference).
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'vite-ui-theme',
    },
  ),
)

/** Resolve "system" to a concrete theme based on the media query. */
export function resolveTheme(theme: Theme): 'dark' | 'light' {
  if (theme !== 'system') return theme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Applies the theme class to <html> and keeps it in sync when the
 * theme is "system" and the OS preference changes.
 * Call once from the root layout.
 */
export function initTheme(): () => void {
  const apply = (theme: Theme) => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolveTheme(theme))
  }

  apply(useThemeStore.getState().theme)

  // Re-apply when the store changes
  const unsubscribe = useThemeStore.subscribe((state) => apply(state.theme))

  // Re-apply when the OS preference changes while in "system" mode
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const onSystemChange = () => {
    if (useThemeStore.getState().theme === 'system') apply('system')
  }
  media.addEventListener('change', onSystemChange)

  return () => {
    unsubscribe()
    media.removeEventListener('change', onSystemChange)
  }
}
