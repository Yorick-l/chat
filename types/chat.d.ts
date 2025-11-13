export interface Chat { 
    id: string
    title: string
    createdAt: Date
    updatedAt: Date
    messages: Message[]
}

export interface Message {
    id: string
    content: string
    role: 'user' | 'assistant'
    chatId: string
}

export interface ChatRequest {
    messages: Message[]
    model: string
}
