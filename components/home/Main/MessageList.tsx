import { useEffect, useRef } from 'react'
import { SiOpenai } from 'react-icons/si'
import { IoPersonCircle } from 'react-icons/io5'
import Markdown from '@/components/common/Markdown'
import { useAppStore } from '@/stores'

export default function MessageList() {
    const { messageList, streamId, setMessageList, selectedChat } = useAppStore()
    const scrollRef = useRef<HTMLDivElement>(null)

    // 自动滚动到底部（当有新消息或流式更新时）
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messageList, streamId])


    const getData = async (chatId: string) => {
        const response = await fetch(`/api/message/list?chatId=${chatId}`)

        if (!response.ok) {
            console.error('Failed to get chat list')
            return
        }
        const { data } = await response.json()
        setMessageList(data)
    }

    useEffect(()=>{
        selectedChat && getData(selectedChat.id)
    },[selectedChat])

    return (
        <div 
            ref={scrollRef}
            className="scrollbar-primary flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-2"
        >
            {messageList.length === 0 ? (
                <div className="flex h-full w-full items-center justify-center text-zinc-400 dark:text-zinc-600">
                    <p className="text-sm">还没有消息，开始对话吧～</p>
                </div>
            ) : (
                <ul className="flex w-full flex-col gap-4">
                    {messageList.map((message) => {
                        const isUser = message.role === 'user'
                        return (
                            <li key={message.id} className="flex w-full">
                                <div
                                    className={`flex w-full items-start gap-3 ${
                                        isUser ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`flex items-start gap-3 rounded-lg p-4 transition-colors ${
                                            isUser
                                                ? 'max-w-[75%] flex-row-reverse bg-indigo-50/80 dark:bg-indigo-950/30'
                                                : 'max-w-[75%] bg-zinc-50/80 dark:bg-zinc-800/30'
                                        }`}
                                    >
                                        <div className="shrink-0">
                                            {isUser ? (
                                                <IoPersonCircle className="text-2xl text-indigo-500 dark:text-indigo-400" />
                                            ) : (
                                                <SiOpenai className="text-2xl text-indigo-500 dark:text-indigo-400" />
                                            )}
                                        </div>
                                        <div
                                            className={`min-w-0 flex-1 text-sm leading-relaxed ${
                                                isUser
                                                    ? 'text-zinc-800 dark:text-zinc-200'
                                                    : 'text-zinc-700 dark:text-zinc-300'
                                            }`}
                                        >
                                            <Markdown>
                                                {message.id === streamId
                                                    ? `${message.content}◑ω◐`
                                                    : message.content}
                                            </Markdown>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
