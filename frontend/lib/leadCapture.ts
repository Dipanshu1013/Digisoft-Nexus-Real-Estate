/**
 * DigiSoft Nexus — Lead Capture Library
 *
 * Centralises all lead submission logic:
 *   - Client-side rate limiting (1 submit per 30s per session)
 *   - Deduplication (don't submit same phone twice in session)
 *   - Retry on network error (up to 2 retries)
 *   - UTM enrichment
 *   - Analytics event dispatch
 */

import { getStoredUTM } from '@/hooks/useUTMCapture'

const RATE_LIMIT_KEY = 'digisoft_last_submit'
const SUBMITTED_PHONES_KEY = 'digisoft_submitted_phones'
const RATE_LIMIT_MS = 30_000 // 30 seconds between submissions

export interface LeadPayload {
  first_name: string
  last_name?: string
  email?: string
  phone: string
  property_interest?: string
  campaign_slug?: string
  source?: string
  profile_stage?: number
  buyer_status?: string
  budget?: string
  current_city?: string
  specific_requirements?: string
  consent_given: boolean
  consent_text: string
  page_url?: string
  hcaptcha_token?: string
  ab_test_variants?: Record<string, 'A' | 'B'>
}

export interface SubmitResult {
  success: boolean
  alreadySubmitted?: boolean
  rateLimited?: boolean
  error?: string
}

/**
 * Check if we're rate-limited
 */
function isRateLimited(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const last = localStorage.getItem(RATE_LIMIT_KEY)
    if (!last) return false
    return Date.now() - parseInt(last) < RATE_LIMIT_MS
  } catch {
    return false
  }
}

/**
 * Check if this phone number was already submitted this session
 */
function isAlreadySubmitted(phone: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const submitted = JSON.parse(sessionStorage.getItem(SUBMITTED_PHONES_KEY) || '[]') as string[]
    const normalised = phone.replace(/\D/g, '').slice(-10)
    return submitted.some((p) => p.replace(/\D/g, '').slice(-10) === normalised)
  } catch {
    return false
  }
}

/**
 * Mark a phone as submitted for this session
 */
function markSubmitted(phone: string): void {
  if (typeof window === 'undefined') return
  try {
    const submitted = JSON.parse(sessionStorage.getItem(SUBMITTED_PHONES_KEY) || '[]') as string[]
    submitted.push(phone)
    sessionStorage.setItem(SUBMITTED_PHONES_KEY, JSON.stringify(submitted))
    localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()))
  } catch {}
}

/**
 * Submit lead with UTM enrichment, rate limiting, dedup and retry
 */
export async function submitLead(payload: Omit<LeadPayload, 'page_url'>): Promise<SubmitResult> {
  // Rate limit check
  if (isRateLimited()) {
    return { success: false, rateLimited: true }
  }

  // Dedup check
  if (payload.phone && isAlreadySubmitted(payload.phone)) {
    return { success: false, alreadySubmitted: true }
  }

  // Enrich with UTM + page URL
  const utmData = getStoredUTM()
  const enriched: LeadPayload = {
    ...payload,
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    ...utmData,
  }

  // Submit with retry
  let lastError: string | undefined
  for (let attempt = 0; attempt <= 2; attempt++) {
    try {
      const res = await fetch('/api/leads/capture/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enriched),
      })

      if (res.ok || res.status === 201) {
        markSubmitted(payload.phone)
        dispatchLeadEvent(enriched)
        return { success: true }
      }

      // 4xx errors — don't retry
      if (res.status >= 400 && res.status < 500) {
        const body = await res.json().catch(() => ({}))
        return { success: false, error: body.detail || `Error ${res.status}` }
      }

      // 5xx — retry
      lastError = `Server error ${res.status}`
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Network error'
    }

    // Wait before retry (exponential backoff)
    if (attempt < 2) await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
  }

  // All retries failed — still mark as "success" UX-wise (don't penalise user)
  // but flag the error for monitoring
  dispatchLeadEvent(enriched, false)
  return { success: true, error: lastError }
}

/**
 * Dispatch analytics event for lead submission
 */
function dispatchLeadEvent(payload: Partial<LeadPayload>, serverSuccess = true): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent('digisoft:lead_captured', {
      detail: {
        phone: payload.phone,
        source: payload.source,
        campaign: payload.campaign_slug,
        stage: payload.profile_stage,
        serverSuccess,
        timestamp: Date.now(),
      },
    })
  )
}

/**
 * Validate phone number (Indian 10-digit)
 */
export function validatePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  if (digits.length !== 10) return 'Please enter a 10-digit mobile number'
  if (!/^[6-9]/.test(digits)) return 'Enter a valid Indian mobile number'
  return null
}

/**
 * Validate name
 */
export function validateName(name: string): string | null {
  if (!name.trim() || name.trim().length < 2) return 'Please enter your full name'
  return null
}

/**
 * Validate email (optional field)
 */
export function validateEmail(email: string): string | null {
  if (!email) return null // optional
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address'
  return null
}

export const CONSENT_TEXT =
  'I consent to Digisoft Nexus sharing my data with the relevant developer for property inquiries and marketing communication'
