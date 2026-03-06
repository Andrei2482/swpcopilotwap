import { useState, useRef, useCallback, type KeyboardEvent } from 'react'
import { ArrowUp, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
    onSend: (content: string) => void
    disabled?: boolean
}

const CHIPS = [
    'How do I beat the final boss?',
    'Best mods to install?',
    'What are the secret areas?',
]

export function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [value, setValue] = useState('')
    const [focused, setFocused] = useState(false)
    const ref = useRef<HTMLTextAreaElement>(null)

    const resize = useCallback(() => {
        const el = ref.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = Math.min(el.scrollHeight, 176) + 'px'
    }, [])

    function submit() {
        const t = value.trim()
        if (!t || disabled) return
        onSend(t)
        setValue('')
        if (ref.current) { ref.current.style.height = 'auto'; ref.current.focus() }
    }

    function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
    }

    const canSend = value.trim().length > 0 && !disabled
    const hasFocus = focused || canSend

    return (
        <div className="shrink-0 pb-4 pt-2 px-3 sm:px-6" role="region" aria-label="Message input">
            {/* Outer ring — glow when active */}
            <div
                className="rounded-2xl transition-shadow duration-300"
                style={{
                    boxShadow: canSend
                        ? '0 0 0 1.5px hsl(var(--primary)/0.55), 0 0 32px hsl(var(--primary)/0.12)'
                        : hasFocus
                            ? '0 0 0 1.5px hsl(var(--border)/0.8)'
                            : '0 0 0 1px hsl(var(--border)/0.45)',
                }}
            >
                {/* Card */}
                <div className="relative rounded-2xl bg-[hsl(var(--surface))] overflow-hidden"
                    style={{ boxShadow: '0 2px 16px hsl(222 25% 4%/0.2)' }}>

                    {/* Gradient top line — visible when can send */}
                    <div
                        className="absolute inset-x-0 top-0 h-[1.5px] transition-opacity duration-300 pointer-events-none"
                        style={{
                            background: 'linear-gradient(90deg, transparent, hsl(var(--primary)/0.5), transparent)',
                            opacity: canSend ? 1 : 0,
                        }}
                        aria-hidden="true"
                    />

                    {/* Textarea */}
                    <textarea
                        ref={ref}
                        id="chat-input"
                        value={value}
                        rows={1}
                        onChange={e => { setValue(e.target.value); resize() }}
                        onKeyDown={onKey}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        disabled={disabled}
                        placeholder={disabled ? '' : 'Ask Copilot anything about Swordigo…'}
                        aria-label="Message"
                        aria-multiline="true"
                        aria-disabled={disabled}
                        className={cn(
                            'w-full resize-none bg-transparent',
                            'px-4 pt-3.5 pb-2 text-sm leading-relaxed text-foreground',
                            'placeholder:text-muted-foreground/30',
                            'focus:outline-none max-h-44',
                            'transition-opacity duration-150',
                            disabled && 'opacity-40 cursor-not-allowed'
                        )}
                        style={{ minHeight: 28 }}
                    />

                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-3 pb-2.5 pt-0.5">
                        <p className="text-[10px] text-muted-foreground/25 select-none" aria-live="polite">
                            {disabled
                                ? 'Thinking…'
                                : value.length > 0
                                    ? 'Enter ↵ send  ·  Shift+Enter new line'
                                    : ''}
                        </p>

                        <button
                            type="button"
                            onClick={submit}
                            disabled={!canSend}
                            aria-label={disabled ? 'Waiting…' : 'Send message'}
                            className={cn(
                                'relative h-8 w-8 flex items-center justify-center rounded-xl select-none',
                                'transition-all duration-200',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--surface))]',
                                canSend
                                    ? 'bg-primary text-primary-foreground hover:scale-105 hover:brightness-110 active:scale-90 shadow-[0_2px_12px_hsl(var(--primary)/0.35)]'
                                    : 'bg-muted/50 text-muted-foreground/20 cursor-not-allowed'
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

            {/* Quick chips */}
            {!value && !disabled && (
                <div className="mt-2 flex flex-wrap gap-1.5 px-0.5" aria-hidden="true">
                    {CHIPS.map(c => (
                        <button
                            key={c}
                            type="button"
                            tabIndex={-1}
                            onClick={() => onSend(c)}
                            className={cn(
                                'rounded-lg border border-border/35 bg-transparent px-2.5 py-1',
                                'text-[11px] text-muted-foreground/40',
                                'hover:text-foreground hover:border-primary/25 hover:bg-muted/25',
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
