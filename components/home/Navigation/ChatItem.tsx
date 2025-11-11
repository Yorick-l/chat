import { Chat } from "@/types/chat"
import Button from '@/components/common/Button'
import { FaPen, FaTrash } from 'react-icons/fa'
type ChatItemProps = {
    chat: Chat
    onDelete: () => void
    onEdit: (title: string) => void
    onSelect: (chat: Chat) => void
}
export default function ChatItem({ chat, onDelete, onEdit, onSelect }: ChatItemProps) {
    return (
        <li
            key={chat.id}
            className="group relative rounded-md px-3 py-2 hover:cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900"
            onClick={() => onSelect(chat)}
        >
            <h3 className="mr-12 truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {chat.title}
            </h3>
            <div className="absolute right-1 top-1/2 flex -translate-y-1/2 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                    icon={<FaTrash size={14} />}
                    variant="ghost"
                    size="sm"
                    className="rounded"
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete()
                    }}
                    title="删除"
                />
                <Button
                    icon={<FaPen size={14} />}
                    variant="ghost"
                    size="sm"
                    className="rounded"
                    onClick={(e) => {
                        e.stopPropagation()
                        const newTitle = prompt('编辑聊天标题', chat.title)
                        if (newTitle !== null && newTitle.trim() !== '') {
                            onEdit(newTitle.trim())
                        }
                    }}
                    title="编辑"
                />
            </div>
        </li>
    )
}
