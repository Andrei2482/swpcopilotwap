import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import CopilotPage from '@/pages/CopilotPage'
import SettingsPage from '@/pages/SettingsPage'
import { ThemeProvider } from '@/context/ThemeContext'
import { TooltipProvider } from '@/components/ui/tooltip'

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

function AppRoutes() {
    return (
        <PageTransition>
            <Routes>
                <Route path="/" element={<CopilotPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </PageTransition>
    )
}

export default function App() {
    return (
        <ThemeProvider>
            <TooltipProvider delayDuration={400} skipDelayDuration={150}>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </TooltipProvider>
        </ThemeProvider>
    )
}
