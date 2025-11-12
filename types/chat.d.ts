export interface Chat { 
    id: string
    title: string
    messages: Message[]
    createdAt: Date
    updatedAt: Date
}

export interface Message {
    id: string
    content: string
    role: 'user' | 'assistant'
    createdAt: Date
}

export interface ChatRequest {
    message: string
    currentModel: string
}
