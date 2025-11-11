'use client'

import React, { useCallback, useRef, useState } from 'react'
import Menubar from './Menubar'
import Toolbar from './Toolbar'
import ChatList from './ChatList'

const MIN_WIDTH = 240
const MAX_WIDTH = 420

export default function Navigation() {
    const [width, setWidth] = useState<number>(280)
    const frameRef = useRef<HTMLElement | null>(null)

    const handleResizeStart = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault()
            const startX = event.clientX
            const startWidth = frameRef.current?.offsetWidth ?? width

            const onMouseMove = (moveEvent: MouseEvent) => {
                const delta = moveEvent.clientX - startX
                const nextWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + delta))
                setWidth(nextWidth)
            }

            const onMouseUp = () => {
                window.removeEventListener('mousemove', onMouseMove)
                window.removeEventListener('mouseup', onMouseUp)
            }

            window.addEventListener('mousemove', onMouseMove)
            window.addEventListener('mouseup', onMouseUp)
        },
        [width]
    )

    return (
        <aside
            ref={frameRef}
            className="relative flex h-full max-h-full shrink-0 select-none overflow-hidden border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
            style={{ width }}
        >
            <nav className="flex h-full max-h-full w-full min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4">
                <Menubar />
                <ChatList />
                <div className="pt-2">
                    <Toolbar />
                </div>
            </nav>
            <button
                type="button"
                aria-label="调整导航宽度"
                onMouseDown={handleResizeStart}
                className="absolute right-0 top-0 h-full w-2 cursor-col-resize bg-transparent transition hover:bg-zinc-200/60 dark:hover:bg-zinc-700/40"
            />
        </aside>
    )
}
