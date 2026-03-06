import { useState, useRef, useCallback, useEffect, type MouseEvent } from 'react'
import { Plus, MessageSquare, Trash2, Search, Sparkles, ChevronRight } from 'lucide-react'
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

export function Sidebar({ chats, activeChatId, onSelectChat, onNewChat, onDeleteChat, isCollapsed }: SidebarProps) {
    const [width, setWidth] = useState(DEFAULT_W)
    const [search, setSearch] = useState('')
    const [deleteTarget, setDeleteTarget] = useState<Chat | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const dragging = useRef(false)
    const startX = useRef(0)
    const startW = useRef(DEFAULT_W)

    /* ── Resize (document-level — never loses capture) ─────────────── */
    const onHandleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
        if (isCollapsed) return
        e.preventDefault()
        dragging.current = true
        setIsDragging(true)
        startX.current = e.clientX
        startW.current = width
    }, [isCollapsed, width])

    useEffect(() => {
        function onMove(e: globalThis.MouseEvent) {
            if (!dragging.current) return
            const next = startW.current + (e.clientX - startX.current)
            setWidth(Math.min(MAX_W, Math.max(MIN_W, next)))
        }
        function onUp() {
            if (dragging.current) { dragging.current = false; setIsDragging(false) }
        }
        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', onUp)
        return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
    }, [])

    /* ── Filter ─────────────────────────────────────────────────────── */
    const q = search.trim().toLowerCase()
    const filtered = q ? chats.filter(c => c.title.toLowerCase().includes(q)) : chats
    const groups = [
        { label: 'Today', items: filtered.filter(c => c.group === 'today') },
        { label: 'Yesterday', items: filtered.filter(c => c.group === 'yesterday') },
        { label: 'Older', items: filtered.filter(c => c.group === 'older') },
    ]

    /* ── Chat row ───────────────────────────────────────────────────── */
    function ChatRow({ chat }: { chat: Chat }) {
        const isActive = chat.id === activeChatId
        return (
            <div className="group relative mx-2 mb-0.5 select-none">
                <button
                    type="button"
                    onClick={() => onSelectChat(chat.id)}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={chat.title}
                    className={cn(
                        'w-full flex items-center gap-2.5 rounded-xl',
                        'text-left text-[13px] leading-snug outline-none',
                        'transition-all duration-200 ease-out',
                        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
                        isCollapsed ? 'justify-center p-2.5' : 'pl-3 pr-9 py-2.5',
                        isActive
                            ? 'bg-primary/10 text-foreground border border-primary/20 shadow-[0_0_0_1px_hsl(var(--primary)/0.08),0_1px_4px_hsl(var(--primary)/0.08)]'
                            : 'border border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/35 hover:border-border/30'
                    )}
                >
                    <MessageSquare
                        className={cn(
                            'shrink-0 transition-colors duration-200',
                            isCollapsed ? 'h-[17px] w-[17px]' : 'h-[13px] w-[13px]',
                            isActive ? 'text-primary' : 'text-muted-foreground/45'
                        )}
                        aria-hidden="true"
                    />
                    {!isCollapsed && (
                        <span
                            className="truncate min-w-0"
                            style={{ maxWidth: width - 84 }}
                        >
                            {chat.title}
                        </span>
                    )}
                </button>

                {!isCollapsed && (
                    <button
                        type="button"
                        onClick={(e: MouseEvent) => { e.stopPropagation(); setDeleteTarget(chat) }}
                        aria-label={`Delete "${chat.title}"`}
                        className={cn(
                            'absolute right-3 top-1/2 -translate-y-1/2',
                            'flex h-6 w-6 items-center justify-center rounded-lg',
                            'opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100',
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
                className={cn(
                    'relative flex-col h-full shrink-0 overflow-hidden flex',
                    'transition-[width] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
                    isDragging && 'transition-none'
                )}
                style={{
                    width: isCollapsed ? COLLAPSED_W : width,
                    borderRight: '1px solid hsl(var(--border) / 0.35)',
                    background: 'hsl(var(--sidebar))',
                    cursor: isDragging ? 'col-resize' : undefined,
                }}
                aria-label="Chat history"
                role="navigation"
            >
                {/* Organic top-glow gradient */}
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-[0.06]"
                    aria-hidden="true"
                    style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 0%, hsl(var(--primary)), transparent)' }}
                />

                {/* ── Header ── */}
                <div className={cn(
                    'flex shrink-0 items-center gap-2 px-3 pt-3 pb-2',
                    isCollapsed && 'flex-col gap-2 px-2'
                )}>
                    {!isCollapsed && (
                        <div className="flex flex-1 min-w-0 items-center gap-2">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                                <Sparkles className="h-3 w-3 text-primary" aria-hidden="true" />
                            </div>
                            <span className="truncate text-[13px] font-semibold tracking-tight text-foreground">
                                Chats
                            </span>
                        </div>
                    )}

                    <Tooltip delayDuration={isCollapsed ? 200 : 9999}>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                onClick={onNewChat}
                                aria-label="New chat"
                                className={cn(
                                    'flex shrink-0 items-center justify-center rounded-xl',
                                    'text-muted-foreground hover:text-foreground',
                                    'hover:bg-muted/40 active:scale-90 active:bg-muted/60',
                                    'transition-all duration-150',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                                    isCollapsed ? 'h-9 w-9 border border-border/30' : 'h-7 w-7'
                                )}
                            >
                                <Plus className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side={isCollapsed ? 'right' : 'bottom'} sideOffset={8}>
                            New chat
                        </TooltipContent>
                    </Tooltip>
                </div>

                {/* ── Search ── */}
                {!isCollapsed && (
                    <div className="shrink-0 px-3 pb-2">
                        <div className="relative">
                            <Search
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/30 pointer-events-none"
                                aria-hidden="true"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search…"
                                aria-label="Search chats"
                                className={cn(
                                    'w-full rounded-xl border border-border/25 bg-muted/15',
                                    'pl-8 pr-3 py-1.5 text-[12px] text-foreground',
                                    'placeholder:text-muted-foreground/30',
                                    'focus:outline-none focus:border-primary/30 focus:bg-muted/25',
                                    'transition-all duration-150'
                                )}
                            />
                        </div>
                    </div>
                )}

                {/* Divider */}
                <div className="mx-3 h-px bg-border/20 shrink-0" aria-hidden="true" />

                {/* ── Chat list ── */}
                <ScrollArea className="flex-1 py-2">
                    {filtered.length === 0 && !isCollapsed ? (
                        <div className="px-4 py-12 text-center">
                            <p className="text-[12px] text-muted-foreground/40 leading-relaxed">
                                {search ? 'No matching chats.' : 'No chats yet.\nStart a conversation.'}
                            </p>
                        </div>
                    ) : (
                        groups.map(({ label, items }) => items.length > 0 && (
                            <div key={label} className="mb-3">
                                {!isCollapsed && (
                                    <p className="px-4 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/35 select-none">
                                        {label}
                                    </p>
                                )}
                                {items.map(c => (
                                    <Tooltip key={c.id} delayDuration={isCollapsed ? 200 : 9999}>
                                        <TooltipTrigger asChild>
                                            <ChatRow chat={c} />
                                        </TooltipTrigger>
                                        {isCollapsed && (
                                            <TooltipContent side="right" sideOffset={8}>{c.title}</TooltipContent>
                                        )}
                                    </Tooltip>
                                ))}
                            </div>
                        ))
                    )}
                </ScrollArea>

                {/* Expand hint when collapsed */}
                {isCollapsed && (
                    <div className="flex shrink-0 justify-center pb-3 pt-1 opacity-20">
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    </div>
                )}

                {/* ── Resize handle ── */}
                {!isCollapsed && (
                    <div
                        className="absolute right-0 inset-y-0 w-4 cursor-col-resize z-10 group/handle flex items-center justify-center"
                        onMouseDown={onHandleMouseDown}
                        aria-hidden="true"
                        role="separator"
                        aria-orientation="vertical"
                    >
                        <div className="h-16 w-[3px] rounded-full bg-transparent group-hover/handle:bg-primary/20 transition-colors duration-200" />
                    </div>
                )}
            </aside>

            {/* ── Delete confirm modal ── */}
            <AlertDialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span className="font-medium text-foreground">"{deleteTarget?.title}"</span> will be permanently removed. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { if (deleteTarget) { onDeleteChat(deleteTarget.id); setDeleteTarget(null) } }}>
                            Delete chat
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
