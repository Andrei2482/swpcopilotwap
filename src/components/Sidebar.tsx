import { useState } from 'react'
import { Plus, MessageSquare, Trash2, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { Chat } from '@/types'

interface SidebarProps {
    chats: Chat[]
    activeChatId: string | null
    onSelectChat: (id: string) => void
    onNewChat: () => void
    onDeleteChat: (id: string) => void
    isCollapsed: boolean
}

export function Sidebar({
    chats,
    activeChatId,
    onSelectChat,
    onNewChat,
    onDeleteChat,
    isCollapsed,
}: SidebarProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    // Group chats by recency
    const today = chats.filter((c) => c.group === 'today')
    const yesterday = chats.filter((c) => c.group === 'yesterday')
    const older = chats.filter((c) => c.group === 'older')

    function ChatGroup({ label, items }: { label: string; items: Chat[] }) {
        if (items.length === 0) return null
        return (
            <div className="mb-2">
                {!isCollapsed && (
                    <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 select-none">
                        {label}
                    </p>
                )}
                {items.map((chat) => (
                    <div
                        key={chat.id}
                        className="relative group"
                        onMouseEnter={() => setHoveredId(chat.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <Tooltip delayDuration={isCollapsed ? 100 : 99999}>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    onClick={() => onSelectChat(chat.id)}
                                    className={cn(
                                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 text-left',
                                        'hover:bg-muted/60',
                                        activeChatId === chat.id
                                            ? 'bg-muted text-foreground font-medium'
                                            : 'text-muted-foreground hover:text-foreground',
                                        isCollapsed ? 'justify-center px-2' : ''
                                    )}
                                    aria-current={activeChatId === chat.id ? 'true' : undefined}
                                >
                                    <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-60" />
                                    {!isCollapsed && (
                                        <span className="truncate flex-1">{chat.title}</span>
                                    )}
                                </button>
                            </TooltipTrigger>
                            {isCollapsed && (
                                <TooltipContent side="right">{chat.title}</TooltipContent>
                            )}
                        </Tooltip>

                        {/* Delete button — appears on hover */}
                        {!isCollapsed && hoveredId === chat.id && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDeleteChat(chat.id)
                                }}
                                className={cn(
                                    'absolute right-2 top-1/2 -translate-y-1/2',
                                    'p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10',
                                    'transition-all duration-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                                )}
                                aria-label={`Delete "${chat.title}"`}
                            >
                                <Trash2 className="h-3 w-3" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <aside
            className={cn(
                'flex flex-col h-full bg-sidebar border-r border-border transition-all duration-200',
                isCollapsed ? 'w-14' : 'w-60'
            )}
            aria-label="Chat history sidebar"
        >
            {/* New chat button */}
            <div className={cn('p-3', isCollapsed ? 'flex justify-center' : '')}>
                <Tooltip delayDuration={isCollapsed ? 100 : 99999}>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={onNewChat}
                            variant="outline"
                            size={isCollapsed ? 'icon' : 'default'}
                            className={cn(
                                'gap-2 border-border/60 bg-surface hover:bg-surface-raised w-full',
                                isCollapsed ? 'w-9 h-9' : ''
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

            {/* Search placeholder (non-functional) */}
            {!isCollapsed && (
                <div className="px-3 pb-2">
                    <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs text-muted-foreground/60 select-none cursor-default">
                        <Search className="h-3 w-3 shrink-0" />
                        <span>Search chats…</span>
                    </div>
                </div>
            )}

            <Separator className="my-1 opacity-50" />

            {/* Chat list */}
            <ScrollArea className="flex-1 px-1.5 py-1">
                {chats.length === 0 ? (
                    !isCollapsed ? (
                        <p className="px-3 py-6 text-center text-xs text-muted-foreground/50 select-none">
                            No chats yet.
                            <br />
                            Start a new conversation.
                        </p>
                    ) : null
                ) : (
                    <>
                        <ChatGroup label="Today" items={today} />
                        <ChatGroup label="Yesterday" items={yesterday} />
                        <ChatGroup label="Older" items={older} />
                    </>
                )}
            </ScrollArea>
        </aside>
    )
}
