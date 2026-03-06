import { createContext, useContext, useEffect, useState } from 'react'
import type { AccentColor, Theme } from '@/types'

/* ── Accent color → HSL values ─────────────────────────────────────────────── */
const ACCENT_HSL: Record<AccentColor, [number, number, number]> = {
    purple: [252, 80, 65],
    blue: [210, 88, 60],
    green: [142, 70, 48],
    red: [0, 72, 58],
    pink: [330, 75, 60],
    yellow: [45, 92, 52],
}

function applyTheme(theme: Theme) {
    const root = document.documentElement
    if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.toggle('light', !prefersDark)
    } else {
        root.classList.toggle('light', theme === 'light')
    }
}

function applyAccent(accent: AccentColor) {
    const [h, s, l] = ACCENT_HSL[accent]
    const r = document.documentElement
    r.style.setProperty('--primary', `${h} ${s}% ${l}%`)
    r.style.setProperty('--ring', `${h} ${s}% ${l}%`)
    r.style.setProperty('--accent', `${h} ${Math.round(s * 0.75)}% ${Math.round(l * 0.9)}%`)
}

/* ── Context ────────────────────────────────────────────────────────────────── */
interface ThemeContextValue {
    theme: Theme
    accent: AccentColor
    setTheme: (t: Theme) => void
    setAccent: (a: AccentColor) => void
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'dark',
    accent: 'purple',
    setTheme: () => { },
    setAccent: () => { },
})

export function useTheme() {
    return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        return (localStorage.getItem('swp-theme') as Theme) ?? 'dark'
    })
    const [accent, setAccentState] = useState<AccentColor>(() => {
        return (localStorage.getItem('swp-accent') as AccentColor) ?? 'purple'
    })

    // Apply on mount and when system preference changes
    useEffect(() => {
        applyTheme(theme)
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = () => { if (theme === 'system') applyTheme('system') }
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [theme])

    useEffect(() => { applyAccent(accent) }, [accent])

    function setTheme(t: Theme) {
        setThemeState(t)
        localStorage.setItem('swp-theme', t)
        applyTheme(t)
    }

    function setAccent(a: AccentColor) {
        setAccentState(a)
        localStorage.setItem('swp-accent', a)
        applyAccent(a)
    }

    return (
        <ThemeContext.Provider value={{ theme, accent, setTheme, setAccent }}>
            {children}
        </ThemeContext.Provider>
    )
}

export { ACCENT_HSL }
