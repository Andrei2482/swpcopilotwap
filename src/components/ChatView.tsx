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
        <span className="inline-flex items-center gap-[3px] py-0.5" aria-label="Thinking" role="status">
            {[0, 1, 2].map(i => (
                <span
                    key={i}
                    className="h-[6px] w-[6px] rounded-full bg-muted-foreground/40 animate-[typing-dot_1.15s_ease-in-out_infinite]"
                    style={{ animationDelay: `${i * 0.17}s` }}
                />
            ))}
        </span>
    )
}

export function ChatView({
    messages, isTyping, onReport, onRegen, onVariantChange, onSuggest
}: ChatViewProps) {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, [messages, isTyping])

    /* ── Welcome ───────────────────────────────────────────────────── */
    if (messages.length === 0 && !isTyping) {
        return (
            <div
                className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-10 select-none"
                aria-label="Welcome"
            >
                {/* Icon */}
                <div className="relative" style={{ animationDelay: '0ms' }}>
                    <div className="absolute inset-0 scale-[2] rounded-full bg-primary/8 blur-3xl" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/8 shadow-[0_0_32px_hsl(var(--primary)/0.12)]">
                        <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                </div>

                {/* Heading */}
                <div className="text-center max-w-[280px] animate-[fade-in_0.3s_ease-out_100ms_both]">
                    <h1 className="text-[22px] font-semibold tracking-tight text-foreground mb-1.5 text-balance">
                        How can I help you?
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Ask anything about Swordigo — lore, mods, strategies, secrets.
                    </p>
                </div>

                {/* Chips */}
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 w-full max-w-[340px]">
                    {SUGGESTIONS.map((s, i) => (
                        <button
                            key={s.text}
                            type="button"
                            onClick={() => onSuggest?.(s.text)}
                            aria-label={s.text}
                            className={cn(
                                'flex items-center gap-2.5 rounded-xl border border-border/40 bg-surface/40',
                                'px-3.5 py-2.5 text-left text-[13px] text-muted-foreground',
                                'hover:text-foreground hover:border-primary/25 hover:bg-surface/80',
                                'hover:shadow-[0_0_20px_hsl(var(--primary)/0.07)]',
                                'transition-all duration-200',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                                'animate-[fade-in_0.3s_ease-out_both]'
                            )}
                            style={{ animationDelay: `${180 + i * 55}ms` }}
                        >
                            <span className="text-base leading-none shrink-0">{s.emoji}</span>
                            <span className="leading-snug">{s.text}</span>
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
            <div className="mx-auto w-full max-w-2xl px-3 sm:px-5 py-6 space-y-4">
                {messages.map((msg, idx) => {
                    const isUser = msg.role === 'user'
                    const variants = msg.variants ?? [msg.content]
                    const activeIdx = msg.activeVariant ?? 0
                    const displayContent = variants[activeIdx] ?? msg.content

                    return (
                        <div
                            key={msg.id}
                            className={cn(
                                'flex gap-3 animate-[msg-in_0.28s_cubic-bezier(0.16,1,0.3,1)_both]',
                                isUser ? 'justify-end' : 'justify-start'
                            )}
                            style={{ animationDelay: `${Math.min(idx * 15, 80)}ms` }}
                        >
                            {/* AI avatar */}
                            {!isUser && (
                                <div
                                    className="mt-0.5 h-7 w-7 shrink-0 rounded-xl border border-primary/15 bg-primary/8 flex items-center justify-center"
                                    aria-hidden="true"
                                >
                                    <Sparkles className="h-3 w-3 text-primary" />
                                </div>
                            )}

                            {/* Bubble + actions */}
                            <div className={cn(
                                'group flex flex-col gap-1',
                                isUser ? 'items-end max-w-[75%]' : 'items-start max-w-[82%]'
                            )}>
                                {/* ── User bubble ── */}
                                {isUser ? (
                                    <div
                                        role="note"
                                        aria-label="Your message"
                                        className="rounded-2xl rounded-br-[6px] px-4 py-3 text-sm leading-relaxed bg-primary text-primary-foreground"
                                        style={{
                                            boxShadow: '0 4px 20px hsl(var(--primary)/0.25), 0 1px 4px hsl(var(--primary)/0.15)',
                                        }}
                                    >
                                        <p className="whitespace-pre-wrap break-words">{displayContent}</p>
                                    </div>
                                ) : (
                                    /* ── AI bubble ── */
                                    <div
                                        role="article"
                                        aria-label="Copilot response"
                                        className="rounded-2xl rounded-bl-[6px] px-4 py-3 text-sm leading-relaxed text-foreground"
                                        style={{
                                            background: 'hsl(var(--surface))',
                                            border: '1px solid hsl(var(--border) / 0.5)',
                                            boxShadow: '0 1px 8px hsl(222 25% 4% / 0.14)',
                                        }}
                                    >
                                        <p className="whitespace-pre-wrap break-words">{displayContent}</p>
                                    </div>
                                )}

                                {/* Message actions — AI only, fade in on hover */}
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
                    <div className="flex items-start gap-3 animate-[fade-in_0.2s_ease-out_both]" aria-live="polite">
                        <div className="mt-0.5 h-7 w-7 shrink-0 rounded-xl border border-primary/15 bg-primary/8 flex items-center justify-center" aria-hidden="true">
                            <Sparkles className="h-3 w-3 text-primary" />
                        </div>
                        <div
                            className="rounded-2xl rounded-bl-[6px] px-4 py-3.5"
                            style={{
                                background: 'hsl(var(--surface))',
                                border: '1px solid hsl(var(--border) / 0.5)',
                                boxShadow: '0 1px 8px hsl(222 25% 4% / 0.14)',
                            }}
                        >
                            <TypingDots />
                        </div>
                    </div>
                )}

                <div ref={bottomRef} className="h-2" aria-hidden="true" />
            </div>
        </div>
    )
}
