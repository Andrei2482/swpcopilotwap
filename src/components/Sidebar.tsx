import { useState, useRef, useCallback, type PointerEvent, type MouseEvent } from 'react'
import { Plus, MessageSquare, Trash2, Search, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { Chat } from '@/types'

const MIN_W = 180
const MAX_W = 340
const DEFAULT_W = 240

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
    const dragging = useRef(false)
    const startX = useRef(0)
    const startW = useRef(DEFAULT_W)

    /* ── Drag-to-resize ─────────────────────────────────────────────────── */
    const onPointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
        if (isCollapsed) return
        dragging.current = true
        startX.current = e.clientX
        startW.current = width
            ; (e.target as HTMLElement).setPointerCapture(e.pointerId)
    }, [isCollapsed, width])

    const onPointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
        if (!dragging.current) return
        const delta = e.clientX - startX.current
        setWidth(Math.min(MAX_W, Math.max(MIN_W, startW.current + delta)))
    }, [])

    const onPointerUp = useCallback(() => { dragging.current = false }, [])

    /* ── Chat groups ────────────────────────────────────────────────────── */
    const today = chats.filter((c) => c.group === 'today')
    const yesterday = chats.filter((c) => c.group === 'yesterday')
    const older = chats.filter((c) => c.group === 'older')

    function ChatGroup({ label, items }: { label: string; items: Chat[] }) {
        if (items.length === 0) return null
        return (
            <div className="mb-1">
                {!isCollapsed && (
                    <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 select-none">
                        {label}
                    </p>
                )}
                {items.map((chat) => (
                    <ChatRow key={chat.id} chat={chat} />
                ))}
            </div>
        )
    }

    function ChatRow({ chat }: { chat: Chat }) {
        const isActive = activeChatId === chat.id
        return (
            <Tooltip delayDuration={isCollapsed ? 100 : 999999}>
                <TooltipTrigger asChild>
                    <div className="group relative mx-1.5 mb-0.5">
                        <button
                            type="button"
                            onClick={() => onSelectChat(chat.id)}
                            aria-current={isActive ? 'true' : undefined}
                            className={cn(
                                'w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-sm text-left',
                                'transition-all duration-150 outline-none',
                                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar',
                                isActive
                                    ? 'bg-primary/12 text-foreground border border-primary/20 shadow-[0_0_12px_hsl(var(--primary)/0.1)]'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent',
                                isCollapsed ? 'justify-center px-2' : 'pr-8', // right pad for delete btn
                            )}
                        >
                            <MessageSquare
                                className={cn('h-3.5 w-3.5 shrink-0 transition-colors', isActive ? 'text-primary' : 'opacity-50')}
                            />
                            {!isCollapsed && (
                                <span className="truncate flex-1 text-[13px] leading-snug">
                                    {chat.title}
                                </span>
                            )}
                        </button>

                        {/* Delete button — absolutely positioned inside the row so truncation is safe */}
                        {!isCollapsed && (
                            <button
                                type="button"
                                onClick={(e: MouseEvent) => { e.stopPropagation(); onDeleteChat(chat.id) }}
                                aria-label={`Delete "${chat.title}"`}
                                className={cn(
                                    'absolute right-1.5 top-1/2 -translate-y-1/2',
                                    'flex h-6 w-6 items-center justify-center rounded-lg',
                                    'text-muted-foreground/0 group-hover:text-muted-foreground/60',
                                    'hover:!text-destructive hover:bg-destructive/10',
                                    'transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                                )}
                            >
                                <Trash2 className="h-3 w-3" />
                            </button>
                        )}
                    </div>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">{chat.title}</TooltipContent>}
            </Tooltip>
        )
    }

    return (
        <aside
            className="relative flex flex-col h-full bg-sidebar border-r border-border/60 shrink-0 select-none"
            style={{ width: isCollapsed ? 56 : width }}
            aria-label="Chat history sidebar"
        >
            {/* New chat */}
            <div className={cn('p-2.5', isCollapsed ? 'flex justify-center' : '')}>
                <Tooltip delayDuration={isCollapsed ? 100 : 999999}>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={onNewChat}
                            variant="outline"
                            size={isCollapsed ? 'icon' : 'default'}
                            className={cn(
                                'border-border/60 bg-surface/60 hover:bg-surface text-foreground gap-2 transition-all duration-150',
                                isCollapsed ? 'h-9 w-9' : 'w-full h-9 text-sm font-medium',
                            )}
                            aria-label="New chat"
                        >
                            <Plus className="h-4 w-4 shrink-0" />
                            {!isCollapsed && <span>New chat</span>}
                        </Button>
                    </TooltipTrigger>
                    {isCollapsed && <TooltipContent side="right">New chat</TooltipContent>}
                </Tooltip>
            </div>

            {/* Search bar */}
            {!isCollapsed && (
                <div className="px-2.5 pb-2">
                    <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-muted/30 px-3 py-2 text-xs text-muted-foreground/50 cursor-default select-none">
                        <Search className="h-3.5 w-3.5 shrink-0" />
                        <span>Search chats…</span>
                    </div>
                </div>
            )}

            {/* Divider */}
            <div className="mx-2.5 h-px bg-border/50" />

            {/* Chat list */}
            <ScrollArea className="flex-1 py-1">
                {chats.length === 0 ? (
                    !isCollapsed && (
                        <p className="px-4 py-8 text-center text-xs text-muted-foreground/40 select-none leading-relaxed">
                            No chats yet.<br />Start a new conversation.
                        </p>
                    )
                ) : (
                    <>
                        <ChatGroup label="Today" items={today} />
                        <ChatGroup label="Yesterday" items={yesterday} />
                        <ChatGroup label="Older" items={older} />
                    </>
                )}
            </ScrollArea>

            {/* Drag handle */}
            {!isCollapsed && (
                <div
                    className={cn(
                        'absolute right-0 top-0 bottom-0 flex items-center justify-center',
                        'w-3 cursor-col-resize group/handle z-10',
                        'hover:before:opacity-100 before:opacity-0 before:content-[""] before:absolute before:inset-y-0 before:right-0 before:w-px before:bg-primary/40 before:transition-opacity',
                    )}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    aria-hidden="true"
                >
                    <GripVertical className="h-4 w-4 text-border group-hover/handle:text-muted-foreground/50 transition-colors" />
                </div>
            )}
        </aside>
    )
}
