/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: { '2xl': '1400px' },
        },
        screens: {
            'xs': '480px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
            '3xl': '1920px',
        },
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                surface: 'hsl(var(--surface))',
                'surface-raised': 'hsl(var(--surface-raised))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                sidebar: 'hsl(var(--sidebar))',
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                xl: 'calc(var(--radius) + 4px)',
                '2xl': 'calc(var(--radius) + 8px)',
            },
            keyframes: {
                'fade-in': {
                    from: { opacity: '0', transform: 'translateY(6px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-in-left': {
                    from: { opacity: '0', transform: 'translateX(-8px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                'slide-in-right': {
                    from: { opacity: '0', transform: 'translateX(8px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                'msg-in': {
                    from: { opacity: '0', transform: 'translateY(10px) scale(0.98)' },
                    to: { opacity: '1', transform: 'translateY(0) scale(1)' },
                },
                'slide-up-fade': {
                    from: { opacity: '0', transform: 'translateY(4px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'typing-dot': {
                    '0%, 80%, 100%': { transform: 'scale(0.55)', opacity: '0.35' },
                    '40%': { transform: 'scale(1)', opacity: '1' },
                },
                'glow-pulse': {
                    '0%, 100%': { opacity: '0.5' },
                    '50%': { opacity: '0.9' },
                },
                'blob-drift': {
                    '0%': { transform: 'translate(0,0) scale(1)' },
                    '33%': { transform: 'translate(30px,-40px) scale(1.05)' },
                    '66%': { transform: 'translate(-20px,25px) scale(0.95)' },
                    '100%': { transform: 'translate(0,0) scale(1)' },
                },
                'blob-drift-2': {
                    '0%': { transform: 'translate(0,0) scale(1)' },
                    '33%': { transform: 'translate(-40px,30px) scale(1.06)' },
                    '66%': { transform: 'translate(28px,-30px) scale(0.96)' },
                    '100%': { transform: 'translate(0,0) scale(1)' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.28s ease-out both',
                'slide-in-left': 'slide-in-left 0.25s ease-out both',
                'slide-in-right': 'slide-in-right 0.25s ease-out both',
                'msg-in': 'msg-in 0.3s cubic-bezier(0.16,1,0.3,1) both',
                'slide-up-fade': 'slide-up-fade 0.2s ease-out both',
                'typing-dot': 'typing-dot 1.2s ease-in-out infinite',
                'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
                'blob-1': 'blob-drift 26s ease-in-out infinite',
                'blob-2': 'blob-drift-2 32s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
