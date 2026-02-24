'use client'
/**
 * useExitIntent
 *
 * Detects when user is about to leave the page:
 *   - Desktop: mouse moves above THRESHOLD_Y px from viewport top
 *   - Mobile: page visibility change (tab switch / app minimize)
 *   - Both: fires callback ONCE (after a minimum time on page)
 *
 * Usage:
 *   useExitIntent({ onExitIntent: () => openExitPopup() })
 */
import { useEffect, useRef } from 'react'

interface UseExitIntentOptions {
  /** Minimum time (ms) before exit-intent can fire. Default: 5000 */
  minTimeOnPage?: number
  /** px from viewport top that triggers desktop detection. Default: 10 */
  mouseThreshold?: number
  /** Callback when exit intent is detected */
  onExitIntent: () => void
  /** Whether the hook is active. Default: true */
  enabled?: boolean
}

export function useExitIntent({
  minTimeOnPage = 5000,
  mouseThreshold = 10,
  onExitIntent,
  enabled = true,
}: UseExitIntentOptions) {
  const hasFiredRef = useRef(false)
  const readyRef = useRef(false) // becomes true after minTimeOnPage

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    // Don't allow firing until minTimeOnPage has elapsed
    const readyTimer = setTimeout(() => {
      readyRef.current = true
    }, minTimeOnPage)

    const fire = () => {
      if (!hasFiredRef.current && readyRef.current) {
        hasFiredRef.current = true
        onExitIntent()
      }
    }

    // ── Desktop: mouseleave toward browser chrome ──────────────────
    let lastY = window.innerHeight / 2

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < mouseThreshold && lastY > mouseThreshold) {
        fire()
      }
      lastY = e.clientY
    }

    // ── Mobile: visibility change ──────────────────────────────────
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') fire()
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearTimeout(readyTimer)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [enabled, minTimeOnPage, mouseThreshold, onExitIntent])
}

export default useExitIntent
