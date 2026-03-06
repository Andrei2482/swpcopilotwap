import { useState, useRef, useCallback, type KeyboardEvent } from 'react'
import { ArrowUp, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
    onSend: (content: string) => void
    disabled?: boolean
}

const PLACEHOLDER_HINTS = [
    'Ask anything about Swordigo…',
    'How do I beat the final boss?',
    'Find the best mods…',
    'Explain the lore…',
]

export function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [value, setValue] = useState('')
    const [focused, setFocused] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const resize = useCallback(() => {
        const el = textareaRef.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = Math.min(el.scrollHeight, 180) + 'px'
    }, [])

    function submit() {
        const trimmed = value.trim()
        if (!trimmed || disabled) return
        onSend(trimmed)
        setValue('')
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.focus()
        }
    }

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit()
        }
    }

    const canSend = value.trim().length > 0 && !disabled
    const ringColor = canSend
        ? 'shadow-[0_0_0_1.5px_hsl(var(--primary)/0.6),0_0_28px_hsl(var(--primary)/0.15)]'
        : focused
            ? 'shadow-[0_0_0_1.5px_hsl(var(--border)/0.9),0_0_0_4px_hsl(var(--primary)/0.06)]'
            : 'shadow-[0_0_0_1px_hsl(var(--border)/0.6)]'

    return (
        <div
            className="shrink-0 px-3 sm:px-6 pb-4 pt-2"
            role="region"
            aria-label="Message input"
        >
            {/* Outer glow & shape */}
            <div className={cn('rounded-2xl transition-shadow duration-300', ringColor)}>

                {/* Glass card */}
                <div
                    className="relative flex flex-col rounded-2xl bg-[hsl(var(--surface))] overflow-hidden"
                    style={{ boxShadow: '0 2px 12px hsl(222 25% 4% / 0.25)' }}
                >
                    {/* Subtle gradient top line */}
                    <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[hsl(var(--primary)/0.4)] to-transparent opacity-0 transition-opacity duration-300"
                        style={{ opacity: canSend ? 1 : 0 }} aria-hidden="true" />

                    <textarea
                        ref={textareaRef}
                        id="chat-input"
                        value={value}
                        onChange={(e) => { setValue(e.target.value); resize() }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        rows={1}
                        placeholder={disabled ? '' : 'Ask Copilot anything about Swordigo…'}
                        disabled={disabled}
                        aria-label="Type your message"
                        aria-multiline="true"
                        aria-disabled={disabled}
                        className={cn(
                            'w-full resize-none bg-transparent px-4 pt-3.5 pb-2',
                            'text-sm text-foreground leading-relaxed',
                            'placeholder:text-muted-foreground/35',
                            'focus:outline-none max-h-[180px] scrollbar-thin',
                            'transition-opacity duration-150',
                            disabled && 'opacity-40 cursor-not-allowed'
                        )}
                        style={{ minHeight: 28 }}
                    />

                    {/* Bottom toolbar */}
                    <div className="flex items-center justify-between px-3 pb-2.5 pt-1 gap-2">
                        {/* Status hint */}
                        <p className="text-[10px] text-muted-foreground/30 select-none leading-none transition-opacity duration-200"
                            aria-live="polite" aria-atomic="true">
                            {disabled
                                ? 'Copilot is thinking…'
                                : value.length > 0
                                    ? 'Enter ↵ to send · Shift+Enter for new line'
                                    : ''}
                        </p>

                        {/* Send */}
                        <button
                            type="button"
                            onClick={submit}
                            disabled={!canSend}
                            aria-label={disabled ? 'Waiting for response' : 'Send message'}
                            className={cn(
                                'relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl',
                                'select-none transition-all duration-200',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--surface))]',
                                canSend
                                    ? [
                                        'bg-primary text-primary-foreground cursor-pointer',
                                        'shadow-[0_2px_16px_hsl(var(--primary)/0.4)]',
                                        'hover:shadow-[0_4px_20px_hsl(var(--primary)/0.55)] hover:scale-105',
                                        'active:scale-90',
                                    ]
                                    : 'bg-muted/50 text-muted-foreground/30 cursor-not-allowed'
                            )}
                        >
                            {disabled
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                                : <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* Hint bar for empty state */}
            {!value && !disabled && (
                <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 px-1 sm:justify-start"
                    aria-hidden="true">
                    {PLACEHOLDER_HINTS.slice(1).map((h) => (
                        <button
                            key={h}
                            type="button"
                            tabIndex={-1}
                            onClick={() => onSend(h)}
                            className="rounded-lg border border-border/40 bg-surface/60 px-2.5 py-1 text-[11px] text-muted-foreground/50 hover:text-foreground hover:border-primary/30 hover:bg-surface transition-all duration-150"
                        >
                            {h}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
