'use client'

import React from 'react'
import { useTheme } from '@/lib/theme'
import { useAppStore } from '@/stores'
import Button from '@/components/common/Button'
import { FaBars } from 'react-icons/fa'
import Welcome from './Welcome'
import ChatInput from './ChatInput'
export default function Main() {
    const { theme } = useTheme()
    const { isDrawerOpen, toggleDrawer } = useAppStore()
    return (
        <section className="flex-1 overflow-y-auto p-6 pb-44 relative">
            <div
                className={`mx-auto max-w-5xl rounded-2xl border border-zinc-200/70 p-6 transition-colors backdrop-blur ${theme === 'dark'
                    ? 'bg-zinc-900/90 text-zinc-100 dark:border-zinc-800/60'
                    : 'bg-white/90 text-zinc-900 shadow-lg shadow-indigo-100/40'
                    }`}
            >
                {
                    !isDrawerOpen && (
                        <Button icon={<FaBars />} variant="secondary" onClick={toggleDrawer} />
                    )
                }

                <div className="flex flex-col gap-4">
                    <Welcome />
                </div>
            </div>
            <ChatInput />
        </section>
    )
}
