import { useState, useMemo } from 'react'
import { Chat } from '@/types/chat'

import { groupChatsByTime, GROUPED_CHATS_LABELS, GroupedChats } from './utils'
import ChatItem from './ChatItem'

export default function ChatList() {
    const [chats, setChats] = useState<Chat[]>([
        {
            id: '1',
            title: 'Chat 1',
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '2',
            title: 'Chat 2Chat 2Chat 2Chat 2Chat 2Chat 2Chat 2',
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '3',
            title: 'Chat 3',
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(new Date().setDate(new Date().getDate() - 6 * 30))
        },
    ])
    
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
    console.log('===', selectedChat)
    const groupedChats = useMemo(() => groupChatsByTime(chats), [chats])
    return (
        <div className="group/scrollport relative flex h-full w-full flex-1 flex-col overflow-hidden transition-opacity duration-500">
            <div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-primary">
                {Object.entries(groupedChats).map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-2">
                        <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                            {GROUPED_CHATS_LABELS[key as keyof GroupedChats]}
                        </h3>
                        <ul className="flex flex-col gap-2">
                            {value.map((chat) => (
                                <ChatItem key={chat.id} chat={chat} onDelete={() => setChats(chats.filter((c) => c.id !== chat.id))} onEdit={(title) => setChats(chats.map((c) => (c.id === chat.id ? { ...chat, title } : c as Chat)))} onSelect={setSelectedChat} />
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}
