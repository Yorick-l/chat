import React from 'react'
import { cn } from '@/lib/utils'
import { IoIosSend } from 'react-icons/io'
type ChatInputProps = {
    className?: string
}

export default function ChatInput({ className }: ChatInputProps) {
    return (
        <div
            className={cn(
                "absolute bottom-0 left-0 right-0 z-50 pointer-events-none border-zinc-200/80 bg-white/90 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/80 w-full",
                className
            )}
        >
            <div className="pointer-events-auto w-full px-4 pb-3 sm:px-6 sm:pb-4">
                <form className="flex w-full items-end gap-3 rounded-2xl border border-zinc-200/80 bg-white/95 p-3 shadow-lg shadow-indigo-500/5 transition focus-within:border-indigo-400/80 focus-within:shadow-indigo-300/20 dark:border-zinc-800/70 dark:bg-zinc-900/80 dark:focus-within:border-indigo-400/50 dark:focus-within:shadow-indigo-400/10">
                    <textarea
                        rows={1}
                        placeholder="输入问题或使用 / 指令快速开始…"
                        className="max-h-40 flex-1 resize-none rounded-xl bg-transparent px-3 py-2 text-sm leading-6 text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
                    />
                    <div className="flex items-center gap-2">
                        {/* <button
                            type="button"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition hover:-translate-y-0.5 hover:border-indigo-400 hover:text-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-400 dark:hover:text-indigo-300"
                            title="上传附件"
                        >
                            📎
                        </button>
                        <button
                            type="button"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition hover:-translate-y-0.5 hover:border-indigo-400 hover:text-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-400 dark:hover:text-indigo-300"
                            title="打开语音"
                        >
                            🎤
                        </button> */}
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:hover:bg-indigo-500/90 dark:focus-visible:ring-offset-zinc-950"
                        >
                            <IoIosSend className="text-base" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
