import { RefreshCw, Flag, Copy, Check, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, BookOpen, Briefcase, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface MessageActionsProps {
    messageId: string
    content: string
    variantIndex?: number
    variantTotal?: number
    onReport: () => void
    onRegen: (mode: string) => void
    onVariantPrev?: () => void
    onVariantNext?: () => void
}

const REGEN_MODES = [
    { value: 'longer', label: 'Longer', icon: ZoomIn, desc: 'Expand with more detail' },
    { value: 'shorter', label: 'Shorter', icon: ZoomOut, desc: 'Make it more concise' },
    { value: 'easier', label: 'Easier', icon: BookOpen, desc: 'Simplify the language' },
    { value: 'professional', label: 'Professional', icon: Briefcase, desc: 'More formal tone' },
    { value: 'casual', label: 'Casual', icon: MessageCircle, desc: 'Conversational tone' },
]

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

    const btn = cn(
        'flex h-7 w-7 items-center justify-center rounded-lg',
        'text-muted-foreground/50 hover:text-foreground hover:bg-muted/60',
        'transition-all duration-150 active:scale-90',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
    )

    return (
        <div
            className="flex items-center gap-0.5 mt-1.5 opacity-0 group-hover:opacity-100 translate-y-0.5 group-hover:translate-y-0 transition-all duration-200"
            aria-label="Message actions"
        >
            {/* Variant nav */}
            {variantTotal > 1 && (
                <div className="flex items-center gap-0.5 mr-1.5 rounded-lg border border-border/40 bg-surface/90 backdrop-blur-sm px-1 py-0.5">
                    <button
                        type="button"
                        onClick={onVariantPrev}
                        disabled={variantIndex === 0}
                        aria-label="Previous variant"
                        className={cn(btn, 'h-5 w-5', variantIndex === 0 && 'opacity-20 pointer-events-none')}
                    >
                        <ChevronLeft className="h-3 w-3" />
                    </button>
                    <span className="min-w-[28px] text-center text-[10px] font-medium text-muted-foreground select-none tabular-nums">
                        {variantIndex + 1}/{variantTotal}
                    </span>
                    <button
                        type="button"
                        onClick={onVariantNext}
                        disabled={variantIndex >= variantTotal - 1}
                        aria-label="Next variant"
                        className={cn(btn, 'h-5 w-5', variantIndex >= variantTotal - 1 && 'opacity-20 pointer-events-none')}
                    >
                        <ChevronRight className="h-3 w-3" />
                    </button>
                </div>
            )}

            {/* Copy */}
            <Tooltip delayDuration={700}>
                <TooltipTrigger asChild>
                    <button type="button" onClick={handleCopy} aria-label="Copy" className={cn(btn, copied && 'text-primary/70')}>
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">{copied ? 'Copied!' : 'Copy'}</TooltipContent>
            </Tooltip>

            {/* Regenerate dropdown */}
            <DropdownMenu>
                <Tooltip delayDuration={700}>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <button type="button" aria-label="Regenerate response" className={btn}>
                                <RefreshCw className="h-3.5 w-3.5" />
                            </button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">Regenerate</TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="start" side="top" className="w-48">
                    <DropdownMenuLabel className="text-[11px]">Regenerate as</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {REGEN_MODES.map(({ value, label, icon: Icon, desc }) => (
                        <DropdownMenuItem
                            key={value}
                            onClick={() => onRegen(value)}
                            className="gap-2.5"
                        >
                            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                            <div className="flex flex-col">
                                <span className="text-[13px] leading-none">{label}</span>
                                <span className="text-[10px] text-muted-foreground/50 mt-0.5 leading-none">{desc}</span>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Report */}
            <Tooltip delayDuration={700}>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onClick={onReport}
                        aria-label="Report this response"
                        className={cn(btn, 'hover:text-destructive hover:bg-destructive/8')}
                    >
                        <Flag className="h-3.5 w-3.5" />
                    </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Report</TooltipContent>
            </Tooltip>
        </div>
    )
}
