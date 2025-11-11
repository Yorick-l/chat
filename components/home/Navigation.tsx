'use client'

import React from 'react'
import { useTheme } from '@/lib/theme'

export default function Navigation() {
  const { theme, toggleTheme } = useTheme()

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-col gap-6 p-4">
        <h1 className="text-xl font-semibold text-white">导航</h1>
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
          aria-label="切换主题"
        >
          {theme === 'dark' ? '切换为浅色' : '切换为深色'}
        </button>
      </div>
    </aside>
  )
}
