import { Chat } from "@/types/chat"
import Button from '@/components/common/Button'
import { FaPen, FaTrash, FaCheck } from 'react-icons/fa'
import { useState } from "react"
import { useEventBus, useAppStore } from "@/stores"
type ChatItemProps = {
    chat: Chat
    onSelect: (chat: Chat) => void
    selectedChat?: Chat | null
}
export default function ChatItem({ chat, onSelect, selectedChat }: ChatItemProps) {
    const isSelected = selectedChat && selectedChat.id === chat.id

    const [editing, setEditing] = useState(false)
    const [title, setTitle] = useState(chat.title)
    const { publish } = useEventBus()
    const { setSelectedChat } = useAppStore()

    const updateChat = async () => {
        const response = await fetch(`/api/chat/update`, {
            method: 'POST',
            body: JSON.stringify({
                id: chat.id,
                title: title,
            }),
        })

        if (!response.ok) {
            console.error('Failed to update chat')
            return
        }
        const { code } = await response.json()
        if (code === 0) {
            publish('fetchChatList')
        } else {
            console.error('Failed to update chat')
        }
    }

    const deleteChat = async () => {
        const response = await fetch(`/api/chat/delete`, {
            method: 'POST',
            body: JSON.stringify({
                id: chat.id,
            }),
        })

        if (!response.ok) {
            console.error('Failed to delete chat')
            return
        }
        const { code } = await response.json()
        if (code === 0) {
            publish('fetchChatList')
            setSelectedChat(null)
        } else {
            console.error('Failed to delete chat')
        }
    }

    return (
        <li
            key={chat.id}
            className={`group relative rounded-md px-3 py-2 hover:cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 
                ${isSelected ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
            onClick={() => onSelect(chat)}
        >
            {
                editing ? (
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => {
                            if (e.target.value.length <= 60) setTitle(e.target.value)
                        }}
                        maxLength={60}
                        className="pr-12 w-full rounded border border-purple-500 bg-white px-2 py-1 text-sm text-zinc-800 outline-none focus:border-purple-600 dark:border-purple-400 dark:bg-zinc-800 dark:text-zinc-100"
                        placeholder="请输入标题 (最多60字)"
                        style={{ boxSizing: 'border-box' }}
                    />
                ) : (
                    <h3 className="mr-12 truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {chat.title}
                    </h3>
                )
            }
            <div className="absolute right-1 top-1/2 flex -translate-y-1/2 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                    icon={editing ? <FaCheck size={14} /> : <FaPen size={14} />}
                    variant="ghost"
                    size="sm"
                    className="rounded"
                    onClick={(e) => {
                        e.stopPropagation()
                        setEditing(!editing)
                        if (editing) {
                            updateChat()
                        }
                    }}
                    title="编辑"
                />
                <Button
                    icon={<FaTrash size={14} />}
                    variant="ghost"
                    size="sm"
                    className="rounded"
                    onClick={(e) => {
                        e.stopPropagation()
                        deleteChat()
                    }}
                    title="删除"
                />

            </div>
        </li>
    )
}
