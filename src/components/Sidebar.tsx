import { useState, useRef, useCallback, type PointerEvent, type MouseEvent } from 'react'
import { Plus, MessageSquare, Trash2, Search, GripVertical, Sparkles } from 'lucide-react'
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

const MIN_W = 196
const MAX_W = 360
const DEFAULT_W = 256
const COLLAPSED_W = 60

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
    const dragging = useRef(false)
    const startX = useRef(0)
    const startW = useRef(DEFAULT_W)

    /* ── Resize ──────────────────────────────────────────────────────── */
    const onPointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
        if (isCollapsed) return
        dragging.current = true
        startX.current = e.clientX
        startW.current = width;
        (e.target as HTMLElement).setPointerCapture(e.pointerId)
    }, [isCollapsed, width])

    const onPointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
        if (!dragging.current) return
        setWidth(Math.min(MAX_W, Math.max(MIN_W, startW.current + e.clientX - startX.current)))
    }, [])

    const onPointerUp = useCallback(() => { dragging.current = false }, [])

    /* ── Filtering ───────────────────────────────────────────────────── */
    const filter = search.trim().toLowerCase()
    const filtered = filter ? chats.filter((c) => c.title.toLowerCase().includes(filter)) : chats

    const today = filtered.filter((c) => c.group === 'today')
    const yesterday = filtered.filter((c) => c.group === 'yesterday')
    const older = filtered.filter((c) => c.group === 'older')

    /* ── Chat row ────────────────────────────────────────────────────── */
    function ChatRow({ chat }: { chat: Chat }) {
        const isActive = activeChatId === chat.id
        return (
            <Tooltip delayDuration={isCollapsed ? 200 : 99999}>
                <TooltipTrigger asChild>
                    <div className="group relative mx-2 mb-0.5">
                        {/* Main button */}
                        <button
                            type="button"
                            onClick={() => onSelectChat(chat.id)}
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={chat.title}
                            className={cn(
                                'w-full flex items-center gap-3 rounded-xl transition-all duration-150',
                                'text-left text-[13px] outline-none select-none',
                                'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar',
                                isCollapsed ? 'justify-center p-2.5' : 'pl-3 pr-9 py-2.5',
                                isActive
                                    ? 'bg-[hsl(var(--primary)/0.12)] text-foreground border border-[hsl(var(--primary)/0.2)] shadow-[0_0_12px_hsl(var(--primary)/0.08)]'
                                    : 'border border-transparent text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--muted)/0.5)]'
                            )}
                        >
                            <MessageSquare className={cn('shrink-0 transition-colors', isCollapsed ? 'h-4 w-4' : 'h-3.5 w-3.5',
                                isActive ? 'text-primary' : 'text-muted-foreground/60')} aria-hidden="true" />
                            {!isCollapsed && (
                                <span className="truncate leading-snug">{chat.title}</span>
                            )}
                        </button>

                        {/* Delete — shown on hover, safely padded to avoid text overlap */}
                        {!isCollapsed && (
                            <button
                                type="button"
                                onClick={(e: MouseEvent) => { e.stopPropagation(); setDeleteTarget(chat) }}
                                aria-label={`Delete "${chat.title}"`}
                                className={cn(
                                    'absolute right-2 top-1/2 -translate-y-1/2',
                                    'flex h-6 w-6 items-center justify-center rounded-lg',
                                    'opacity-0 group-hover:opacity-100',
                                    'text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10',
                                    'transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                                )}
                            >
                                <Trash2 className="h-3 w-3" aria-hidden="true" />
                            </button>
                        )}
                    </div>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right" sideOffset={8}>{chat.title}</TooltipContent>}
            </Tooltip>
        )
    }

    function Group({ label, items }: { label: string; items: Chat[] }) {
        if (items.length === 0) return null
        return (
            <div className="mb-2">
                {!isCollapsed && (
                    <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 select-none">
                        {label}
                    </p>
                )}
                {items.map((c) => <ChatRow key={c.id} chat={c} />)}
            </div>
        )
    }

    return (
        <>
            {/* Sidebar panel */}
            <aside
                className="relative flex flex-col h-full shrink-0 bg-sidebar select-none overflow-hidden"
                style={{
                    width: isCollapsed ? COLLAPSED_W : width,
                    borderRight: '1px solid hsl(var(--border) / 0.5)',
                    transition: 'width 200ms cubic-bezier(0.4,0,0.2,1)',
                }}
                aria-label="Chat history"
                role="navigation"
            >
                {/* Header */}
                <div className={cn('flex items-center gap-2 px-3 pt-3 pb-2', isCollapsed && 'justify-center px-2')}>
                    {!isCollapsed && (
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="h-6 w-6 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                            </div>
                            <span className="text-sm font-semibold text-foreground tracking-tight truncate">Chats</span>
                        </div>
                    )}
                    <Tooltip delayDuration={isCollapsed ? 200 : 99999}>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                onClick={onNewChat}
                                aria-label="New chat"
                                className={cn(
                                    'flex items-center justify-center rounded-xl transition-all duration-150',
                                    'border border-border/50 bg-surface/80 text-muted-foreground',
                                    'hover:bg-surface hover:text-foreground hover:border-primary/30',
                                    'active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                                    isCollapsed ? 'h-9 w-9' : 'h-8 w-8 shrink-0'
                                )}
                            >
                                <Plus className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side={isCollapsed ? 'right' : 'bottom'} sideOffset={8}>New chat ⌘N</TooltipContent>
                    </Tooltip>
                </div>

                {/* Search */}
                {!isCollapsed && (
                    <div className="px-3 pb-2">
                        <label htmlFor="sidebar-search" className="sr-only">Search chats</label>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 pointer-events-none" aria-hidden="true" />
                            <input
                                id="sidebar-search"
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search chats…"
                                className={cn(
                                    'w-full rounded-xl border border-border/40 bg-muted/30',
                                    'pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40',
                                    'focus:outline-none focus:border-primary/40 focus:bg-muted/50 transition-all duration-150'
                                )}
                                aria-controls="chat-list"
                            />
                        </div>
                    </div>
                )}

                {/* Divider */}
                <div className="mx-3 h-px bg-border/40" aria-hidden="true" />

                {/* Chat list */}
                <ScrollArea className="flex-1 py-2" id="chat-list" aria-label="Previous chats">
                    {filtered.length === 0 ? (
                        !isCollapsed && (
                            <p className="px-4 py-8 text-center text-xs text-muted-foreground/40 select-none leading-relaxed">
                                {search ? 'No chats match your search.' : 'No chats yet.\nStart a new conversation.'}
                            </p>
                        )
                    ) : (
                        <>
                            <Group label="Today" items={today} />
                            <Group label="Yesterday" items={yesterday} />
                            <Group label="Older" items={older} />
                        </>
                    )}
                </ScrollArea>

                {/* Resize handle */}
                {!isCollapsed && (
                    <div
                        className="absolute right-0 inset-y-0 w-3 cursor-col-resize z-10 flex items-center justify-center group/handle"
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        aria-hidden="true"
                        role="separator"
                        aria-orientation="vertical"
                    >
                        <div className="h-8 w-[3px] rounded-full bg-border/0 group-hover/handle:bg-primary/30 transition-colors duration-200" />
                    </div>
                )}
            </aside>

            {/* Delete confirmation */}
            <AlertDialog open={deleteTarget !== null} onOpenChange={(o) => !o && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
                        <AlertDialogDescription>
                            <strong className="text-foreground">"{deleteTarget?.title}"</strong> will be permanently deleted. This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteTarget) {
                                    onDeleteChat(deleteTarget.id)
                                    setDeleteTarget(null)
                                }
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
