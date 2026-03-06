import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, Download, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { SwordigoLogo } from '@/components/SwordigoLogo'
import type { AccentColor, Theme } from '@/types'

/* ── Accent color definitions ─────────────────────────────────────────────── */
const ACCENT_OPTIONS: { value: AccentColor; label: string; hex: string }[] = [
    { value: 'default', label: 'Default (Purple)', hex: '#8b5cf6' },
    { value: 'green', label: 'Green', hex: '#22c55e' },
    { value: 'red', label: 'Red', hex: '#ef4444' },
    { value: 'blue', label: 'Blue', hex: '#3b82f6' },
    { value: 'yellow', label: 'Yellow', hex: '#eab308' },
    { value: 'pink', label: 'Pink', hex: '#ec4899' },
]

/* ── Section wrapper ─────────────────────────────────────────────────────── */
function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section aria-labelledby={`sec-${title.toLowerCase().replace(/\s/g, '-')}`} className="space-y-3">
            <h2
                id={`sec-${title.toLowerCase().replace(/\s/g, '-')}`}
                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70"
            >
                {title}
            </h2>
            <div className="rounded-xl border border-border bg-surface overflow-hidden divide-y divide-border">
                {children}
            </div>
        </section>
    )
}

/* ── Row ─────────────────────────────────────────────────────────────────── */
function Row({ label, description, children }: { label: string; description?: string; children: ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 px-4 py-3.5">
            <div className="min-w-0">
                <p className="text-sm font-medium text-foreground leading-snug">{label}</p>
                {description && (
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
                )}
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    )
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function SettingsPage() {
    const navigate = useNavigate()
    const [theme, setTheme] = useState<Theme>('dark')
    const [accent, setAccent] = useState<AccentColor>('default')
    const [enableHistory, setEnableHistory] = useState(true)

    function toggleTheme() {
        setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
    }

    return (
        <div className="min-h-dvh bg-background text-foreground flex flex-col">
            {/* Topbar */}
            <header className="glass-topbar flex items-center gap-3 h-14 px-4 shrink-0">
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                    <SwordigoLogo size={24} showWordmark={false} />
                    <span className="text-sm font-semibold tracking-tight">Settings</span>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto px-4 py-8 max-w-lg mx-auto w-full space-y-6 animate-fade-in">

                {/* History */}
                <Section title="History">
                    <Row
                        label="Enable History"
                        description="Save your Copilot conversations for later reference."
                    >
                        <Switch
                            checked={enableHistory}
                            onCheckedChange={setEnableHistory}
                            aria-label="Enable history"
                        />
                    </Row>
                    <Row
                        label="Delete History"
                        description="Permanently remove all saved conversations."
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/60 gap-1.5"
                            aria-label="Delete all chat history"
                            disabled={!enableHistory}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                        </Button>
                    </Row>
                    <Row
                        label="Export History"
                        description="Download your conversations as a JSON file."
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            aria-label="Export chat history"
                            disabled={!enableHistory}
                        >
                            <Download className="h-3.5 w-3.5" />
                            Export
                        </Button>
                    </Row>
                </Section>

                {/* Appearance */}
                <Section title="Appearance">
                    <Row
                        label="Theme"
                        description={theme === 'dark' ? 'Dark mode is active' : 'Light mode is active'}
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleTheme}
                            className="gap-1.5 min-w-[90px]"
                            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                            aria-pressed={theme === 'dark'}
                        >
                            {theme === 'dark'
                                ? <><Moon className="h-3.5 w-3.5" /> Dark</>
                                : <><Sun className="h-3.5 w-3.5" /> Light</>}
                        </Button>
                    </Row>

                    <Row
                        label="Accent Color"
                        description="Choose a highlight color for the interface."
                    >
                        <Select value={accent} onValueChange={(v) => setAccent(v as AccentColor)}>
                            <SelectTrigger className="w-[170px]" aria-label="Accent color">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ACCENT_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        <span className="flex items-center gap-2">
                                            <span
                                                className="h-3 w-3 rounded-full shrink-0 ring-1 ring-white/10"
                                                style={{ background: opt.hex }}
                                                aria-hidden="true"
                                            />
                                            {opt.label}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Row>
                </Section>

                {/* About */}
                <Section title="About">
                    <Row label="Version" description="SwordigoPlus Copilot">
                        <span className="text-xs text-muted-foreground font-mono">0.1.0-beta</span>
                    </Row>
                </Section>

                {/* Footer note */}
                <p className="text-center text-xs text-muted-foreground/40 pb-4 select-none">
                    Settings are stored locally and take effect immediately.
                </p>
            </main>
        </div>
    )
}
