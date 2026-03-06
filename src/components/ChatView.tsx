import { useEffect, useRef } from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MessageActions } from '@/components/MessageActions'
import type { Message } from '@/types'

interface ChatViewProps {
    messages: Message[]
    isTyping: boolean
    onReport: (messageId: string) => void
    onRegen: (messageId: string, mode: string) => void
    onSuggest?: (text: string) => void
}

const SUGGESTIONS = [
    'How do I get the fire sword?',
    'Best mods to install?',
    'Secret areas guide',
    'Tips for the final boss',
]

function TypingIndicator() {
    return (
        <div className="flex items-center gap-1" aria-label="Copilot is typing" role="status">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-typing-dot"
                    style={{ animationDelay: `${i * 0.18}s` }}
                />
            ))}
        </div>
    )
}

export function ChatView({ messages, isTyping, onReport, onRegen, onSuggest }: ChatViewProps) {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    /* ── Empty state ─────────────────────────────────────────────────────── */
    if (messages.length === 0 && !isTyping) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 select-none">
                <div className="relative animate-fade-in">
                    {/* Ambient glow */}
                    <div className="absolute inset-0 scale-150 rounded-full bg-primary/15 blur-3xl animate-glow-pulse" />
                    <div className="relative h-16 w-16 rounded-2xl border border-primary/30 bg-primary/10 flex items-center justify-center shadow-[0_0_40px_hsl(var(--primary)/0.2)]">
                        <Sparkles className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                </div>

                <div className="text-center animate-fade-in" style={{ animationDelay: '0.08s' }}>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
                        How can I help?
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                        Ask me anything about Swordigo — mechanics, lore, mods, strategies, and more.
                    </p>
                </div>

                {/* Suggestion chips */}
                <div
                    className="flex flex-wrap gap-2 justify-center max-w-sm animate-fade-in"
                    style={{ animationDelay: '0.15s' }}
                >
                    {SUGGESTIONS.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => onSuggest?.(s)}
                            className={cn(
                                'px-3.5 py-1.5 rounded-full text-xs font-medium',
                                'border border-border/60 bg-surface text-muted-foreground',
                                'hover:border-primary/40 hover:text-foreground hover:bg-surface-raised hover:shadow-[0_0_12px_hsl(var(--primary)/0.12)]',
                                'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    /* ── Message list ────────────────────────────────────────────────────── */
    return (
        <div
            className="flex-1 overflow-y-auto py-6 px-4 sm:px-8 space-y-2"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
        >
            {messages.map((msg, idx) => {
                const isUser = msg.role === 'user'
                return (
                    <div
                        key={msg.id}
                        className={cn(
                            'flex gap-3 animate-msg-in',
                            isUser ? 'justify-end' : 'justify-start',
                        )}
                        style={{ animationDelay: `${Math.min(idx * 0.03, 0.15)}s` }}
                    >
                        {/* AI avatar */}
                        {!isUser && (
                            <div className="mt-1 h-7 w-7 shrink-0 rounded-xl border border-primary/25 bg-primary/10 flex items-center justify-center">
                                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                            </div>
                        )}

                        {/* Bubble + actions */}
                        <div
                            className={cn(
                                'group flex flex-col max-w-[76%]',
                                isUser ? 'items-end' : 'items-start',
                            )}
                        >
                            <div
                                className={cn(
                                    'rounded-2xl px-4 py-3 text-sm leading-relaxed',
                                    isUser
                                        ? [
                                            'bg-primary text-primary-foreground',
                                            'rounded-tr-sm',
                                            'shadow-[0_4px_20px_hsl(var(--primary)/0.35)]',
                                        ]
                                        : [
                                            'bg-[hsl(var(--surface))] border border-[hsl(var(--border)/0.6)] text-foreground',
                                            'rounded-tl-sm',
                                            'shadow-[0_2px_12px_hsl(222_25%_4%/0.3)]',
                                        ]
                                )}
                            >
                                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                            </div>

                            {/* Action bar — only for AI, shows on group-hover */}
                            {!isUser && (
                                <MessageActions
                                    messageId={msg.id}
                                    content={msg.content}
                                    onReport={() => onReport(msg.id)}
                                    onRegen={(mode) => onRegen(msg.id, mode)}
                                />
                            )}
                        </div>
                    </div>
                )
            })}

            {/* Typing indicator */}
            {isTyping && (
                <div className="flex items-start gap-3 animate-fade-in">
                    <div className="mt-1 h-7 w-7 shrink-0 rounded-xl border border-primary/25 bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm border border-[hsl(var(--border)/0.6)] bg-[hsl(var(--surface))] px-4 py-3.5 shadow-[0_2px_12px_hsl(222_25%_4%/0.3)]">
                        <TypingIndicator />
                    </div>
                </div>
            )}

            <div ref={bottomRef} aria-hidden="true" className="h-2" />
        </div>
    )
}
