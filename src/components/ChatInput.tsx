import { useState, useRef, useCallback, type KeyboardEvent } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
    onSend: (content: string) => void
    disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [value, setValue] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const resize = useCallback(() => {
        const el = textareaRef.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = Math.min(el.scrollHeight, 160) + 'px'
    }, [])

    function submit() {
        const trimmed = value.trim()
        if (!trimmed || disabled) return
        onSend(trimmed)
        setValue('')
        if (textareaRef.current) textareaRef.current.style.height = 'auto'
    }

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit()
        }
    }

    const canSend = value.trim().length > 0 && !disabled

    return (
        <div className="shrink-0 px-4 pb-5 pt-2">
            {/* Outer glow wrapper */}
            <div className={cn(
                'relative rounded-2xl transition-all duration-300',
                canSend
                    ? 'shadow-[0_0_0_1px_hsl(var(--primary)/0.5),0_0_24px_hsl(var(--primary)/0.12)]'
                    : 'shadow-[0_0_0_1px_hsl(var(--border)/0.8)]',
                'focus-within:shadow-[0_0_0_1.5px_hsl(var(--primary)/0.7),0_0_32px_hsl(var(--primary)/0.18)]'
            )}>
                {/* Glass container */}
                <div className="relative flex flex-col gap-2 rounded-2xl bg-[hsl(var(--surface))] px-4 pt-3.5 pb-3">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => { setValue(e.target.value); resize() }}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        placeholder="Ask Copilot anything about Swordigo…"
                        disabled={disabled}
                        aria-label="Chat message input"
                        aria-multiline="true"
                        className={cn(
                            'w-full resize-none bg-transparent text-sm text-foreground leading-relaxed',
                            'placeholder:text-muted-foreground/40 focus:outline-none',
                            'max-h-[160px] overflow-y-auto scrollbar-thin',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            'transition-all duration-200'
                        )}
                        style={{ minHeight: '24px' }}
                    />

                    {/* Bottom row: hint + send */}
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] text-muted-foreground/35 select-none leading-none">
                            {disabled ? 'Copilot is thinking…' : 'Enter to send · Shift+Enter for new line'}
                        </p>

                        <button
                            type="button"
                            onClick={submit}
                            disabled={!canSend}
                            aria-label="Send message"
                            className={cn(
                                'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl',
                                'transition-all duration-200 active:scale-90',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                                canSend
                                    ? 'bg-primary text-primary-foreground shadow-[0_2px_14px_hsl(var(--primary)/0.45)] hover:shadow-[0_2px_20px_hsl(var(--primary)/0.6)] hover:scale-105'
                                    : 'bg-muted/60 text-muted-foreground/40 cursor-not-allowed'
                            )}
                        >
                            <ArrowUp className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
