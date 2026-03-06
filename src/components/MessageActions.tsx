import { useState } from 'react'
import { RefreshCw, ZoomIn, ZoomOut, AlignJustify, Wand2, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const REGEN_OPTIONS = [
    { key: 'longer', label: 'Longer', icon: ZoomIn },
    { key: 'shorter', label: 'Shorter', icon: ZoomOut },
    { key: 'concise', label: 'More concise', icon: AlignJustify },
    { key: 'refine', label: 'Refine', icon: Wand2 },
] as const

interface MessageActionsProps {
    messageId: string
    onReport: () => void
    onRegen: (mode: string) => void
}

export function MessageActions({ messageId: _messageId, onReport, onRegen }: MessageActionsProps) {
    const [visible, setVisible] = useState(false)

    return (
        <div
            className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            style={{ opacity: undefined }} /* controlled by parent group hover */
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {/* Regenerate dropdown */}
            <DropdownMenu>
                <Tooltip delayDuration={400}>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Regenerate response"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Regenerate</TooltipContent>
                </Tooltip>

                <DropdownMenuContent align="start" className="w-40">
                    {REGEN_OPTIONS.map(({ key, label, icon: Icon }) => (
                        <DropdownMenuItem key={key} onClick={() => onRegen(key)}>
                            <Icon className="h-3.5 w-3.5" />
                            {label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Report button */}
            <Tooltip delayDuration={400}>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Report message"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={onReport}
                    >
                        <Flag className="h-3.5 w-3.5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Report</TooltipContent>
            </Tooltip>

            {/* Suppress unused state warning: visible is used for future animation */}
            <span aria-hidden className={cn('hidden', visible && 'invisible')} />
        </div>
    )
}
