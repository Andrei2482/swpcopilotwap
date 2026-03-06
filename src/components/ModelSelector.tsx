import { useState } from 'react'
import { Sparkles, Gauge, Code2, Paintbrush, Crosshair, ChevronDown, Check } from 'lucide-react'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export type ModelFlavor = 'smart' | 'balanced' | 'code' | 'creative' | 'precise'

interface ModelOption {
    value: ModelFlavor
    label: string
    badge?: string
    desc: string
    icon: React.ComponentType<{ className?: string }>
}

const MODELS: ModelOption[] = [
    { value: 'smart', label: 'Smart', badge: 'Default', icon: Sparkles, desc: 'Recommended · auto-detects' },
    { value: 'balanced', label: 'Balanced', icon: Gauge, desc: 'For most purposes' },
    { value: 'code', label: 'Code', icon: Code2, desc: 'Programming & technical' },
    { value: 'creative', label: 'Creative', icon: Paintbrush, desc: 'Stories & creative writing' },
    { value: 'precise', label: 'Precise', icon: Crosshair, desc: 'Accurate & fact-focused' },
]

interface ModelSelectorProps {
    value: ModelFlavor
    onChange: (v: ModelFlavor) => void
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
    const current = MODELS.find(m => m.value === value) ?? MODELS[0]
    const Icon = current.icon

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label={`Current model: ${current.label}. Change model`}
                    aria-haspopup="menu"
                    className={cn(
                        'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11.5px] font-medium',
                        'border text-muted-foreground/60 hover:text-foreground',
                        'hover:border-border/50 hover:bg-muted/20',
                        'transition-all duration-150 active:scale-95',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                    )}
                    style={{ borderColor: 'hsl(var(--border) / 0.30)' }}
                >
                    <Icon className="h-3 w-3 shrink-0 text-primary/60" aria-hidden="true" />
                    <span>{current.label}</span>
                    <ChevronDown className="h-2.5 w-2.5 shrink-0 opacity-50" aria-hidden="true" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" sideOffset={6} className="w-52">
                <DropdownMenuLabel>Model flavor</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {MODELS.map(m => {
                    const MIcon = m.icon
                    const isActive = m.value === value
                    return (
                        <DropdownMenuItem
                            key={m.value}
                            onClick={() => onChange(m.value)}
                            className={cn('gap-2.5 pr-2', isActive && 'text-primary')}
                        >
                            <MIcon className={cn('h-3.5 w-3.5 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground/50')} aria-hidden="true" />
                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[13px] leading-none">{m.label}</span>
                                    {m.badge && (
                                        <span className="text-[9.5px] font-bold uppercase tracking-wide rounded-full px-1.5 py-0.5 leading-none"
                                            style={{ background: 'hsl(var(--primary)/0.12)', color: 'hsl(var(--primary))' }}>
                                            {m.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[11px] text-muted-foreground/45 mt-0.5 leading-none truncate">{m.desc}</span>
                            </div>
                            {isActive && <Check className="ml-auto h-3 w-3 shrink-0 text-primary" aria-hidden="true" />}
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
