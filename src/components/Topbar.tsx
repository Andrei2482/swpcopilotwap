import { Settings, History, Link2, LogOut, PanelLeftClose, PanelLeftOpen, Sparkles } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface TopbarProps {
    onToggleSidebar: () => void
    sidebarCollapsed: boolean
}

export function Topbar({ onToggleSidebar, sidebarCollapsed }: TopbarProps) {
    const navigate = useNavigate()

    return (
        <header className="glass-topbar flex items-center justify-between h-14 px-4 shrink-0 z-10">
            {/* Left — sidebar toggle + brand */}
            <div className="flex items-center gap-3">
                <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={onToggleSidebar}
                            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            aria-expanded={!sidebarCollapsed}
                        >
                            {sidebarCollapsed
                                ? <PanelLeftOpen className="h-4 w-4" />
                                : <PanelLeftClose className="h-4 w-4" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        {sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    </TooltipContent>
                </Tooltip>

                {/* Wordmark */}
                <div className="flex items-center gap-1.5 select-none">
                    <Sparkles className="h-4 w-4 text-primary opacity-80" aria-hidden="true" />
                    <span className="text-sm font-semibold tracking-tight text-foreground">
                        Copilot
                    </span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/15 text-primary leading-none">
                        Beta
                    </span>
                </div>
            </div>

            {/* Right — profile avatar */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="rounded-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-opacity hover:opacity-90 active:scale-95"
                        aria-label="Profile menu"
                    >
                        <Avatar className="h-8 w-8 ring-2 ring-border">
                            <AvatarImage src="" alt="User avatar" />
                            <AvatarFallback className="text-xs font-semibold">SP</AvatarFallback>
                        </Avatar>
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuLabel className="text-xs">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                        <Settings className="h-4 w-4" />
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/history')}>
                        <History className="h-4 w-4" />
                        History
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link2 className="h-4 w-4" />
                        Connections
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <LogOut className="h-4 w-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
