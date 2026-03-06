import { useState, useRef, useCallback, type KeyboardEvent } from 'react'
import { ArrowUp, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
    onSend: (content: string) => void
    disabled?: boolean
}

const CHIPS = [
    'How do I get the fire sword?',
    'What are the secret areas?',
    'Best mods for beginners?',
]

export function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [value, setValue] = useState('')
    const [focused, setFocused] = useState(false)
    const ref = useRef<HTMLTextAreaElement>(null)

    const resize = useCallback(() => {
        const el = ref.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = Math.min(el.scrollHeight, 168) + 'px'
    }, [])

    function submit() {
        const t = value.trim()
        if (!t || disabled) return
        onSend(t)
        setValue('')
        if (ref.current) { ref.current.style.height = 'auto'; ref.current.focus() }
    }

    function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
    }

    const canSend = value.trim().length > 0 && !disabled
    const isActive = focused || canSend

    return (
        <div className="shrink-0 pb-4 pt-1.5 px-3 sm:px-5" role="region" aria-label="Message input">

            {/* ── Outer: glow ring ── */}
            <div
                className="rounded-2xl transition-shadow duration-300"
                style={{
                    boxShadow: canSend
                        ? '0 0 0 1.5px hsl(var(--primary)/0.5), 0 0 36px hsl(var(--primary)/0.10)'
                        : isActive
                            ? '0 0 0 1.5px hsl(var(--border)/0.7)'
                            : '0 0 0 1px hsl(var(--border)/0.4)',
                }}
            >
                {/* ── Card ── */}
                <div
                    className="relative rounded-2xl overflow-hidden flex flex-col"
                    style={{ background: 'hsl(var(--surface))', boxShadow: '0 2px 20px hsl(222 25% 4%/0.18)' }}
                >
                    {/* Gradient top accent — only when can-send */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-[1px] pointer-events-none transition-opacity duration-300"
                        style={{
                            background: 'linear-gradient(90deg, transparent, hsl(var(--primary)/0.6), transparent)',
                            opacity: canSend ? 1 : 0,
                        }}
                    />

                    {/* Textarea */}
                    <label className="sr-only" htmlFor="chat-input">Message</label>
                    <textarea
                        ref={ref}
                        id="chat-input"
                        value={value}
                        rows={1}
                        disabled={disabled}
                        onChange={e => { setValue(e.target.value); resize() }}
                        onKeyDown={onKeyDown}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder="Ask Copilot anything about Swordigo…"
                        aria-label="Type your message"
                        aria-multiline="true"
                        aria-disabled={disabled}
                        className={cn(
                            'w-full resize-none bg-transparent',
                            'px-4 pt-3.5 pb-2 text-sm leading-relaxed text-foreground',
                            'placeholder:text-muted-foreground/28',
                            'focus:outline-none max-h-44',
                            'transition-opacity duration-150',
                            disabled && 'opacity-40 cursor-not-allowed'
                        )}
                        style={{ minHeight: 28 }}
                    />

                    {/* Bottom bar */}
                    <div className="flex items-center justify-between gap-2 px-3 pb-2.5 pt-0.5">
                        {/* Hint */}
                        <p
                            className="text-[10px] text-muted-foreground/22 select-none transition-opacity duration-200 leading-none"
                            aria-live="polite"
                        >
                            {disabled ? 'Thinking…' : canSend ? '↵ send  ·  ⇧↵ new line' : ''}
                        </p>

                        {/* Send button */}
                        <button
                            type="button"
                            onClick={submit}
                            disabled={!canSend}
                            aria-label={disabled ? 'Waiting for response' : 'Send message'}
                            className={cn(
                                'relative h-8 w-8 shrink-0 flex items-center justify-center rounded-xl select-none',
                                'transition-all duration-200',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                                'focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--surface))]',
                                canSend
                                    ? [
                                        'bg-primary text-primary-foreground cursor-pointer',
                                        'shadow-[0_2px_14px_hsl(var(--primary)/0.38)]',
                                        'hover:scale-[1.06] hover:shadow-[0_4px_20px_hsl(var(--primary)/0.5)]',
                                        'active:scale-90',
                                    ]
                                    : 'bg-muted/40 text-muted-foreground/20 cursor-not-allowed'
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

            {/* ── Quick chips ── */}
            {!value && !disabled && (
                <div className="mt-2 flex flex-wrap gap-1.5" aria-hidden="true">
                    {CHIPS.map(c => (
                        <button
                            key={c}
                            type="button"
                            tabIndex={-1}
                            onClick={() => onSend(c)}
                            className={cn(
                                'rounded-lg border border-border/25 px-2.5 py-1',
                                'text-[11px] text-muted-foreground/38',
                                'hover:text-foreground hover:border-primary/20 hover:bg-muted/20',
                                'transition-all duration-150'
                            )}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
