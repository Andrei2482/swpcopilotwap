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
    { text: 'Best mods for beginners?', emoji: '🛠️' },
    { text: 'All secret areas in the game', emoji: '🗺️' },
    { text: 'Tips for beating the final boss', emoji: '⚔️' },
]

function TypingDots() {
    return (
        <span className="inline-flex items-center gap-[3px] py-0.5" aria-label="Thinking" role="status">
            {[0, 1, 2].map(i => (
                <span
                    key={i}
                    className="h-[5px] w-[5px] rounded-full"
                    style={{
                        background: 'hsl(var(--muted-foreground) / 0.45)',
                        animation: 'typing-dot 1.2s ease-in-out infinite',
                        animationDelay: `${i * 0.18}s`,
                    }}
                />
            ))}
        </span>
    )
}

export function ChatView({ messages, isTyping, onReport, onRegen, onVariantChange, onSuggest }: ChatViewProps) {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, [messages, isTyping])

    /* ── Welcome screen ─────────────────────────────────────────────── */
    if (messages.length === 0 && !isTyping) {
        return (
            <div
                className="flex flex-1 flex-col items-center justify-center gap-8 px-4 pb-2"
                aria-label="Welcome"
            >
                {/* Glow + icon */}
                <div className="relative flex flex-col items-center gap-4" style={{ animation: 'fade-in 320ms ease-out both' }}>
                    <div
                        className="absolute inset-0 -z-10 scale-[2.5] rounded-full opacity-30"
                        style={{ background: 'radial-gradient(circle, hsl(var(--primary)/0.18), transparent 70%)', filter: 'blur(24px)' }}
                        aria-hidden="true"
                    />
                    <div
                        className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl"
                        style={{
                            background: 'hsl(var(--surface))',
                            border: '1px solid hsl(var(--primary) / 0.22)',
                            boxShadow: '0 0 0 6px hsl(var(--primary) / 0.06), 0 4px 24px hsl(var(--primary) / 0.14)',
                        }}
                    >
                        <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div className="text-center max-w-[260px]">
                        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-foreground mb-1">
                            How can I help?
                        </h1>
                        <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                            Ask anything about Swordigo — strategies, mods, lore, or secrets.
                        </p>
                    </div>
                </div>

                {/* Suggestion grid */}
                <div
                    className="w-full max-w-[360px] grid grid-cols-1 xs:grid-cols-2 gap-2"
                    role="list"
                    aria-label="Suggested questions"
                >
                    {SUGGESTIONS.map((s, i) => (
                        <button
                            key={s.text}
                            type="button"
                            role="listitem"
                            onClick={() => onSuggest?.(s.text)}
                            aria-label={s.text}
                            className={cn(
                                'group flex items-start gap-3 rounded-xl px-3.5 py-3 text-left',
                                'border bg-transparent text-muted-foreground',
                                'hover:text-foreground hover:bg-muted/20',
                                'active:scale-[0.98] transition-all duration-200',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                            )}
                            style={{
                                borderColor: 'hsl(var(--border) / 0.40)',
                                animation: 'fade-in 300ms ease-out both',
                                animationDelay: `${80 + i * 50}ms`,
                            }}
                        >
                            <span className="text-[16px] leading-none mt-0.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                                {s.emoji}
                            </span>
                            <span className="text-[12.5px] leading-snug">{s.text}</span>
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    /* ── Messages ──────────────────────────────────────────────────── */
    return (
        <div
            className="flex-1 overflow-y-auto scroll-smooth"
            role="log"
            aria-live="polite"
            aria-label="Conversation"
            aria-relevant="additions"
        >
            <div className="mx-auto w-full max-w-[680px] px-3 sm:px-5 py-6 space-y-5">
                {messages.map((msg, idx) => {
                    const isUser = msg.role === 'user'
                    const variants = msg.variants ?? [msg.content]
                    const activeIdx = msg.activeVariant ?? 0
                    const displayContent = variants[activeIdx] ?? msg.content

                    return (
                        <div
                            key={msg.id}
                            className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}
                            style={{ animation: 'msg-in 260ms cubic-bezier(0.16,1,0.3,1) both', animationDelay: `${Math.min(idx * 12, 60)}ms` }}
                        >
                            {/* AI avatar dot */}
                            {!isUser && (
                                <div
                                    className="mt-1 h-6 w-6 shrink-0 rounded-lg flex items-center justify-center"
                                    style={{
                                        background: 'hsl(var(--primary) / 0.08)',
                                        border: '1px solid hsl(var(--primary) / 0.15)',
                                    }}
                                    aria-hidden="true"
                                >
                                    <Sparkles className="h-3 w-3 text-primary" />
                                </div>
                            )}

                            <div className={cn('group flex flex-col gap-1.5', isUser ? 'items-end max-w-[74%]' : 'items-start max-w-[80%]')}>
                                {/* Bubble */}
                                {isUser ? (
                                    <div
                                        role="note"
                                        aria-label="Your message"
                                        className="rounded-2xl rounded-br-[6px] px-4 py-3 text-[13.5px] leading-relaxed text-primary-foreground"
                                        style={{
                                            background: 'hsl(var(--primary))',
                                            boxShadow: '0 4px 18px hsl(var(--primary) / 0.22), 0 1px 4px hsl(var(--primary) / 0.12)',
                                        }}
                                    >
                                        <p className="whitespace-pre-wrap break-words">{displayContent}</p>
                                    </div>
                                ) : (
                                    <div
                                        role="article"
                                        aria-label="Copilot response"
                                        className="rounded-2xl rounded-bl-[6px] px-4 py-3 text-[13.5px] leading-relaxed text-foreground"
                                        style={{
                                            background: 'hsl(var(--surface))',
                                            border: '1px solid hsl(var(--border) / 0.45)',
                                            boxShadow: '0 1px 6px hsl(222 25% 4% / 0.12)',
                                        }}
                                    >
                                        <p className="whitespace-pre-wrap break-words">{displayContent}</p>
                                    </div>
                                )}

                                {/* Actions — AI only */}
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

                {/* Typing */}
                {isTyping && (
                    <div className="flex items-start gap-3" style={{ animation: 'fade-in 180ms ease-out both' }} aria-live="polite">
                        <div
                            className="mt-1 h-6 w-6 shrink-0 rounded-lg flex items-center justify-center"
                            style={{ background: 'hsl(var(--primary) / 0.08)', border: '1px solid hsl(var(--primary) / 0.15)' }}
                            aria-hidden="true"
                        >
                            <Sparkles className="h-3 w-3 text-primary" />
                        </div>
                        <div
                            className="rounded-2xl rounded-bl-[6px] px-4 py-3"
                            style={{
                                background: 'hsl(var(--surface))',
                                border: '1px solid hsl(var(--border) / 0.45)',
                                boxShadow: '0 1px 6px hsl(222 25% 4% / 0.12)',
                            }}
                        >
                            <TypingDots />
                        </div>
                    </div>
                )}

                <div ref={bottomRef} className="h-1" aria-hidden="true" />
            </div>
        </div>
    )
}
