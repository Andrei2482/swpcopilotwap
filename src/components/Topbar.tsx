import { Settings, History, Link2, LogOut, PanelLeftClose, PanelLeftOpen, Sparkles, Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
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

    return (
        <header
            className="glass-topbar flex items-center justify-between h-12 sm:h-14 px-3 sm:px-4 shrink-0 z-20"
            role="banner"
        >
            {/* Left — sidebar toggle + brand */}
            <div className="flex items-center gap-2 sm:gap-3">
                <Tooltip delayDuration={400}>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            onClick={onToggleSidebar}
                            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            aria-expanded={!sidebarCollapsed}
                            aria-controls="sidebar"
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-xl',
                                'text-muted-foreground hover:text-foreground hover:bg-muted/60',
                                'transition-all duration-150 active:scale-90',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                            )}
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

                {/* Wordmark */}
                <div className="flex items-center gap-2 select-none" aria-label="SwordigoPlus Copilot">
                    <div className="h-7 w-7 rounded-xl bg-primary/12 border border-primary/20 flex items-center justify-center">
                        <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    </div>
                    <span className="hidden sm:block text-sm font-semibold tracking-tight text-foreground">
                        Copilot
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary leading-none">
                        Beta
                    </span>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-1.5">
                {/* Quick theme toggle */}
                <Tooltip delayDuration={400}>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            onClick={() => setTheme(isDark ? 'light' : 'dark')}
                            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-xl',
                                'text-muted-foreground hover:text-foreground hover:bg-muted/60',
                                'transition-all duration-150 active:scale-90',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                            )}
                        >
                            {isDark
                                ? <Sun className="h-4 w-4" aria-hidden="true" />
                                : <Moon className="h-4 w-4" aria-hidden="true" />}
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
                                'rounded-full outline-none transition-all duration-150',
                                'ring-2 ring-transparent hover:ring-primary/40 focus-visible:ring-primary',
                                'active:scale-95'
                            )}
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="" alt="Your profile" />
                                <AvatarFallback className="text-xs font-bold bg-primary/20 text-primary">SP</AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" sideOffset={10} className="w-48">
                        <DropdownMenuLabel>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-semibold">My Account</span>
                                <span className="text-xs text-muted-foreground/60 font-normal">demo@swordigo.plus</span>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/settings')} className="gap-2.5">
                            <Settings className="h-3.5 w-3.5" aria-hidden="true" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/history')} className="gap-2.5">
                            <History className="h-3.5 w-3.5" aria-hidden="true" />
                            History
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2.5">
                            <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                            Connections
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2.5 text-destructive focus:text-destructive focus:bg-destructive/10">
                            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
