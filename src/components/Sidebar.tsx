import { useState, useRef, useCallback, useEffect, type MouseEvent } from 'react'
import { Plus, MessageSquare, Trash2, Search, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Chat } from '@/types'

const MIN_W = 204
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
    const [isDragging, setIsDragging] = useState(false)
    const draggingRef = useRef(false)
    const startX = useRef(0)
    const startW = useRef(DEFAULT_W)

    /* ── Resize: document-level, never loses capture ─────────────────── */
    const onHandleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
        if (isCollapsed) return
        e.preventDefault()
        draggingRef.current = true
        setIsDragging(true)
        startX.current = e.clientX
        startW.current = width
    }, [isCollapsed, width])

    useEffect(() => {
        const move = (e: globalThis.MouseEvent) => {
            if (!draggingRef.current) return
            setWidth(Math.min(MAX_W, Math.max(MIN_W, startW.current + e.clientX - startX.current)))
        }
        const up = () => { if (draggingRef.current) { draggingRef.current = false; setIsDragging(false) } }
        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', up)
        return () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up) }
    }, [])

    const q = search.trim().toLowerCase()
    const filtered = q ? chats.filter(c => c.title.toLowerCase().includes(q)) : chats
    const groups = [
        { label: 'Today', items: filtered.filter(c => c.group === 'today') },
        { label: 'Yesterday', items: filtered.filter(c => c.group === 'yesterday') },
        { label: 'Older', items: filtered.filter(c => c.group === 'older') },
    ]

    return (
        <>
            <aside
                id="sidebar"
                className={cn(
                    'relative flex flex-col h-full shrink-0 overflow-hidden',
                    'transition-[width] ease-[cubic-bezier(0.4,0,0.2,1)]',
                    isDragging ? 'duration-0' : 'duration-[230ms]'
                )}
                style={{
                    width: isCollapsed ? COLLAPSED_W : width,
                    borderRight: '1px solid hsl(var(--border) / 0.30)',
                    background: 'hsl(var(--sidebar))',
                }}
                aria-label="Chat history"
                role="navigation"
            >
                {/* Subtle purple glow at top */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-48 opacity-[0.05]"
                    style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 0%, hsl(var(--primary)), transparent)' }}
                />

                {/* ── Top section ──────────────────────────────────── */}
                <div className={cn(
                    'flex shrink-0 items-center gap-2 pt-4 pb-3',
                    isCollapsed ? 'flex-col px-2.5' : 'px-3'
                )}>
                    {/* New chat — primary action */}
                    {isCollapsed ? (
                        <Tooltip delayDuration={150}>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    onClick={onNewChat}
                                    aria-label="New chat"
                                    className={cn(
                                        'flex h-10 w-10 items-center justify-center rounded-xl',
                                        'border border-primary/20 bg-primary/8 text-primary',
                                        'hover:bg-primary/15 hover:border-primary/30',
                                        'active:scale-90 transition-all duration-150',
                                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                                    )}
                                >
                                    <Plus className="h-[18px] w-[18px]" aria-hidden="true" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={10}>New chat</TooltipContent>
                        </Tooltip>
                    ) : (
                        <button
                            type="button"
                            onClick={onNewChat}
                            aria-label="New chat"
                            className={cn(
                                'flex flex-1 items-center gap-2 rounded-xl px-3 py-2',
                                'border border-border/25 bg-muted/10 text-muted-foreground',
                                'hover:text-foreground hover:bg-muted/25 hover:border-border/40',
                                'active:scale-[0.98] transition-all duration-150',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1'
                            )}
                        >
                            <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-primary/10 border border-primary/15">
                                <Plus className="h-3 w-3 text-primary" aria-hidden="true" />
                            </div>
                            <span className="text-[13px] font-medium">New chat</span>
                        </button>
                    )}
                </div>

                {/* ── Search ─────────────────────────────────────── */}
                {!isCollapsed && (
                    <div className="shrink-0 px-3 pb-3">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/28 pointer-events-none"
                                aria-hidden="true"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search chats…"
                                aria-label="Search chats"
                                className={cn(
                                    'w-full rounded-xl border bg-transparent',
                                    'border-border/22 px-3 pl-8.5 py-2 text-[12.5px] text-foreground',
                                    'placeholder:text-muted-foreground/25',
                                    'focus:outline-none focus:border-primary/30 focus:bg-muted/8',
                                    'transition-all duration-150'
                                )}
                                style={{ paddingLeft: '2.25rem' }}
                            />
                        </div>
                    </div>
                )}

                {/* Divider */}
                {!isCollapsed && (
                    <div className="mx-3 mb-2 h-px shrink-0" style={{ background: 'hsl(var(--border) / 0.20)' }} aria-hidden="true" />
                )}

                {/* ── Chat list ──────────────────────────────────── */}
                <ScrollArea className="flex-1">
                    <div className="py-1">
                        {filtered.length === 0 && !isCollapsed && (
                            <p className="px-5 py-10 text-center text-[12px] text-muted-foreground/30 leading-relaxed select-none">
                                {search ? 'No matching chats.' : 'No conversations yet.'}
                            </p>
                        )}

                        {groups.map(({ label, items }) => items.length > 0 && (
                            <div key={label} className="mb-2">
                                {!isCollapsed && (
                                    <p className="mx-3 mb-1 mt-2 text-[10px] font-semibold uppercase tracking-[0.10em] select-none"
                                        style={{ color: 'hsl(var(--muted-foreground) / 0.38)' }}>
                                        {label}
                                    </p>
                                )}
                                {items.map(chat => {
                                    const isActive = chat.id === activeChatId
                                    const row = (
                                        <div
                                            key={chat.id}
                                            className={cn(
                                                'group relative mx-2 mb-0.5',
                                                isCollapsed ? 'flex justify-center' : ''
                                            )}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => onSelectChat(chat.id)}
                                                aria-current={isActive ? 'page' : undefined}
                                                aria-label={chat.title}
                                                className={cn(
                                                    'w-full flex items-center gap-2.5 rounded-xl outline-none',
                                                    'text-left text-[13px] leading-snug select-none',
                                                    'transition-all duration-200',
                                                    'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
                                                    isCollapsed ? 'justify-center p-2.5 w-10 h-10' : 'pl-3 pr-9 py-2.5',
                                                    isActive
                                                        ? 'bg-primary/9 text-foreground border border-primary/18'
                                                        : 'border border-transparent text-muted-foreground/75 hover:text-foreground hover:bg-muted/25 hover:border-border/20'
                                                )}
                                            >
                                                <MessageSquare
                                                    className={cn(
                                                        'shrink-0 transition-colors duration-200',
                                                        isCollapsed ? 'h-4 w-4' : 'h-[13px] w-[13px]',
                                                        isActive ? 'text-primary' : 'text-muted-foreground/38'
                                                    )}
                                                    aria-hidden="true"
                                                />
                                                {!isCollapsed && (
                                                    <span className="truncate min-w-0" style={{ maxWidth: width - 86 }}>
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
                                                        'absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6',
                                                        'items-center justify-center rounded-lg',
                                                        'opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100',
                                                        'text-muted-foreground/35 hover:text-destructive hover:bg-destructive/8',
                                                        'transition-all duration-150',
                                                        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:opacity-100'
                                                    )}
                                                >
                                                    <Trash2 className="h-3 w-3" aria-hidden="true" />
                                                </button>
                                            )}
                                        </div>
                                    )

                                    if (isCollapsed) {
                                        return (
                                            <Tooltip key={chat.id} delayDuration={150}>
                                                <TooltipTrigger asChild>{row}</TooltipTrigger>
                                                <TooltipContent side="right" sideOffset={10}>{chat.title}</TooltipContent>
                                            </Tooltip>
                                        )
                                    }
                                    return row
                                })}
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* ── Footer brand ─────────────────────────────── */}
                {!isCollapsed && (
                    <div className="shrink-0 px-4 py-3 select-none flex items-center gap-2 border-t" style={{ borderColor: 'hsl(var(--border) / 0.18)' }}>
                        <Zap className="h-3 w-3 shrink-0" style={{ color: 'hsl(var(--primary) / 0.45)' }} aria-hidden="true" />
                        <span className="text-[11px] font-medium" style={{ color: 'hsl(var(--muted-foreground) / 0.38)' }}>
                            Powered by SwordigoAI
                        </span>
                    </div>
                )}

                {/* ── Resize handle ─────────────────────────────── */}
                {!isCollapsed && (
                    <div
                        className="absolute right-0 inset-y-0 w-3 cursor-col-resize z-10 group/r select-none"
                        onMouseDown={onHandleMouseDown}
                        aria-hidden="true"
                    >
                        <div className="absolute right-0 inset-y-0 w-[3px] bg-transparent group-hover/r:bg-primary/18 transition-colors duration-200" />
                    </div>
                )}
            </aside>

            {/* Delete confirm */}
            <AlertDialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
                        <AlertDialogDescription>
                            "<span className="font-medium text-foreground">{deleteTarget?.title}</span>" will be permanently removed. This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { if (deleteTarget) { onDeleteChat(deleteTarget.id); setDeleteTarget(null) } }}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
