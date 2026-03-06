export interface Message {
    id: string
    role: 'user' | 'assistant'
    /** Primary content — equals variants[activeVariant] for assistant, or raw text for user */
    content: string
    /** All generated variants (assistant only) */
    variants?: string[]
    /** Currently displayed variant index (0-based) */
    activeVariant?: number
    timestamp: number
}

export interface Chat {
    id: string
    title: string
    messages: Message[]
    createdAt: number
    group: 'today' | 'yesterday' | 'older'
}

export type AccentColor = 'purple' | 'blue' | 'green' | 'red' | 'pink' | 'yellow'
export type Theme = 'dark' | 'light' | 'system'

export interface AppSettings {
    theme: Theme
    accent: AccentColor
}
