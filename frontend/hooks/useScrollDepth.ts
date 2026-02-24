'use client'
/**
 * useScrollDepth
 *
 * Tracks how far a user has scrolled down the page.
 * Fires callbacks at specified percentage thresholds — once each.
 *
 * Usage:
 *   useScrollDepth({
 *     thresholds: [25, 50, 75, 100],
 *     onThreshold: (pct) => analytics.track('scroll_depth', { pct }),
 *   })
 */
import { useEffect, useRef } from 'react'

interface UseScrollDepthOptions {
  /** Percentage thresholds to fire callbacks at. Default: [25, 50, 75, 100] */
  thresholds?: number[]
  /** Called once when a threshold is crossed */
  onThreshold?: (percentage: number) => void
  /** Callback specifically when reaching 35% (popup trigger threshold) */
  onPopupThreshold?: () => void
  /** The popup trigger percentage. Default: 35 */
  popupAt?: number
}

export function useScrollDepth({
  thresholds = [25, 50, 75, 100],
  onThreshold,
  onPopupThreshold,
  popupAt = 35,
}: UseScrollDepthOptions = {}) {
  const firedRef = useRef<Set<number>>(new Set())
  const popupFiredRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return

      const pct = Math.round((window.scrollY / docHeight) * 100)

      // Check popup threshold
      if (!popupFiredRef.current && pct >= popupAt) {
        popupFiredRef.current = true
        onPopupThreshold?.()
      }

      // Check analytics thresholds
      thresholds.forEach((threshold) => {
        if (!firedRef.current.has(threshold) && pct >= threshold) {
          firedRef.current.add(threshold)
          onThreshold?.(threshold)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Fire once on mount in case page is already scrolled
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [thresholds, onThreshold, onPopupThreshold, popupAt])
}

export default useScrollDepth
