import { useState, useCallback, useEffect } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { ChatView } from '@/components/ChatView'
import { ChatInput } from '@/components/ChatInput'
import { ReportModal } from '@/components/ReportModal'
import type { Chat, Message } from '@/types'

/* ── Fake responses for demo ─────────────────────────────────────────────── */
const FAKE_RESPONSES = [
    "The fire sword is obtained by defeating the Fire Drake in the Volcanic Depths. You'll need the Knight's Plate armor before attempting this fight — it reduces fire damage by 40%.",
    "I'd recommend starting with the **Swordigo Enhanced** mod for quality-of-life improvements. It adds a mini-map, reworked enemy AI, and balance tweaks without altering the core feel of the game.",
    "The secret areas include: the Hidden Crypt below the Ancient City, the Sky Fortress accessible via the northern mountains, and the Sunken Temple reachable with the Waterbreathing pendant.",
    "For the final boss, use the Holy Sword and keep your mana high for healing. The key is to dodge his third-phase shadow clones — focus on the one with the red aura, that's always the real one.",
    "Great question! Swordigo Plus provides a full modding SDK so you can extend the game with Lua scripts, custom enemies, items, and even entirely new areas.",
]

let fakeIdx = 0
function nextFakeResponse(): string {
    const r = FAKE_RESPONSES[fakeIdx % FAKE_RESPONSES.length]
    fakeIdx++
    return r
}

/* ── Utilities ─────────────────────────────────────────────────────────────── */
function uid(): string {
    return Math.random().toString(36).slice(2, 10)
}



/* ── Seed chats (demo) ────────────────────────────────────────────────────── */
function makeSeedChats(): Chat[] {
    const now = Date.now()
    return [
        {
            id: uid(),
            title: 'How to get the fire sword?',
            messages: [],
            createdAt: now - 1_000 * 60 * 5,
            group: 'today',
        },
        {
            id: uid(),
            title: 'Best mods for Swordigo?',
            messages: [],
            createdAt: now - 86_400_000 - 3_600_000,
            group: 'yesterday',
        },
        {
            id: uid(),
            title: 'Secret areas guide',
            messages: [],
            createdAt: now - 3 * 86_400_000,
            group: 'older',
        },
    ]
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function CopilotPage() {
    const [chats, setChats] = useState<Chat[]>(makeSeedChats)
    const [activeChatId, setActiveChatId] = useState<string | null>(null)
    const [isTyping, setIsTyping] = useState(false)
    const [reportMsgId, setReportMsgId] = useState<string | null>(null)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    const activeChat = chats.find((c) => c.id === activeChatId) ?? null
    const messages = activeChat?.messages ?? []

    /* Create a new chat and activate it */
    const handleNewChat = useCallback(() => {
        const id = uid()
        const newChat: Chat = {
            id,
            title: 'New chat',
            messages: [],
            createdAt: Date.now(),
            group: 'today',
        }
        setChats((prev) => [newChat, ...prev])
        setActiveChatId(id)
    }, [])

    /* Delete a chat */
    const handleDeleteChat = useCallback((id: string) => {
        setChats((prev) => prev.filter((c) => c.id !== id))
        setActiveChatId((prev) => (prev === id ? null : prev))
    }, [])

    /* Send a message */
    const handleSend = useCallback(async (content: string) => {
        let chatId = activeChatId

        // Create chat on first message
        if (!chatId) {
            chatId = uid()
            const newChat: Chat = {
                id: chatId,
                title: content.slice(0, 40) + (content.length > 40 ? '…' : ''),
                messages: [],
                createdAt: Date.now(),
                group: 'today',
            }
            setChats((prev) => [newChat, ...prev])
            setActiveChatId(chatId)
        }

        const userMsg: Message = {
            id: uid(),
            role: 'user',
            content,
            timestamp: Date.now(),
        }

        // Update title from first message
        setChats((prev) =>
            prev.map((c) =>
                c.id === chatId
                    ? {
                        ...c,
                        title: c.title === 'New chat'
                            ? content.slice(0, 40) + (content.length > 40 ? '…' : '')
                            : c.title,
                        messages: [...c.messages, userMsg],
                    }
                    : c
            )
        )

        // Show typing indicator
        setIsTyping(true)

        await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800))

        const aiMsg: Message = {
            id: uid(),
            role: 'assistant',
            content: nextFakeResponse(),
            timestamp: Date.now(),
        }

        setIsTyping(false)
        setChats((prev) =>
            prev.map((c) =>
                c.id === chatId
                    ? { ...c, messages: [...c.messages, aiMsg] }
                    : c
            )
        )
    }, [activeChatId])

    /* Regenerate (mock) */
    const handleRegen = useCallback((_msgId: string, _mode: string) => {
        if (!activeChatId) return
        setIsTyping(true)
        setTimeout(() => {
            const aiMsg: Message = {
                id: uid(),
                role: 'assistant',
                content: nextFakeResponse(),
                timestamp: Date.now(),
            }
            setIsTyping(false)
            setChats((prev) =>
                prev.map((c) =>
                    c.id === activeChatId
                        ? { ...c, messages: [...c.messages, aiMsg] }
                        : c
                )
            )
        }, 1100)
    }, [activeChatId])

    /* Keyboard shortcut — Ctrl/Cmd+N for new chat */
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault()
                handleNewChat()
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [handleNewChat])

    return (
        <TooltipProvider>
            <div className="h-full flex flex-col overflow-hidden bg-background">
                {/* Topbar */}
                <Topbar
                    onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
                    sidebarCollapsed={sidebarCollapsed}
                />

                {/* Body */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <Sidebar
                        chats={chats}
                        activeChatId={activeChatId}
                        onSelectChat={setActiveChatId}
                        onNewChat={handleNewChat}
                        onDeleteChat={handleDeleteChat}
                        isCollapsed={sidebarCollapsed}
                    />

                    {/* Chat area */}
                    <main className="flex flex-col flex-1 overflow-hidden relative" aria-label="Copilot chat">
                        {/* Ambient background blobs — subtle */}
                        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                            <div className="absolute -top-1/4 right-0 h-[60vmax] w-[60vmax] rounded-full bg-primary/5 blur-[100px] motion-safe:animate-blob-1" />
                            <div className="absolute -bottom-1/4 left-0 h-[50vmax] w-[50vmax] rounded-full bg-accent/4 blur-[120px] motion-safe:animate-blob-2" />
                        </div>

                        <ChatView
                            messages={messages}
                            isTyping={isTyping}
                            onReport={(id) => setReportMsgId(id)}
                            onRegen={handleRegen}
                        />

                        <ChatInput
                            onSend={handleSend}
                            disabled={isTyping}
                        />
                    </main>
                </div>

                {/* Report modal */}
                <ReportModal
                    open={reportMsgId !== null}
                    onClose={() => setReportMsgId(null)}
                    onSubmit={(_reason, _details) => {
                        // TODO: send to backend
                        setReportMsgId(null)
                    }}
                />
            </div>
        </TooltipProvider>
    )
}
