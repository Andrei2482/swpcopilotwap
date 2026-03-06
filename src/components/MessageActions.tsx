import { RefreshCw, ZoomIn, ZoomOut, AlignJustify, Wand2, Flag, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const REGEN_OPTIONS = [
    { key: 'longer', label: 'Make it longer', icon: ZoomIn },
    { key: 'shorter', label: 'Make it shorter', icon: ZoomOut },
    { key: 'concise', label: 'More concise', icon: AlignJustify },
    { key: 'refine', label: 'Refine wording', icon: Wand2 },
] as const

interface MessageActionsProps {
    messageId: string
    content: string
    onReport: () => void
    onRegen: (mode: string) => void
}

export function MessageActions({ messageId: _messageId, content, onReport, onRegen }: MessageActionsProps) {
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(content)
            setCopied(true)
            setTimeout(() => setCopied(false), 1600)
        } catch { }
    }

    const btnCls = cn(
        'h-7 w-7 rounded-lg text-muted-foreground/60',
        'hover:text-foreground hover:bg-muted/60',
        'transition-all duration-150 active:scale-90',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
    )

    return (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 translate-y-0.5 group-hover:translate-y-0 transition-all duration-200 mt-0.5">
            {/* Copy */}
            <Tooltip delayDuration={500}>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onClick={handleCopy}
                        aria-label="Copy message"
                        className={cn(btnCls, copied && 'text-primary/80 hover:text-primary')}
                    >
                        {copied
                            ? <Check className="h-3.5 w-3.5" />
                            : <Copy className="h-3.5 w-3.5" />}
                    </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">{copied ? 'Copied!' : 'Copy'}</TooltipContent>
            </Tooltip>

            {/* Regenerate */}
            <DropdownMenu>
                <Tooltip delayDuration={500}>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                aria-label="Regenerate response"
                                className={btnCls}
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                            </button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">Regenerate</TooltipContent>
                </Tooltip>

                <DropdownMenuContent align="start" sideOffset={6} className="w-44">
                    <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
                        Regenerate as
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {REGEN_OPTIONS.map(({ key, label, icon: Icon }) => (
                        <DropdownMenuItem
                            key={key}
                            onClick={() => onRegen(key)}
                            className="gap-2 text-sm"
                        >
                            <Icon className="h-3.5 w-3.5 text-muted-foreground/70" />
                            {label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Report */}
            <Tooltip delayDuration={500}>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onClick={onReport}
                        aria-label="Report this response"
                        className={cn(btnCls, 'hover:text-destructive hover:bg-destructive/10')}
                    >
                        <Flag className="h-3.5 w-3.5" />
                    </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Report</TooltipContent>
            </Tooltip>
        </div>
    )
}
