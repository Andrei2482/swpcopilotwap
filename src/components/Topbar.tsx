import { Settings, History, Link2, LogOut, PanelLeftClose, PanelLeftOpen, Sparkles, Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

interface TopbarProps {
    onToggleSidebar: () => void
    sidebarCollapsed: boolean
}

export function Topbar({ onToggleSidebar, sidebarCollapsed }: TopbarProps) {
    const navigate = useNavigate()
    const { theme, setTheme } = useTheme()
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    const iconBtn = cn(
        'flex h-8 w-8 items-center justify-center rounded-xl',
        'text-muted-foreground hover:text-foreground hover:bg-muted/50',
        'active:scale-90 transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
    )

    return (
        <header
            className="glass-topbar flex items-center justify-between h-13 px-3 sm:px-4 shrink-0 z-20"
            style={{ height: '52px' }}
            role="banner"
        >
            {/* ── Left ── */}
            <div className="flex items-center gap-1.5">
                <Tooltip delayDuration={400}>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            onClick={onToggleSidebar}
                            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            aria-expanded={!sidebarCollapsed}
                            aria-controls="sidebar"
                            className={iconBtn}
                        >
                            {sidebarCollapsed
                                ? <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
                                : <PanelLeftClose className="h-4 w-4" aria-hidden="true" />}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={8}>
                        {sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    </TooltipContent>
                </Tooltip>

                {/* Brand */}
                <div
                    className="flex items-center gap-2 select-none pl-1"
                    aria-label="SwordigoPlus Copilot"
                >
                    <div
                        className="h-[28px] w-[28px] flex items-center justify-center rounded-[10px]"
                        style={{
                            background: 'hsl(var(--primary) / 0.10)',
                            border: '1px solid hsl(var(--primary) / 0.18)',
                        }}
                    >
                        <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    </div>
                    <div className="hidden sm:flex items-baseline gap-1.5">
                        <span className="text-[14px] font-semibold tracking-tight text-foreground leading-none">
                            Copilot
                        </span>
                        <span
                            className="text-[9.5px] font-bold leading-none px-1.5 py-[3px] rounded-full"
                            style={{
                                background: 'hsl(var(--primary) / 0.12)',
                                color: 'hsl(var(--primary))',
                                letterSpacing: '0.04em',
                            }}
                        >
                            BETA
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Right ── */}
            <div className="flex items-center gap-1">
                {/* Theme toggle */}
                <Tooltip delayDuration={400}>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            onClick={() => setTheme(isDark ? 'light' : 'dark')}
                            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                            className={iconBtn}
                        >
                            {isDark
                                ? <Sun className="h-[15px] w-[15px]" aria-hidden="true" />
                                : <Moon className="h-[15px] w-[15px]" aria-hidden="true" />}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={8}>
                        {isDark ? 'Light mode' : 'Dark mode'}
                    </TooltipContent>
                </Tooltip>

                {/* Profile dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            aria-label="Open profile menu"
                            aria-haspopup="menu"
                            className={cn(
                                'ml-0.5 rounded-full outline-none transition-all duration-150',
                                'ring-2 ring-transparent hover:ring-primary/35',
                                'focus-visible:ring-primary active:scale-95'
                            )}
                        >
                            <Avatar className="h-[30px] w-[30px]">
                                <AvatarImage src="" alt="Your profile" />
                                <AvatarFallback
                                    className="text-[11px] font-bold"
                                    style={{
                                        background: 'hsl(var(--primary) / 0.14)',
                                        color: 'hsl(var(--primary))',
                                    }}
                                >
                                    SP
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" sideOffset={10} className="w-52">
                        <DropdownMenuLabel>
                            <div className="flex items-center gap-2.5 py-0.5">
                                <Avatar className="h-8 w-8 shrink-0">
                                    <AvatarFallback
                                        className="text-xs font-bold"
                                        style={{ background: 'hsl(var(--primary) / 0.14)', color: 'hsl(var(--primary))' }}
                                    >
                                        SP
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[13px] font-semibold truncate text-foreground">My Account</span>
                                    <span className="text-[11px] text-muted-foreground/55 font-normal truncate">demo@swordigo.plus</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/settings')} className="gap-2.5 text-[13px]">
                            <Settings className="h-3.5 w-3.5" aria-hidden="true" /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2.5 text-[13px]">
                            <History className="h-3.5 w-3.5" aria-hidden="true" /> History
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2.5 text-[13px]">
                            <Link2 className="h-3.5 w-3.5" aria-hidden="true" /> Connections
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2.5 text-[13px] text-destructive focus:text-destructive focus:bg-destructive/8">
                            <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
