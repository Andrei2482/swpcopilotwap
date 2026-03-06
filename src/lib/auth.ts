/**
 * src/lib/auth.ts
 * ──────────────────────────────────────────────────────────────
 * Central auth state for Copilot.
 * – Access token lives ONLY in memory + sessionStorage (tab-scoped).
 * – The swp_refresh HttpOnly cookie is sent automatically by the browser
 *   from *.swordigoplus.cf → no JS can read it (XSS-safe).
 * – All redirects go to app.swordigoplus.cf — Copilot never owns auth UI.
 */

const API = import.meta.env.VITE_API_URL as string
const LOGIN_URL = 'https://app.swordigoplus.cf/auth/login?redirect=copilot'

export interface AuthUser {
    id: string
    username: string
    email: string
    display_name: string | null
    role: string
}

// ── In-memory token ───────────────────────────────────────────
// sessionStorage keeps the token alive across same-tab refreshes.
// localStorage is intentionally NOT used — it survives XSS across all tabs.
let _accessToken: string | null = (() => {
    try { return sessionStorage.getItem('swp_access_token') } catch { return null }
})()

export function getAccessToken(): string | null {
    return _accessToken
}

export function storeTokens(accessToken: string): void {
    _accessToken = accessToken
    try { sessionStorage.setItem('swp_access_token', accessToken) } catch { /* quota */ }
}

function clearTokens(): void {
    _accessToken = null
    try { sessionStorage.removeItem('swp_access_token') } catch { /* noop */ }
}

// ── Silent refresh ────────────────────────────────────────────
// Sends the swp_refresh HttpOnly cookie (credentials:'include').
// Returns the new access token or null if the session has fully expired.
export async function silentRefresh(): Promise<string | null> {
    try {
        const res = await fetch(`${API}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        })
        if (!res.ok) {
            clearTokens()
            return null
        }
        const json = await res.json() as { data: { tokens: { access_token: string } } }
        const token = json.data.tokens.access_token
        storeTokens(token)
        return token
    } catch {
        clearTokens()
        return null
    }
}

// ── Auth guard — call on app load ─────────────────────────────
// 1. Refresh the access token via the HttpOnly cookie.
// 2. Fetch the user profile.
// 3. If either step fails → hard-redirect to login.
export async function initAuth(): Promise<AuthUser> {
    const token = await silentRefresh()

    if (!token) {
        window.location.href = LOGIN_URL
        throw new Error('not_authenticated')
    }

    const res = await fetch(`${API}/auth/me`, {
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
        clearTokens()
        window.location.href = LOGIN_URL
        throw new Error('not_authenticated')
    }

    const json = await res.json() as { data: { user: AuthUser } }
    return json.data.user
}

// ── Logout ────────────────────────────────────────────────────
// Always clears local state, even if the network call fails.
// Server-side: invalidates + expires the swp_refresh cookie.
export async function logout(): Promise<void> {
    const token = _accessToken
    clearTokens()

    try {
        await fetch(`${API}/auth/logout`, {
            method: 'POST',
            credentials: 'include',   // clears the swp_refresh cookie server-side
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
    } catch {
        // Network error — local state is already cleared; redirect anyway.
    }

    // Hard-redirect clears all React in-memory state
    window.location.href = 'https://app.swordigoplus.cf/auth/login'
}
