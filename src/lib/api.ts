/**
 * src/lib/api.ts
 * ──────────────────────────────────────────────────────────────
 * apiFetch — authenticated fetch wrapper for Copilot.
 *
 * Behaviour:
 *   1. Attaches Authorization: Bearer <accessToken> header automatically.
 *   2. On 401 → tries one silent refresh via the swp_refresh cookie.
 *   3. If refresh also fails → redirects to login.
 *   4. Always sends credentials:'include' so cookies flow correctly.
 */

import { getAccessToken, silentRefresh, storeTokens } from '@/lib/auth'

const API = import.meta.env.VITE_API_URL as string
const LOGIN_URL = 'https://app.swordigoplus.cf/auth/login?redirect=copilot'

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
    const buildHeaders = (token: string | null): HeadersInit => ({
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // Allow callers to override Content-Type (e.g. multipart)
        ...(init.headers ?? {}),
    })

    const doFetch = (token: string | null) =>
        fetch(`${API}${path}`, {
            ...init,
            credentials: 'include',
            headers: buildHeaders(token),
        })

    let res = await doFetch(getAccessToken())

    if (res.status === 401) {
        // One silent refresh attempt
        const newToken = await silentRefresh()
        if (!newToken) {
            // Refresh token also expired — full re-authentication required
            window.location.href = LOGIN_URL
            return res
        }
        storeTokens(newToken)
        res = await doFetch(newToken)

        if (res.status === 401) {
            // Still failing after refresh — redirect
            window.location.href = LOGIN_URL
        }
    }

    return res
}
