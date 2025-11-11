'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'

export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'yorick-theme'
const PREFERRED_QUERY = '(prefers-color-scheme: dark)'

type Listener = () => void

type ThemeStore = {
  subscribe: (listener: Listener) => () => void
  getSnapshot: () => ThemeMode
  getServerSnapshot: () => ThemeMode
  setTheme: (next: ThemeMode, options?: { force?: boolean }) => void
  start: () => void
  stop: () => void
}

const palette: Record<ThemeMode, { background: string; foreground: string }> = {
  light: { background: '#ffffff', foreground: '#171717' },
  dark: { background: '#0a0a0a', foreground: '#ededed' },
}

function getPreferredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  return window.matchMedia(PREFERRED_QUERY).matches ? 'dark' : 'light'
}

function applyTheme(mode: ThemeMode) {
  if (typeof window === 'undefined') return

  const root = window.document.documentElement
  const paletteEntry = palette[mode]

  root.classList.remove(mode === 'dark' ? 'light' : 'dark')
  root.classList.add(mode)

  if (mode === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }

  root.style.setProperty('--background', paletteEntry.background)
  root.style.setProperty('--foreground', paletteEntry.foreground)
}

function createThemeStore(): ThemeStore {
  let current: ThemeMode = 'light'
  const listeners = new Set<Listener>()
  let activeSubscribers = 0
  let teardown: (() => void) | null = null

  const notify = () => {
    listeners.forEach((listener) => listener())
  }

  const setTheme = (next: ThemeMode, options?: { force?: boolean }) => {
    if (!options?.force && current === next) return
    current = next
    applyTheme(current)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, current)
    }
    notify()
  }

  return {
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    getSnapshot() {
      return current
    },
    getServerSnapshot() {
      return current
    },
    setTheme,
    start() {
      if (typeof window === 'undefined') return
      activeSubscribers += 1
      if (activeSubscribers > 1) return

      const preferred = getPreferredTheme()
      setTheme(preferred, { force: true })

      const media = window.matchMedia(PREFERRED_QUERY)
      const handleMediaChange = (event: MediaQueryListEvent) => {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        if (stored === 'light' || stored === 'dark') return
        setTheme(event.matches ? 'dark' : 'light')
      }

      const handleStorage = (event: StorageEvent) => {
        if (event.key !== STORAGE_KEY || (event.newValue !== 'light' && event.newValue !== 'dark')) return
        setTheme(event.newValue)
      }

      media.addEventListener('change', handleMediaChange)
      window.addEventListener('storage', handleStorage)

      teardown = () => {
        media.removeEventListener('change', handleMediaChange)
        window.removeEventListener('storage', handleStorage)
        teardown = null
      }
    },
    stop() {
      if (typeof window === 'undefined') return
      activeSubscribers = Math.max(0, activeSubscribers - 1)
      if (activeSubscribers === 0 && teardown) {
        teardown()
      }
    },
  }
}

let themeStore: ThemeStore | null = null

function getThemeStore(): ThemeStore {
  if (themeStore) return themeStore
  themeStore = createThemeStore()
  return themeStore
}

export function useTheme() {
  const store = getThemeStore()

  const theme = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  )

  const setTheme = useCallback((next: ThemeMode) => {
    store.setTheme(next)
  }, [store])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [setTheme, theme])

  useEffect(() => {
    store.start()
    return () => {
      store.stop()
    }
  }, [store])

  return { theme, setTheme, toggleTheme }
}
