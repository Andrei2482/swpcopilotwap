import { useState, useCallback, useEffect } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { ChatView } from '@/components/ChatView'
import { ChatInput } from '@/components/ChatInput'
import { ReportModal } from '@/components/ReportModal'
import type { Chat, Message } from '@/types'

/* ── Demo responses ─────────────────────────────────────────────────────── */
const RESPONSES = [
    "The fire sword is obtained by defeating the Fire Drake in the Volcanic Depths. Equip the Knight's Plate armor first — it reduces fire damage by 40%.",
    "I'd recommend **Swordigo Enhanced** for quality-of-life improvements: it adds a mini-map, reworked AI, and balance tweaks without altering the core experience.",
    "Secret areas include: the Hidden Crypt below the Ancient City, the Sky Fortress via the northern mountains, and the Sunken Temple (Waterbreathing pendant required).",
    "For the final boss, keep mana high for heals and use the Holy Sword. During phase 3, focus the shadow clone with the **red aura** — that's always the real one.",
    "SwordigoPlus provides a full modding SDK: Lua scripts, custom enemies, items, and entirely new areas. Check the developer portal for docs.",
]
let respIdx = 0
const nextResponse = () => RESPONSES[respIdx++ % RESPONSES.length]

/* ── Utilities ──────────────────────────────────────────────────────────── */
function uid() { return Math.random().toString(36).slice(2, 10) }

function makeSeedChats(): Chat[] {
    const now = Date.now()
    return [
        { id: uid(), title: 'How to get the fire sword?', messages: [], createdAt: now - 5 * 60_000, group: 'today' },
        { id: uid(), title: 'Best mods for Swordigo?', messages: [], createdAt: now - 90_000_000, group: 'yesterday' },
        { id: uid(), title: 'Secret areas guide', messages: [], createdAt: now - 3 * 86_400_000, group: 'older' },
    ]
}

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function CopilotPage() {
    const [chats, setChats] = useState<Chat[]>(makeSeedChats)
    const [activeChatId, setActiveChatId] = useState<string | null>(null)
    const [isTyping, setIsTyping] = useState(false)
    const [reportMsgId, setReportMsgId] = useState<string | null>(null)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    const activeChat = chats.find((c) => c.id === activeChatId) ?? null
    const messages = activeChat?.messages ?? []

    /* ── New chat ─────────────────────────────────────────────────────── */
    const handleNewChat = useCallback(() => {
        const id = uid()
        setChats((prev) => [{ id, title: 'New chat', messages: [], createdAt: Date.now(), group: 'today' }, ...prev])
        setActiveChatId(id)
    }, [])

    /* ── Delete ───────────────────────────────────────────────────────── */
    const handleDeleteChat = useCallback((id: string) => {
        setChats((prev) => prev.filter((c) => c.id !== id))
        setActiveChatId((prev) => (prev === id ? null : prev))
    }, [])

    /* ── Send ─────────────────────────────────────────────────────────── */
    const handleSend = useCallback(async (content: string) => {
        let chatId = activeChatId
        if (!chatId) {
            chatId = uid()
            const title = content.slice(0, 42) + (content.length > 42 ? '…' : '')
            setChats((prev) => [{ id: chatId!, title, messages: [], createdAt: Date.now(), group: 'today' }, ...prev])
            setActiveChatId(chatId)
        }

        const userMsg: Message = { id: uid(), role: 'user', content, timestamp: Date.now() }
        setChats((prev) => prev.map((c) => c.id === chatId
            ? {
                ...c,
                title: c.title === 'New chat' ? content.slice(0, 42) + (content.length > 42 ? '…' : '') : c.title,
                messages: [...c.messages, userMsg],
            } : c
        ))

        setIsTyping(true)
        await new Promise((r) => setTimeout(r, 1000 + Math.random() * 700))

        const aiContent = nextResponse()
        const aiMsg: Message = {
            id: uid(),
            role: 'assistant',
            content: aiContent,
            variants: [aiContent],
            activeVariant: 0,
            timestamp: Date.now(),
        }
        setIsTyping(false)
        setChats((prev) => prev.map((c) => c.id === chatId ? { ...c, messages: [...c.messages, aiMsg] } : c))
    }, [activeChatId])

    /* ── Regenerate (adds new variant) ─── */
    const handleRegen = useCallback((msgId: string, mode: string) => {
        if (!activeChatId) return
        setIsTyping(true)
        setTimeout(() => {
            const label = mode.charAt(0).toUpperCase() + mode.slice(1)
            const base = nextResponse()
            const newVariant = `[${label}] ${base}`
            setIsTyping(false)
            setChats((prev) => prev.map((c) => {
                if (c.id !== activeChatId) return c
                return {
                    ...c,
                    messages: c.messages.map((m) => {
                        if (m.id !== msgId) return m
                        const variants = [...(m.variants ?? [m.content]), newVariant]
                        return { ...m, variants, activeVariant: variants.length - 1, content: newVariant }
                    }),
                }
            }))
        }, 700 + Math.random() * 500)
    }, [activeChatId])

    /* ── Variant switch ───────────────────────────────────────────────── */
    const handleVariantChange = useCallback((msgId: string, index: number) => {
        setChats((prev) => prev.map((c) => ({
            ...c,
            messages: c.messages.map((m) => {
                if (m.id !== msgId) return m
                const clamped = Math.max(0, Math.min(index, (m.variants?.length ?? 1) - 1))
                return { ...m, activeVariant: clamped, content: m.variants?.[clamped] ?? m.content }
            }),
        })))
    }, [])

    /* ── Keyboard shortcuts ───────────────────────────────────────────── */
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') { e.preventDefault(); handleNewChat() }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [handleNewChat])

    return (
        <TooltipProvider>
            <div className="h-full flex flex-col overflow-hidden bg-background" aria-label="SwordigoPlus Copilot">
                <Topbar onToggleSidebar={() => setSidebarCollapsed((v) => !v)} sidebarCollapsed={sidebarCollapsed} />

                <div className="flex flex-1 overflow-hidden">
                    <Sidebar
                        chats={chats}
                        activeChatId={activeChatId}
                        onSelectChat={setActiveChatId}
                        onNewChat={handleNewChat}
                        onDeleteChat={handleDeleteChat}
                        isCollapsed={sidebarCollapsed}
                    />

                    <main className="relative flex flex-col flex-1 overflow-hidden" aria-label="Chat">
                        {/* Ambient blobs */}
                        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                            <div className="absolute -top-1/3 right-0 h-[70vmax] w-[70vmax] rounded-full bg-primary/4 blur-[120px] animate-blob-1" />
                            <div className="absolute -bottom-1/3 left-0 h-[55vmax] w-[55vmax] rounded-full bg-primary/3 blur-[140px] animate-blob-2" />
                        </div>

                        <ChatView
                            messages={messages}
                            isTyping={isTyping}
                            onReport={(id) => setReportMsgId(id)}
                            onRegen={handleRegen}
                            onVariantChange={handleVariantChange}
                            onSuggest={handleSend}
                        />

                        <ChatInput onSend={handleSend} disabled={isTyping} />
                    </main>
                </div>

                <ReportModal
                    open={reportMsgId !== null}
                    onClose={() => setReportMsgId(null)}
                    onSubmit={() => setReportMsgId(null)}
                />
            </div>
        </TooltipProvider>
    )
}
