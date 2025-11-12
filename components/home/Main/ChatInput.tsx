import { cn } from '@/lib/utils'
import { useRef, useState } from 'react'
import { IoIosSend } from 'react-icons/io'
import TextareaAutosize from 'react-textarea-autosize'
import Button from '@/components/common/Button'
import { useAppStore } from '@/stores'
import { ChatRequest, Message } from '@/types/chat'
import { v4 as uuidv4 } from 'uuid'
type ChatInputProps = {
    className?: string
}

export default function ChatInput({ className }: ChatInputProps) {
    const [messageText, setMessageText] = useState('')
    const [showRegenerate, setShowRegenerate] = useState(false)
    const stopRef = useRef<boolean>(false)
    // 使用Ref安全地存储AbortController以便后续handlePause调用
    const abortControllerRef = useRef<AbortController | null>(null);
    const { addMessage, messageList, currentModel, updateMessage, setStreamId, removeMessage, streamId } = useAppStore()

    const sendMessage = () => {
        // 开始新的发送时，隐藏重新生成按钮
        setShowRegenerate(false)
        const id = uuidv4()
        const newMessage: Message = {
            id,
            content: messageText,
            role: 'user',
            createdAt: new Date(),
        }
        addMessage(newMessage)
        handleSend()
    }

    const resetSend = () => {
        // 找到最后一个 assistant 消息并删除
        const lastAssistantMessage = [...messageList].reverse().find(msg => msg.role === 'assistant')
        if (lastAssistantMessage) {
            removeMessage(lastAssistantMessage.id)
            setShowRegenerate(false)
            // 找到对应的 user 消息（在 assistant 消息之前的最后一个 user 消息）
            const assistantIndex = messageList.findIndex(msg => msg.id === lastAssistantMessage.id)
            const lastUserMessage = messageList
                .slice(0, assistantIndex)
                .reverse()
                .find(msg => msg.role === 'user')
            if (lastUserMessage) {
                setMessageText(lastUserMessage.content)
                // 重新发送，但需要过滤掉已删除的 assistant 消息
                handleSend()
            }
        }
    }

    const handleSend = async () => {
        if (!streamId) {
            console.log('send')
            // 发送消息后，进入流式传输状态
            const newStreamId = uuidv4();
            setStreamId(newStreamId);
            setShowRegenerate(false);
            stopRef.current = false;
            const body: ChatRequest = {
                message: messageText,
                currentModel: currentModel,
            };
            console.log(body, 'body');

            

            try {
                const controller = new AbortController();
                abortControllerRef.current = controller; // 记录controller供handlePause访问

                const response = await fetch('/api/chat', {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    console.error('Failed to send message');
                    setStreamId('');
                    setShowRegenerate(false);
                    abortControllerRef.current = null;
                    return;
                }

                if (!response.body) {
                    console.error('No body in response');
                    setStreamId('');
                    setShowRegenerate(false);
                    abortControllerRef.current = null;
                    return;
                }

                const responseMessageId = uuidv4();
                const responseMessage: Message = {
                    id: responseMessageId,
                    content: '',
                    role: 'assistant',
                    createdAt: new Date(),
                };

                addMessage(responseMessage);

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let result = '';
                let done = false;

                // 用于每次流式渲染时判断是否中止
                while (!done && !stopRef.current && controller.signal.aborted === false) {
                    const { done: isDone, value } = await reader.read();
                    done = isDone;
                    if (done || stopRef.current || controller.signal.aborted) break;
                    result += decoder.decode(value, { stream: true });
                    updateMessage(responseMessageId, { ...responseMessage, content: result });
                    setStreamId(responseMessageId);
                }

                // 如果是手动停止流式传输
                if (stopRef.current && abortControllerRef.current) {
                    try {
                        abortControllerRef.current.abort();
                    } catch {}
                }

                // 停止后立刻清空 streamId，从而立即在页面上隐藏流式输出
                setMessageText('');
                setStreamId('');
                stopRef.current = false;
                abortControllerRef.current = null;
                setShowRegenerate(true);
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    console.log('Stream aborted by user');
                } else {
                    console.error('Error in streaming:', err);
                }
                setStreamId('');
                stopRef.current = false;
                setShowRegenerate(true);
            }
        }
    };

    const handlePause = () => {
        // 停止流式传输
        stopRef.current = true
        // 停止流式输出后，立即隐藏输入框交互
        setStreamId('pausing') // 标记正在暂停（不会等到流结束才隐藏按钮）
        // 停止后也显示重新生成按钮
        setShowRegenerate(true)
        setTimeout(() => {
            setStreamId('') // 稍后才真正恢复交互
        }, 400) // 延迟防止残留流式输出
    }

    const isDisabled = !!streamId || messageText.trim().length === 0
    return (
        <div
            className={cn(
                "absolute bottom-0 left-0 right-0 z-50 pointer-events-none border-zinc-200/80 bg-white/90 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/80 w-full",
                className
            )}
        >
            <div className="pointer-events-auto w-full px-4 pb-3 sm:px-6 sm:pb-4 fixed bottom-0 left-0 right-0 z-50">
                <div className="flex justify-end mb-2">
                    {streamId && (
                        <Button
                            icon={<IoIosSend className="text-base" />}
                            variant="secondary"
                            size="sm"
                            onClick={handlePause}
                            title="停止生成"
                            disabled={!!streamId}
                            className="rounded shadow transition hover:bg-red-100 ml-2"
                        >
                            停止生成
                        </Button>
                    )}
                    {/* {isStreaming ? (
                        <Button
                            icon={<span className="text-base">⏹️</span>}
                            variant="secondary"
                            size="sm"
                            onClick={handlePause}
                            title="停止生成"
                            disabled={!isStreaming}
                            className="rounded shadow transition hover:bg-red-100 ml-2"
                        >
                            停止生成
                        </Button>
                    ) : (
                        (showRegenerate && (
                            <Button
                                icon={<IoIosSend className="text-base" />}
                                variant="secondary"
                                size="sm"
                                onClick={resetSend}
                                title="重新生成"
                                className="rounded shadow transition hover:bg-violet-100"
                            >
                                重新生成
                            </Button>
                        ))
                    )} */}

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
