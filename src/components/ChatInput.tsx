import { useState, useRef, useCallback, type KeyboardEvent } from 'react'
import { ArrowUp, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
    onSend: (content: string) => void
    disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [value, setValue] = useState('')
    const [focused, setFocused] = useState(false)
    const ref = useRef<HTMLTextAreaElement>(null)

    const resize = useCallback(() => {
        const el = ref.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = Math.min(el.scrollHeight, 160) + 'px'
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
    const ringColor = canSend
        ? 'hsl(var(--primary) / 0.45)'
        : focused
            ? 'hsl(var(--border) / 0.65)'
            : 'hsl(var(--border) / 0.35)'

    return (
        <div className="shrink-0 pb-5 pt-2 px-4 sm:px-6" role="region" aria-label="Message input">
            {/* Outer glow ring */}
            <div
                className="rounded-2xl transition-[box-shadow] duration-300"
                style={{ boxShadow: canSend ? `0 0 0 1.5px ${ringColor}, 0 0 32px hsl(var(--primary) / 0.09)` : `0 0 0 1px ${ringColor}` }}
            >
                <div
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                        background: 'hsl(var(--surface))',
                        boxShadow: '0 2px 24px hsl(222 28% 3% / 0.20)',
                    }}
                >
                    {/* Accent line — top, only when canSend */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-px pointer-events-none transition-opacity duration-300"
                        style={{
                            background: 'linear-gradient(90deg, transparent 5%, hsl(var(--primary) / 0.55) 50%, transparent 95%)',
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
                            'px-4 pt-4 pb-2 text-[13.5px] leading-relaxed text-foreground',
                            'placeholder:text-muted-foreground/25',
                            'focus:outline-none max-h-40',
                            disabled && 'opacity-40 cursor-not-allowed'
                        )}
                        style={{ minHeight: 24 }}
                    />

                    {/* Bottom row */}
                    <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-1">
                        <span
                            className="text-[10px] leading-none text-muted-foreground/18 select-none transition-opacity duration-200"
                            aria-live="polite"
                        >
                            {disabled ? 'Thinking…' : canSend ? '↵ Send  ·  ⇧↵ New line' : ''}
                        </span>

                        <button
                            type="button"
                            onClick={submit}
                            disabled={!canSend}
                            aria-label={disabled ? 'Waiting for response' : 'Send message'}
                            className={cn(
                                'h-8 w-8 flex shrink-0 items-center justify-center rounded-xl',
                                'transition-all duration-200',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--surface))]',
                                canSend
                                    ? 'bg-primary text-primary-foreground cursor-pointer active:scale-90 hover:scale-[1.07]'
                                    : 'bg-muted/35 text-muted-foreground/18 cursor-not-allowed'
                            )}
                            style={canSend ? { boxShadow: '0 2px 12px hsl(var(--primary) / 0.35)' } : undefined}
                        >
                            {disabled
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                                : <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
