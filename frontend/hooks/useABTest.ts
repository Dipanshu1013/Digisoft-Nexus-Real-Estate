'use client'
/**
 * useABTest — A/B Test Variant Assignment
 *
 * Assigns a stable variant to each user (persisted in localStorage).
 * Tracks impressions and conversions per variant.
 *
 * Tests defined in /lib/abTest.ts
 *
 * Usage:
 *   const { variant } = useABTest('popup-cta-copy')
 *   // variant === 'A' or 'B'
 */
import { useState, useEffect } from 'react'
import { AB_TESTS } from '@/lib/abTest'

const STORAGE_PREFIX = 'digisoft_ab_'

export function useABTest(testId: string): { variant: 'A' | 'B'; trackConversion: () => void } {
  const [variant, setVariant] = useState<'A' | 'B'>('A')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storageKey = `${STORAGE_PREFIX}${testId}`
    const stored = localStorage.getItem(storageKey) as 'A' | 'B' | null

    if (stored === 'A' || stored === 'B') {
      setVariant(stored)
      return
    }

    // New user — assign based on random with configured split
    const test = AB_TESTS[testId]
    const split = test?.splitRatio ?? 0.5 // default 50/50
    const assigned: 'A' | 'B' = Math.random() < split ? 'A' : 'B'

    localStorage.setItem(storageKey, assigned)
    setVariant(assigned)

    // Track impression
    trackABEvent(testId, assigned, 'impression')
  }, [testId])

  const trackConversion = () => {
    trackABEvent(testId, variant, 'conversion')
  }

  return { variant, trackConversion }
}

function trackABEvent(testId: string, variant: 'A' | 'B', event: 'impression' | 'conversion') {
  if (typeof window === 'undefined') return

  // Dispatch custom event for analytics layer to pick up
  window.dispatchEvent(
    new CustomEvent('digisoft:ab_event', {
      detail: { testId, variant, event, timestamp: Date.now() },
    })
  )

  // Also store counts locally for debugging
  try {
    const key = `${STORAGE_PREFIX}${testId}_${variant}_${event}s`
    const count = parseInt(localStorage.getItem(key) || '0') + 1
    localStorage.setItem(key, String(count))
  } catch {}
}

export default useABTest
