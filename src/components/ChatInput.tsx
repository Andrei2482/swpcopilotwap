import { useState, useRef, useCallback } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
    onSend: (content: string) => void
    disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [value, setValue] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const resizeTextarea = useCallback(() => {
        const el = textareaRef.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = Math.min(el.scrollHeight, 180) + 'px'
    }, [])

    function handleSend() {
        const trimmed = value.trim()
        if (!trimmed || disabled) return
        onSend(trimmed)
        setValue('')
        // Reset height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const canSend = value.trim().length > 0 && !disabled

    return (
        <div className="shrink-0 px-4 pb-4 pt-2">
            <div
                className={cn(
                    'relative flex items-end gap-2 rounded-2xl border border-border bg-surface px-4 py-3',
                    'shadow-[0_4px_24px_hsl(222_25%_4%/0.4),0_1px_3px_hsl(222_25%_4%/0.3)]',
                    'transition-all duration-150',
                    'focus-within:border-ring/50 focus-within:shadow-[0_4px_24px_hsl(var(--primary)/0.15),0_1px_3px_hsl(222_25%_4%/0.3)]'
                )}
            >
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value)
                        resizeTextarea()
                    }}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="Ask Copilot anything…"
                    disabled={disabled}
                    aria-label="Chat message input"
                    aria-multiline="true"
                    className={cn(
                        'flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50',
                        'focus:outline-none leading-relaxed max-h-[180px] overflow-y-auto',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'scrollbar-thin'
                    )}
                    style={{ minHeight: '22px' }}
                />

                {/* Send button */}
                <button
                    type="button"
                    onClick={handleSend}
                    disabled={!canSend}
                    aria-label="Send message"
                    className={cn(
                        'shrink-0 h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-150',
                        canSend
                            ? 'bg-primary text-primary-foreground shadow-[0_2px_10px_hsl(var(--primary)/0.4)] hover:bg-primary/90 active:scale-95'
                            : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-surface'
                    )}
                >
                    <ArrowUp className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Send</span>
                </button>
            </div>

            <p className="mt-2 text-center text-[10px] text-muted-foreground/40 select-none">
                Copilot can make mistakes. Verify important information.
            </p>
        </div>
    )
}
