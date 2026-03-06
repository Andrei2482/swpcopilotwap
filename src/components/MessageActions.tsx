import { RefreshCw, Flag, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface MessageActionsProps {
    messageId: string
    content: string
    variantIndex?: number
    variantTotal?: number
    onReport: () => void
    onRegen: () => void
    onVariantPrev?: () => void
    onVariantNext?: () => void
}

export function MessageActions({
    content,
    variantIndex = 0,
    variantTotal = 1,
    onReport,
    onRegen,
    onVariantPrev,
    onVariantNext,
}: MessageActionsProps) {
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(content)
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
        } catch { }
    }

    const iconBtn = cn(
        'flex h-7 w-7 items-center justify-center rounded-lg',
        'text-muted-foreground/50 hover:text-foreground hover:bg-[hsl(var(--muted)/0.7)]',
        'transition-all duration-150 active:scale-90',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
    )

    return (
        <div
            className="flex items-center gap-0.5 mt-1 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200"
            aria-label="Message actions"
        >
            {/* Variant switcher — only when multiple variants exist */}
            {variantTotal > 1 && (
                <div className="flex items-center gap-0.5 mr-1 rounded-lg border border-border/40 bg-[hsl(var(--surface-raised)/0.8)] px-1 py-0.5">
                    <Tooltip delayDuration={600}>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                onClick={onVariantPrev}
                                disabled={variantIndex === 0}
                                aria-label="Previous variant"
                                className={cn(iconBtn, 'h-5 w-5', variantIndex === 0 && 'opacity-30 pointer-events-none')}
                            >
                                <ChevronLeft className="h-3 w-3" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="text-xs">Previous response</TooltipContent>
                    </Tooltip>

                    <span className="min-w-[28px] text-center text-[10px] font-medium text-muted-foreground select-none tabular-nums">
                        {variantIndex + 1}/{variantTotal}
                    </span>

                    <Tooltip delayDuration={600}>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                onClick={onVariantNext}
                                disabled={variantIndex >= variantTotal - 1}
                                aria-label="Next variant"
                                className={cn(iconBtn, 'h-5 w-5', variantIndex >= variantTotal - 1 && 'opacity-30 pointer-events-none')}
                            >
                                <ChevronRight className="h-3 w-3" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="text-xs">Next response</TooltipContent>
                    </Tooltip>
                </div>
            )}

            {/* Copy */}
            <Tooltip delayDuration={600}>
                <TooltipTrigger asChild>
                    <button type="button" onClick={handleCopy} aria-label="Copy message" className={cn(iconBtn, copied && 'text-primary/70 hover:text-primary')}>
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">{copied ? 'Copied!' : 'Copy'}</TooltipContent>
            </Tooltip>

            {/* Regenerate */}
            <Tooltip delayDuration={600}>
                <TooltipTrigger asChild>
                    <button type="button" onClick={onRegen} aria-label="Regenerate response" className={iconBtn}>
                        <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Regenerate</TooltipContent>
            </Tooltip>

            {/* Report */}
            <Tooltip delayDuration={600}>
                <TooltipTrigger asChild>
                    <button type="button" onClick={onReport} aria-label="Report this response"
                        className={cn(iconBtn, 'hover:text-destructive hover:bg-destructive/10')}>
                        <Flag className="h-3.5 w-3.5" />
                    </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Report</TooltipContent>
            </Tooltip>
        </div>
    )
}
