import { useState, useRef, useCallback, useEffect, type MouseEvent } from 'react'
import { Plus, MessageSquare, Trash2, Search, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Chat } from '@/types'

const MIN_W = 200
const MAX_W = 360
const DEFAULT_W = 252
const COLLAPSED_W = 56

interface SidebarProps {
    chats: Chat[]
    activeChatId: string | null
    onSelectChat: (id: string) => void
    onNewChat: () => void
    onDeleteChat: (id: string) => void
    isCollapsed: boolean
}

export function Sidebar({
    chats, activeChatId, onSelectChat, onNewChat, onDeleteChat, isCollapsed
}: SidebarProps) {
    const [width, setWidth] = useState(DEFAULT_W)
    const [search, setSearch] = useState('')
    const [deleteTarget, setDeleteTarget] = useState<Chat | null>(null)
    const dragging = useRef(false)
    const startX = useRef(0)
    const startW = useRef(DEFAULT_W)

    /* ─────────────────────────────────────────────────────────────────
       Resize — document-level listeners so fast drags don't lose capture
    ───────────────────────────────────────────────────────────────── */
    const onHandleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
        if (isCollapsed) return
        e.preventDefault()
        dragging.current = true
        startX.current = e.clientX
        startW.current = width
    }, [isCollapsed, width])

    useEffect(() => {
        function onMouseMove(e: globalThis.MouseEvent) {
            if (!dragging.current) return
            const next = startW.current + (e.clientX - startX.current)
            setWidth(Math.min(MAX_W, Math.max(MIN_W, next)))
        }
        function onMouseUp() { dragging.current = false }
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
        return () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
        }
    }, [])

    /* ─────────────────────────────────────────────────────────────────
       Filtering
    ───────────────────────────────────────────────────────────────── */
    const q = search.trim().toLowerCase()
    const filtered = q ? chats.filter(c => c.title.toLowerCase().includes(q)) : chats
    const groups = [
        { label: 'Today', items: filtered.filter(c => c.group === 'today') },
        { label: 'Yesterday', items: filtered.filter(c => c.group === 'yesterday') },
        { label: 'Older', items: filtered.filter(c => c.group === 'older') },
    ]

    /* ─────────────────────────────────────────────────────────────────
       Chat row
    ───────────────────────────────────────────────────────────────── */
    function ChatRow({ chat }: { chat: Chat }) {
        const isActive = chat.id === activeChatId
        return (
            <div className="group relative px-2 mb-0.5">
                <button
                    type="button"
                    onClick={() => onSelectChat(chat.id)}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={chat.title}
                    className={cn(
                        'w-full flex items-center gap-2.5 rounded-xl transition-all duration-200',
                        'text-left text-[13px] outline-none select-none',
                        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
                        isCollapsed
                            ? 'justify-center p-2'
                            : 'pl-3 pr-9 py-2',
                        isActive
                            ? 'bg-primary/12 text-foreground border border-primary/20 shadow-sm'
                            : 'border border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40'
                    )}
                >
                    <MessageSquare
                        className={cn(
                            'shrink-0 transition-colors duration-200',
                            isCollapsed ? 'h-[18px] w-[18px]' : 'h-[14px] w-[14px]',
                            isActive ? 'text-primary' : 'text-muted-foreground/50'
                        )}
                        aria-hidden="true"
                    />
                    {!isCollapsed && (
                        <span
                            className="truncate leading-snug min-w-0"
                            style={{ maxWidth: `${width - 88}px` }}
                        >
                            {chat.title}
                        </span>
                    )}
                </button>

                {!isCollapsed && (
                    <button
                        type="button"
                        onClick={(e: MouseEvent) => {
                            e.stopPropagation()
                            setDeleteTarget(chat)
                        }}
                        aria-label={`Delete "${chat.title}"`}
                        className={cn(
                            'absolute right-3.5 top-1/2 -translate-y-1/2',
                            'flex h-6 w-6 items-center justify-center rounded-lg',
                            'opacity-0 group-hover:opacity-100',
                            'text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10',
                            'transition-all duration-150',
                            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:opacity-100'
                        )}
                    >
                        <Trash2 className="h-3 w-3" aria-hidden="true" />
                    </button>
                )}
            </div>
        )
    }

    return (
        <>
            <aside
                id="sidebar"
                className="relative flex flex-col h-full shrink-0 overflow-hidden"
                style={{
                    width: isCollapsed ? COLLAPSED_W : width,
                    borderRight: '1px solid hsl(var(--border) / 0.4)',
                    background: 'hsl(var(--sidebar))',
                    transition: isCollapsed
                        ? 'width 220ms cubic-bezier(0.4,0,0.2,1)'
                        : 'none',
                }}
                aria-label="Chat history"
                role="navigation"
            >
                {/* ── Organic gradient accent ── */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.035]"
                    aria-hidden="true"
                    style={{
                        background: 'radial-gradient(ellipse 80% 40% at 50% 0%, hsl(var(--primary)), transparent)',
                    }}
                />

                {/* ── Header ── */}
                <div className={cn(
                    'flex items-center gap-2 shrink-0 px-3 pt-3 pb-2',
                    isCollapsed && 'flex-col gap-1.5 px-2'
                )}>
                    {!isCollapsed && (
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="h-6 w-6 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                                <Sparkles className="h-3 w-3 text-primary" aria-hidden="true" />
                            </div>
                            <span className="text-[13px] font-semibold tracking-tight text-foreground truncate">Chats</span>
                        </div>
                    )}

                    <Tooltip delayDuration={isCollapsed ? 300 : 9999}>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                onClick={onNewChat}
                                aria-label="New chat (Ctrl+N)"
                                className={cn(
                                    'flex items-center justify-center rounded-xl transition-all duration-150',
                                    'text-muted-foreground hover:text-foreground',
                                    'hover:bg-muted/50 active:scale-90',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                                    isCollapsed ? 'h-9 w-9 border border-border/40' : 'h-7 w-7'
                                )}
                            >
                                <Plus className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side={isCollapsed ? 'right' : 'bottom'} sideOffset={8}>
                            New chat <kbd className="ml-1 rounded border border-border/50 px-1 text-[10px]">⌘N</kbd>
                        </TooltipContent>
                    </Tooltip>
                </div>

                {/* ── Search ── */}
                {!isCollapsed && (
                    <div className="px-3 pb-2 shrink-0">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/35 pointer-events-none" aria-hidden="true" />
                            <input
                                type="search"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search…"
                                aria-label="Search chats"
                                aria-controls="sidebar-chat-list"
                                className={cn(
                                    'w-full rounded-xl border border-border/30 bg-muted/20',
                                    'pl-8 pr-3 py-1.5 text-[12px] text-foreground placeholder:text-muted-foreground/30',
                                    'focus:outline-none focus:border-primary/30 focus:bg-muted/30 transition-all duration-150'
                                )}
                            />
                        </div>
                    </div>
                )}

                <div className="mx-3 h-px bg-border/30 shrink-0" aria-hidden="true" />

                {/* ── Chat list ── */}
                <ScrollArea id="sidebar-chat-list" className="flex-1 py-2" aria-label="Conversations">
                    {filtered.length === 0 && !isCollapsed && (
                        <p className="px-4 py-10 text-center text-[12px] text-muted-foreground/35 select-none leading-relaxed whitespace-pre-line">
                            {search ? 'Nothing found.' : 'No chats yet.\nStart a new conversation.'}
                        </p>
                    )}
                    {groups.map(({ label, items }) =>
                        items.length > 0 ? (
                            <div key={label} className="mb-2">
                                {!isCollapsed && (
                                    <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/30 select-none">
                                        {label}
                                    </p>
                                )}
                                {items.map(c => (
                                    <Tooltip key={c.id} delayDuration={isCollapsed ? 250 : 9999}>
                                        <TooltipTrigger asChild>
                                            <ChatRow chat={c} />
                                        </TooltipTrigger>
                                        {isCollapsed && (
                                            <TooltipContent side="right" sideOffset={8}>{c.title}</TooltipContent>
                                        )}
                                    </Tooltip>
                                ))}
                            </div>
                        ) : null
                    )}
                </ScrollArea>

                {/* ── Resize handle ── */}
                {!isCollapsed && (
                    <div
                        className="absolute right-0 inset-y-0 w-4 cursor-col-resize z-10 group/handle flex items-center justify-center select-none"
                        onMouseDown={onHandleMouseDown}
                        aria-hidden="true"
                        role="separator"
                        aria-orientation="vertical"
                    >
                        <div className="h-12 w-[3px] rounded-full bg-transparent group-hover/handle:bg-primary/25 transition-colors duration-200" />
                    </div>
                )}
            </aside>

            {/* ── Delete confirm ── */}
            <AlertDialog open={deleteTarget !== null} onOpenChange={o => !o && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete chat?</AlertDialogTitle>
                        <AlertDialogDescription>
                            "<strong className="text-foreground">{deleteTarget?.title}</strong>" will be permanently deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            if (deleteTarget) { onDeleteChat(deleteTarget.id); setDeleteTarget(null) }
                        }}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
