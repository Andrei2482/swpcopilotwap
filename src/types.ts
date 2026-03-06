/** Shared types for the Copilot app */

export interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: number
}

export interface Chat {
    id: string
    title: string
    messages: Message[]
    createdAt: number
    /** Grouping label for the sidebar */
    group: 'today' | 'yesterday' | 'older'
}

export type AccentColor = 'default' | 'green' | 'red' | 'blue' | 'yellow' | 'pink'
export type Theme = 'dark' | 'light'

export interface CopilotSettings {
    theme: Theme
    accentColor: AccentColor
    enableHistory: boolean
}
