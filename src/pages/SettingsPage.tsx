import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Trash2, Download, Moon, Sun, Monitor } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import type { AccentColor, Theme } from '@/types'

/* ── Accent colour options ──────────────────────────────────────────────── */
const ACCENT_OPTIONS: { value: AccentColor; label: string; hex: string }[] = [
    { value: 'purple', label: 'Purple', hex: '#8b5cf6' },
    { value: 'blue', label: 'Blue', hex: '#3b82f6' },
    { value: 'green', label: 'Green', hex: '#22c55e' },
    { value: 'red', label: 'Red', hex: '#ef4444' },
    { value: 'pink', label: 'Pink', hex: '#ec4899' },
    { value: 'yellow', label: 'Yellow', hex: '#eab308' },
]

/* ── Theme presets ──────────────────────────────────────────────────────── */
const THEME_OPTIONS: { value: Theme; label: string; icon: typeof Moon }[] = [
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'system', label: 'System', icon: Monitor },
]

/* ── Layout helpers ─────────────────────────────────────────────────────── */
function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section aria-labelledby={`section-${title.toLowerCase()}`} className="mb-6">
            <h2 id={`section-${title.toLowerCase()}`}
                className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 select-none">
                {title}
            </h2>
            <div className="rounded-2xl border border-border/50 bg-[hsl(var(--surface))] divide-y divide-border/40 overflow-hidden shadow-sm">
                {children}
            </div>
        </section>
    )
}

function Row({ label, description, children }: { label: string; description?: string; children: ReactNode }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground leading-snug">{label}</p>
                {description && <p className="mt-0.5 text-xs text-muted-foreground/70 leading-relaxed">{description}</p>}
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    )
}

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function SettingsPage() {
    const { theme, setTheme, accent, setAccent } = useTheme()
    const [saveHistory, setSaveHistory] = useState(true)

    return (
        <TooltipProvider>
            <div className="h-full flex flex-col overflow-hidden bg-background">
                {/* Header */}
                <header className="glass-topbar flex items-center gap-3 h-14 px-4 shrink-0 z-10" role="banner">
                    <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                            <Link
                                to="/"
                                aria-label="Back to Copilot"
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-xl',
                                    'text-muted-foreground hover:text-foreground hover:bg-muted/60',
                                    'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                                )}
                            >
                                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Back to Copilot</TooltipContent>
                    </Tooltip>
                    <h1 className="text-sm font-semibold text-foreground">Settings</h1>
                </header>

                <ScrollArea className="flex-1">
                    <main className="mx-auto max-w-xl px-4 py-8" aria-label="Settings">

                        {/* ── Appearance ───────────────────────────────── */}
                        <Section title="Appearance">
                            {/* Theme */}
                            <Row label="Theme" description="Controls the color scheme of the interface.">
                                <div className="flex items-center gap-1 rounded-xl border border-border/50 bg-muted/30 p-1" role="radiogroup" aria-label="Theme">
                                    {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                                        <button
                                            key={value}
                                            type="button"
                                            role="radio"
                                            aria-checked={theme === value}
                                            onClick={() => setTheme(value)}
                                            className={cn(
                                                'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150',
                                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                                                theme === value
                                                    ? 'bg-background text-foreground shadow-sm border border-border/50'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            )}
                                        >
                                            <Icon className="h-3 w-3" aria-hidden="true" />
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </Row>

                            {/* Accent */}
                            <Row label="Accent Color" description="The highlight color used throughout the interface.">
                                <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Accent color">
                                    {ACCENT_OPTIONS.map((opt) => (
                                        <Tooltip key={opt.value} delayDuration={400}>
                                            <TooltipTrigger asChild>
                                                <button
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={accent === opt.value}
                                                    aria-label={opt.label}
                                                    onClick={() => setAccent(opt.value)}
                                                    className={cn(
                                                        'h-6 w-6 rounded-full transition-all duration-150',
                                                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                                                        'active:scale-90',
                                                        accent === opt.value
                                                            ? 'ring-2 ring-offset-2 ring-offset-background scale-110'
                                                            : 'hover:scale-105 opacity-70 hover:opacity-100'
                                                    )}
                                                    style={{
                                                        background: opt.hex,
                                                        ['--tw-ring-color' as string]: opt.hex,
                                                    }}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom" className="text-xs">{opt.label}</TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </Row>
                        </Section>

                        {/* ── History ──────────────────────────────────── */}
                        <Section title="History">
                            <Row label="Save conversations" description="Your chats are stored locally in this browser.">
                                <Switch
                                    checked={saveHistory}
                                    onCheckedChange={setSaveHistory}
                                    aria-label="Save conversation history"
                                />
                            </Row>
                            <Row label="Export history" description="Download all your conversations as JSON.">
                                <Button variant="outline" size="sm" className="gap-2 h-8 text-xs" aria-label="Export history">
                                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                                    Export
                                </Button>
                            </Row>
                            <Row label="Delete all history" description="Permanently erase all saved conversations.">
                                <Button variant="outline" size="sm"
                                    className="gap-2 h-8 text-xs text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                                    aria-label="Delete all history">
                                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                                    Delete all
                                </Button>
                            </Row>
                        </Section>

                        {/* ── About ────────────────────────────────────── */}
                        <Section title="About">
                            <Row label="Version" description="SwordigoPlus Copilot">
                                <span className="rounded-lg bg-muted/50 border border-border/40 px-2.5 py-1 text-xs text-muted-foreground font-mono">
                                    0.1.0-beta
                                </span>
                            </Row>
                            <Row label="Platform" description="Hosted on Cloudflare Pages.">
                                <span className="text-xs text-muted-foreground/60">Cloudflare</span>
                            </Row>
                        </Section>

                    </main>
                </ScrollArea>
            </div>
        </TooltipProvider>
    )
}
