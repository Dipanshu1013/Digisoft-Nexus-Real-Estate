'use client'
/**
 * useUTMCapture — UTM parameter extraction, persistence & retrieval
 * 
 * - Extracts UTM params from URL on page load
 * - Persists to localStorage + 30-day cookie (last-touch attribution)
 * - getStoredUTM() reads stored params for form submission
 */
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLeadStore } from '@/store'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
const STORAGE_KEY = 'digisoft_utm'
const COOKIE_EXPIRY_DAYS = 30

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`
}

/** Read stored UTM params (last-touch) — call from any component before form submit */
export function getStoredUTM(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function useUTMCapture() {
  const searchParams = useSearchParams()
  const { setUTMParams } = useLeadStore()

  useEffect(() => {
    // Extract UTM params from current URL
    const params: Record<string, string> = {}
    let hasUTM = false

    UTM_KEYS.forEach((key) => {
      const val = searchParams.get(key)
      if (val) {
        params[key] = val
        hasUTM = true
      }
    })

    if (!hasUTM) return // No UTM on this page — keep existing stored values

    // Persist to localStorage (last-touch — overwrites previous)
    const serialized = JSON.stringify(params)
    try {
      localStorage.setItem(STORAGE_KEY, serialized)
      setCookie(STORAGE_KEY, serialized, COOKIE_EXPIRY_DAYS)
    } catch {}

    // Sync to Zustand store
    setUTMParams(params)
  }, [searchParams, setUTMParams])
}

export default useUTMCapture
