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
}

function TypingIndicator() {
    return (
        <div className="flex items-end gap-1.5 px-1" aria-label="Copilot is typing" role="status">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 motion-safe:animate-typing-dot"
                    style={{ animationDelay: `${i * 0.16}s` }}
                />
            ))}
        </div>
    )
}

export function ChatView({ messages, isTyping, onReport, onRegen }: ChatViewProps) {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    if (messages.length === 0 && !isTyping) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 select-none animate-fade-in">
                {/* Ambient glow behind icon */}
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl motion-safe:animate-glow-pulse scale-150" />
                    <div className="relative h-14 w-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center">
                        <Sparkles className="h-7 w-7 text-primary" aria-hidden="true" />
                    </div>
                </div>
                <div className="text-center">
                    <h1 className="text-xl font-semibold text-foreground mb-1">How can I help?</h1>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        Ask me anything about Swordigo — mechanics, lore, mods, strategies, and more.
                    </p>
                </div>

                {/* Suggestion chips */}
                <div className="flex flex-wrap gap-2 justify-center mt-2 max-w-sm">
                    {[
                        'How do I get the fire sword?',
                        'Best mods to install?',
                        'What are the secret areas?',
                        'Tips for the final boss',
                    ].map((s) => (
                        <button
                            key={s}
                            type="button"
                            className="px-3 py-1.5 rounded-full border border-border bg-surface text-xs text-muted-foreground hover:text-foreground hover:bg-surface-raised hover:border-border/80 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6" role="log" aria-live="polite" aria-label="Chat messages">
            {messages.map((msg, idx) => (
                <div
                    key={msg.id}
                    className={cn(
                        'flex gap-3',
                        msg.role === 'user' ? 'justify-end' : 'justify-start',
                        'animate-fade-in'
                    )}
                    style={{ animationDelay: `${Math.min(idx * 0.04, 0.2)}s` }}
                >
                    {/* AI avatar */}
                    {msg.role === 'assistant' && (
                        <div className="h-7 w-7 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0 mt-0.5">
                            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        </div>
                    )}

                    <div className={cn('flex flex-col gap-1.5 max-w-[78%]', msg.role === 'user' ? 'items-end' : 'items-start')}>
                        {/* Bubble */}
                        <div
                            className={cn(
                                'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                                msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-br-sm shadow-[0_2px_10px_hsl(var(--primary)/0.3)]'
                                    : 'bg-surface border border-border/60 text-foreground rounded-bl-sm shadow-sm'
                            )}
                        >
                            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>

                        {/* Actions — only for AI messages */}
                        {msg.role === 'assistant' && (
                            <MessageActions
                                messageId={msg.id}
                                onReport={() => onReport(msg.id)}
                                onRegen={(mode) => onRegen(msg.id, mode)}
                            />
                        )}
                    </div>
                </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
                <div className="flex items-end gap-3 animate-fade-in">
                    <div className="h-7 w-7 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                        <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    </div>
                    <div className="bg-surface border border-border/60 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                        <TypingIndicator />
                    </div>
                </div>
            )}

            <div ref={bottomRef} aria-hidden="true" />
        </div>
    )
}
