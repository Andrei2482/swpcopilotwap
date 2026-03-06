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
    onVariantChange: (messageId: string, index: number) => void
    onSuggest?: (text: string) => void
}

const SUGGESTIONS = [
    { text: 'How do I get the fire sword?', emoji: '🗡️' },
    { text: 'Best mods to install?', emoji: '🛠️' },
    { text: 'What are all the secret areas?', emoji: '🗺️' },
    { text: 'Tips for the final boss', emoji: '⚔️' },
]

function TypingDots() {
    return (
        <span className="inline-flex items-center gap-[3px]" aria-label="Typing" role="status">
            {[0, 1, 2].map((i) => (
                <span key={i} className="h-[7px] w-[7px] rounded-full bg-muted-foreground/50 animate-typing-dot"
                    style={{ animationDelay: `${i * 0.18}s` }} />
            ))}
        </span>
    )
}

export function ChatView({ messages, isTyping, onReport, onRegen, onVariantChange, onSuggest }: ChatViewProps) {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    /* ── Empty / welcome state ─────────────────────────────────────────── */
    if (messages.length === 0 && !isTyping) {
        return (
            <div
                className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-8 select-none"
                aria-label="Welcome screen"
            >
                <div className="relative animate-fade-in">
                    <div className="absolute inset-0 scale-[1.6] rounded-full bg-primary/10 blur-3xl animate-glow-pulse" />
                    <div className="relative h-[60px] w-[60px] rounded-2xl border border-primary/25 bg-primary/10 flex items-center justify-center shadow-[0_0_40px_hsl(var(--primary)/0.15)]">
                        <Sparkles className="h-7 w-7 text-primary" aria-hidden="true" />
                    </div>
                </div>

                <div className="text-center max-w-xs animate-fade-in" style={{ animationDelay: '80ms' }}>
                    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-1.5">
                        How can I help?
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Ask me anything about Swordigo — mechanics, lore, mods, strategies, and more.
                    </p>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 w-full max-w-sm animate-fade-in" style={{ animationDelay: '150ms' }}>
                    {SUGGESTIONS.map((s, i) => (
                        <button
                            key={s.text}
                            type="button"
                            onClick={() => onSuggest?.(s.text)}
                            className={cn(
                                'flex items-center gap-2.5 rounded-xl border border-border/50 bg-surface/60',
                                'px-3.5 py-2.5 text-left text-[13px] text-muted-foreground',
                                'hover:border-primary/30 hover:text-foreground hover:bg-surface',
                                'hover:shadow-[0_0_16px_hsl(var(--primary)/0.1)]',
                                'transition-all duration-200 animate-fade-in',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                            )}
                            style={{ animationDelay: `${180 + i * 50}ms` }}
                            aria-label={`Ask: ${s.text}`}
                        >
                            <span className="text-base leading-none shrink-0">{s.emoji}</span>
                            <span className="leading-snug">{s.text}</span>
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    /* ── Message list ──────────────────────────────────────────────────── */
    return (
        <div
            className="flex-1 overflow-y-auto py-6 space-y-1 scroll-smooth"
            role="log"
            aria-live="polite"
            aria-label="Chat conversation"
            aria-relevant="additions"
        >
            <div className="mx-auto w-full max-w-3xl px-3 sm:px-6 space-y-2">
                {messages.map((msg, idx) => {
                    const isUser = msg.role === 'user'
                    const variants = msg.variants ?? [msg.content]
                    const activeIdx = msg.activeVariant ?? 0
                    const displayContent = variants[activeIdx] ?? msg.content

                    return (
                        <div
                            key={msg.id}
                            className={cn('flex gap-3 animate-msg-in', isUser ? 'justify-end' : 'justify-start')}
                            style={{ animationDelay: `${Math.min(idx * 20, 120)}ms` }}
                        >
                            {/* AI avatar */}
                            {!isUser && (
                                <div className="mt-0.5 h-7 w-7 shrink-0 rounded-xl border border-primary/20 bg-primary/10 flex items-center justify-center">
                                    <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                                </div>
                            )}

                            {/* Bubble + actions wrapper — group for hover */}
                            <div className={cn('group flex flex-col max-w-[82%] sm:max-w-[75%]', isUser ? 'items-end' : 'items-start')}>
                                <div
                                    role={isUser ? 'note' : 'article'}
                                    aria-label={isUser ? 'Your message' : 'Copilot response'}
                                    className={cn(
                                        'rounded-2xl px-4 py-3 text-sm leading-relaxed',
                                        isUser
                                            ? [
                                                'bg-primary text-primary-foreground rounded-tr-sm',
                                                'shadow-[0_4px_24px_hsl(var(--primary)/0.3)]',
                                            ]
                                            : [
                                                'bg-[hsl(var(--surface))] border border-[hsl(var(--border)/0.5)]',
                                                'text-foreground rounded-tl-sm',
                                                'shadow-[0_2px_16px_hsl(222_25%_4%/0.2)]',
                                            ]
                                    )}
                                >
                                    <p className="whitespace-pre-wrap break-words">{displayContent}</p>
                                </div>

                                {/* Action bar — hover-reveal on AI messages */}
                                {!isUser && (
                                    <MessageActions
                                        messageId={msg.id}
                                        content={displayContent}
                                        variantIndex={activeIdx}
                                        variantTotal={variants.length}
                                        onReport={() => onReport(msg.id)}
                                        onRegen={(mode) => onRegen(msg.id, mode)}
                                        onVariantPrev={() => onVariantChange(msg.id, activeIdx - 1)}
                                        onVariantNext={() => onVariantChange(msg.id, activeIdx + 1)}
                                    />
                                )}
                            </div>
                        </div>
                    )
                })}

                {/* Typing indicator */}
                {isTyping && (
                    <div className="flex items-start gap-3 animate-fade-in" aria-live="polite">
                        <div className="mt-0.5 h-7 w-7 shrink-0 rounded-xl border border-primary/20 bg-primary/10 flex items-center justify-center">
                            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        </div>
                        <div className="rounded-2xl rounded-tl-sm border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--surface))] px-4 py-3.5">
                            <TypingDots />
                        </div>
                    </div>
                )}

                <div ref={bottomRef} className="h-4" aria-hidden="true" />
            </div>
        </div>
    )
}
