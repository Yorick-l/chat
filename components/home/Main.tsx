'use client'

import React from 'react'
import { useTheme } from '@/lib/theme'

export default function Main() {
  const { theme } = useTheme()

  return (
    <section className="flex-1 overflow-y-auto p-6">
      <div
        className={`h-full rounded-lg p-4 transition-colors ${
          theme === 'dark'
            ? 'bg-zinc-900 text-zinc-100'
            : 'bg-zinc-100 text-zinc-900'
        }`}
      ></div>
    </section>
  )
}
