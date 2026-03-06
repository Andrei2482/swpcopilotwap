import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import CopilotPage from '@/pages/CopilotPage'
import SettingsPage from '@/pages/SettingsPage'
import { ThemeProvider } from '@/context/ThemeContext'
import { TooltipProvider } from '@/components/ui/tooltip'
import { initAuth, type AuthUser } from '@/lib/auth'
import { Sparkles } from 'lucide-react'

/* ── Page-transition wrapper ─────────────────────────────── */
function PageTransition({ children }: { children: React.ReactNode }) {
    const location = useLocation()
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        el.classList.remove('page-enter')
        void el.offsetWidth
        el.classList.add('page-enter')
    }, [location.key])

    return (
        <div ref={ref} className="page-enter h-full flex flex-col overflow-hidden will-change-[opacity,transform]">
            {children}
        </div>
    )
}

function AppRoutes({ user }: { user: AuthUser }) {
    return (
        <PageTransition>
            <Routes>
                <Route path="/" element={<CopilotPage user={user} />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </PageTransition>
    )
}

/* ── Auth loading shimmer ────────────────────────────────── */
function AuthLoader() {
    return (
        <div
            className="h-dvh flex flex-col items-center justify-center gap-4 bg-background"
            role="status"
            aria-label="Verifying session…"
        >
            {/* Ambient glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                    background: 'radial-gradient(ellipse 60% 50% at 50% 0%, hsl(var(--primary)/0.08), transparent 70%)',
                }}
            />

            {/* Logo mark */}
            <div
                className="relative flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                    background: 'hsl(var(--surface))',
                    border: '1px solid hsl(var(--primary)/0.20)',
                    boxShadow: '0 0 0 8px hsl(var(--primary)/0.05), 0 4px 24px hsl(var(--primary)/0.12)',
                }}
            >
                <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />

                {/* Spinner ring */}
                <svg
                    className="absolute inset-0 h-full w-full animate-spin"
                    viewBox="0 0 56 56"
                    fill="none"
                    aria-hidden="true"
                    style={{ animationDuration: '1.4s' }}
                >
                    <circle cx="28" cy="28" r="26" stroke="hsl(var(--primary)/0.12)" strokeWidth="1.5" />
                    <circle
                        cx="28" cy="28" r="26"
                        stroke="hsl(var(--primary)/0.55)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeDasharray="40 124"
                    />
                </svg>
            </div>

            <p className="text-[13px] text-muted-foreground/50 select-none">
                Verifying session…
            </p>
        </div>
    )
}

/* ── Root ────────────────────────────────────────────────── */
export default function App() {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        initAuth()
            .then(setUser)
            .catch(() => {
                // initAuth handles its own redirect — no action needed here.
            })
            .finally(() => setChecking(false))
    }, [])

    return (
        <ThemeProvider>
            <TooltipProvider delayDuration={400} skipDelayDuration={150}>
                {/* Auth loading state — shown before we know if the user is authenticated */}
                {checking && <AuthLoader />}

                {/* Authenticated — render the full app */}
                {!checking && user && (
                    <BrowserRouter>
                        <AppRoutes user={user} />
                    </BrowserRouter>
                )}

                {/* !checking && !user → initAuth already hard-redirected, render nothing */}
            </TooltipProvider>
        </ThemeProvider>
    )
}
