import { useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'

/**
 * Wraps page content with an enter animation keyed to the current route.
 * Each navigation triggers a fresh page-in animation.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
    const location = useLocation()
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        el.classList.remove('page-enter')
        // Force reflow so the class re-applies
        void el.offsetWidth
        el.classList.add('page-enter')
    }, [location.key])

    return (
        <div ref={ref} className="page-enter h-full flex flex-col overflow-hidden">
            {children}
        </div>
    )
}

/**
 * Provider for prefers-color-scheme system detection — must be inside BrowserRouter.
 */
export function SystemThemeWatcher() {
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        if (theme !== 'system') return
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const apply = () => {
            document.documentElement.classList.toggle('light', !mq.matches)
        }
        apply()
        mq.addEventListener('change', apply)
        return () => mq.removeEventListener('change', apply)
    }, [theme, setTheme])

    return null
}
