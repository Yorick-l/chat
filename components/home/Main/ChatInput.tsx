import { cn } from '@/lib/utils'
import { useRef, useState, useEffect } from 'react'
import { IoIosSend } from 'react-icons/io'
import { PiStopBold } from 'react-icons/pi'
import { MdRefresh } from 'react-icons/md'
import TextareaAutosize from 'react-textarea-autosize'
import Button from '@/components/common/Button'
import { useAppStore, useEventBus } from '@/stores'
import { ChatRequest, Message } from '@/types/chat'
type ChatInputProps = {
    className?: string
}

export default function ChatInput({ className }: ChatInputProps) {
    const [messageText, setMessageText] = useState('')
    const stopRef = useRef<boolean>(false)
    const chatIdRef = useRef<string>('')

    const { addMessage, messageList, currentModel, updateMessage, setStreamId, removeMessage, streamId, selectedChat, setSelectedChat } = useAppStore()
    const { publish } = useEventBus()


    const createOrUpdateMessage = async (message: Message) => {
        const response = await fetch('/api/message/update', {
            method: 'POST',
            body: JSON.stringify(message),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            console.error('Failed to create or update message');
            return null;
        }
        const { data } = await response.json();
        if (!chatIdRef.current) {
            chatIdRef.current = data.message.chatId
            publish("fetchChatList")
            // setSelectedChat({ id: chatIdRef.current, ...data.message })
        }
        return data.message;
    }



    const sendMessage = async () => {
        const newMessage = await createOrUpdateMessage({
            id: '',
            content: messageText,
            role: 'user',
            chatId: chatIdRef.current,
        });

        addMessage(newMessage)
        const messages = [...messageList, newMessage];
        handleSend(messages)
    }

    const resend = async () => {
        const messages = [...messageList]

        if (messages.length !== 0 && messages[messages.length - 1].role === 'assistant') {
            const result = await deleteMessage(messages[messages.length - 1].id)
            if (!result) {
                console.log('delete failed')
                return
            }
            removeMessage(messages[messages.length - 1].id)
        }

        handleSend(messages)
    }

    const handleSend = async (messages: Message[]) => {
        stopRef.current = false
        const body: ChatRequest = {
            messages: messages,
            model: currentModel,
        };
        setMessageText('');
        const controller = new AbortController();

        const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller.signal,
        });


        if (!response.ok) {
            console.log(response.statusText)
            return
        }
        if (!response.body) {
            console.log("body error")
            return
        }

        const responseMessage: Message = await createOrUpdateMessage({
            id: "",
            role: "assistant",
            content: "",
            chatId: chatIdRef.current
        })

        addMessage(responseMessage)
        setStreamId(responseMessage.id)

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let content = ''
        let done = false
        while (!done) {

            if (stopRef.current) {
                controller.abort()
                break
            }
            const result = await reader.read()
            done = result.done
            const chunk = decoder.decode(result.value, { stream: true })
            content += chunk
            updateMessage(responseMessage.id, {
                ...responseMessage,
                content: content
            })
        }
        createOrUpdateMessage({
            ...responseMessage,
            content: content
        })
        setStreamId('')
    };


    const deleteMessage = async (id: string) => {
        const response = await fetch(`/api/message/delete?id=${id}`, {
            method: 'POST',
        });
        if (!response.ok) {
            console.error('Failed to delete message');
            return;
        }
        const { code } = await response.json();
        return code === 0;
    }

    const isDisabled = !!streamId || messageText.trim().length === 0


    useEffect(() => {
        if (selectedChat?.id === chatIdRef.current) {
            return
        }
        chatIdRef.current = selectedChat?.id ?? ''
        stopRef.current = true
    }, [selectedChat?.id])
    return (
        <div
            className={cn(
                "absolute bottom-0 left-0 right-0 z-50 pointer-events-none border-zinc-200/80 bg-white/90 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/80 w-full",
                className
            )}
        >
            <div className="pointer-events-auto w-full px-4 pb-3 sm:px-6 sm:pb-4 fixed bottom-0 left-0 right-0 z-50">
                <div className="flex justify-end mb-2">
                    {messageList.length !== 0 &&
                        streamId !== "" ? (
                        <Button
                            icon={<PiStopBold className="text-base" />}
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                                stopRef.current = true
                            }}
                            title="停止生成"
                            className="rounded shadow transition hover:bg-red-100 ml-2"
                        >
                            停止生成
                        </Button>
                    ) : <Button
                        icon={<MdRefresh className="text-base" />}
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            resend()
                        }}
                        title="重新生成"
                        className="rounded shadow transition hover:bg-violet-100"
                    >
                        重新生成
                    </Button>}

                </div>
                <div className="flex w-full items-end gap-3 rounded-2xl border border-zinc-200/80 bg-white/95 p-3 shadow-lg shadow-indigo-500/5 transition focus-within:border-indigo-400/80 focus-within:shadow-indigo-300/20 dark:border-zinc-800/70 dark:bg-zinc-900/80 dark:focus-within:border-indigo-400/50 dark:focus-within:shadow-indigo-400/10">
                    <TextareaAutosize
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        rows={1}
                        placeholder="输入一条消息..."
                        className="max-h-40 flex-1 resize-none rounded-xl bg-transparent px-3 py-2 text-sm leading-6 text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
                        disabled={!!streamId}
                    />
                    <div className="flex items-center gap-2">
                        {
                            <Button
                                icon={<IoIosSend className="text-base" />}
                                variant="primary"
                                size="md"
                                onClick={sendMessage}
                                disabled={isDisabled}
                                title="发送"
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
