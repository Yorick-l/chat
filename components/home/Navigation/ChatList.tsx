import { useState, useMemo } from 'react'
import { Chat } from '@/types/chat'
import { useRef, useEffect } from 'react'
import { groupChatsByTime, GROUPED_CHATS_LABELS, GroupedChats } from './utils'
import ChatItem from './ChatItem'
import { useEventBus, useAppStore } from '@/stores'

export default function ChatList() {
    const [chats, setChats] = useState<Chat[]>()
    const pageRef = useRef<number>(1)
    const { subscribe, unsubscribe } = useEventBus()
    const { setSelectedChat, selectedChat } = useAppStore()

    const loadMoreRef = useRef(null)
    const hasMoreRef = useRef(false)
    const loadingRef = useRef(false)


    const getData = async () => {
        if (loadingRef.current) {
            return
        }
        loadingRef.current = true
        const response = await fetch(`/api/chat/list?page=${pageRef.current}`)

        if (!response.ok) {
            console.error('Failed to get chat list')
            loadingRef.current = false
            return
        }
        const { data } = await response.json()
        hasMoreRef.current = data.hasMore
        if (pageRef.current === 1) {
            setChats(data.list)
        } else {
            setChats((list) => [...(list || []), ...data.list])
        }
        pageRef.current++
        loadingRef.current = false
    }

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        const callback: EventListener = (data) => {
            pageRef.current = 1
            getData()
        }
        subscribe('fetchChatList', callback)
        return () => {
            unsubscribe('fetchChatList', callback)
        }
    }, [])


    useEffect(() => {
        let observer: IntersectionObserver | null = null
        // eslint-disable-next-line prefer-const
        let div = loadMoreRef.current
        if (div) {
            observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMoreRef.current) {
                    console.log('load more')
                    getData()
                }
            })
            observer.observe(div)
        }
        return () => {
            if (observer && div) {
                observer.unobserve(div)
            }
        }
    }, [])

    const groupedChats = useMemo(() => groupChatsByTime(chats || []), [chats])
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
                                <ChatItem selectedChat={selectedChat ?? null} key={chat.id} chat={chat}
                                    onSelect={setSelectedChat} />
                            ))}
                        </ul>
                    </div>
                ))}
                <div ref={loadMoreRef}>&nbsp;</div>
            </div>

        </div>
    )
}
