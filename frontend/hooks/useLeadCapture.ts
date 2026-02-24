'use client'
/**
 * useLeadCapture — Master Hook
 *
 * Single source of truth for ALL lead capture triggers:
 *   - Time delay (8s)
 *   - Scroll depth (35%)
 *   - Exit-intent (desktop mouse + mobile back)
 *   - Manual triggers (from CTA buttons)
 *
 * Rules:
 *   - Never show popup if lead already captured this session
 *   - Never show popup on page load (0s)
 *   - Show at most once per page visit (session-scoped)
 *   - Mobile: bottom sheet instead of centered modal
 *
 * Usage:
 *   const { trigger, isOpen, close, config } = useLeadCapture()
 *   <button onClick={() => trigger('manual', { propertySlug: 'godrej-emerald' })}>
 */

import { useEffect, useRef, useCallback } from 'react'
import { useLeadStore } from '@/store'

export type PopupTrigger =
  | 'time-delay'
  | 'scroll-depth'
  | 'exit-intent'
  | 'manual'
  | 'cta-click'

export interface TriggerConfig {
  type?: 'exit-intent' | 'lead-form' | 'lead-magnet'
  propertySlug?: string
  campaignSlug?: string
  leadMagnetTitle?: string
  title?: string
}

interface UseLeadCaptureOptions {
  /** Delay in ms before time-trigger fires. Default: 8000 */
  timeDelay?: number
  /** Scroll % to trigger popup. Default: 35 */
  scrollDepth?: number
  /** Enable exit-intent detection. Default: true */
  exitIntent?: boolean
  /** Disable all auto-triggers (e.g. on campaign pages). Default: false */
  disableAuto?: boolean
  /** Page-level config injected into every trigger */
  defaultConfig?: TriggerConfig
}

export function useLeadCapture({
  timeDelay = 8000,
  scrollDepth = 35,
  exitIntent = true,
  disableAuto = false,
  defaultConfig,
}: UseLeadCaptureOptions = {}) {
  const {
    isPopupOpen,
    popupConfig,
    hasLeadBeenCaptured,
    openPopup,
    closePopup,
  } = useLeadStore()

  // Track whether we've already triggered once this page visit
  const hasTriggeredRef = useRef(false)
  // Track scroll listener cleanup
  const scrollCleanupRef = useRef<(() => void) | null>(null)
  // Track time delay cleanup
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /**
   * Fire the popup — only if conditions allow
   */
  const trigger = useCallback(
    (source: PopupTrigger, config?: TriggerConfig) => {
      // Never fire if already captured or already triggered
      if (hasLeadBeenCaptured) return
      if (hasTriggeredRef.current && source !== 'manual' && source !== 'cta-click') return

      hasTriggeredRef.current = true

      const mergedConfig: TriggerConfig = {
        type: 'exit-intent',
        ...defaultConfig,
        ...config,
      }

      openPopup(mergedConfig)

      // Analytics event
      if (typeof window !== 'undefined') {
        try {
          window.dispatchEvent(
            new CustomEvent('digisoft:popup_triggered', {
              detail: { source, config: mergedConfig },
            })
          )
        } catch {}
      }
    },
    [hasLeadBeenCaptured, defaultConfig, openPopup]
  )

  /**
   * Set up auto-triggers
   */
  useEffect(() => {
    if (disableAuto || hasLeadBeenCaptured || typeof window === 'undefined') return

    // ── 1. Time Delay Trigger ──────────────────────────────────────
    timerRef.current = setTimeout(() => {
      trigger('time-delay', { type: 'lead-magnet' })
    }, timeDelay)

    // ── 2. Scroll Depth Trigger ────────────────────────────────────
    const handleScroll = () => {
      if (hasTriggeredRef.current) return
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      if (scrolled >= scrollDepth) {
        // Cancel the time-delay timer — scroll beat it
        if (timerRef.current) clearTimeout(timerRef.current)
        trigger('scroll-depth', { type: 'lead-form' })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    scrollCleanupRef.current = () => window.removeEventListener('scroll', handleScroll)

    // ── 3. Exit-Intent Trigger (Desktop) ──────────────────────────
    let exitIntentCleanup: (() => void) | null = null

    if (exitIntent) {
      const THRESHOLD = 10 // px from top of viewport
      let lastY = 0

      const handleMouseMove = (e: MouseEvent) => {
        // Only trigger when moving upward toward browser chrome
        if (e.clientY < THRESHOLD && lastY > THRESHOLD && !hasTriggeredRef.current) {
          if (timerRef.current) clearTimeout(timerRef.current)
          trigger('exit-intent', { type: 'exit-intent' })
        }
        lastY = e.clientY
      }

      // Delay attaching exit-intent to avoid instant trigger on page load
      const exitIntentTimer = setTimeout(() => {
        document.addEventListener('mousemove', handleMouseMove)
        exitIntentCleanup = () => document.removeEventListener('mousemove', handleMouseMove)
      }, 3000)

      exitIntentCleanup = () => {
        clearTimeout(exitIntentTimer)
        document.removeEventListener('mousemove', handleMouseMove)
      }
    }

    // ── 4. Exit-Intent (Mobile — visibilitychange / pagehide) ─────
    let mobileExitCleanup: (() => void) | null = null

    if (exitIntent) {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden' && !hasTriggeredRef.current) {
          trigger('exit-intent', { type: 'exit-intent' })
        }
      }
      document.addEventListener('visibilitychange', handleVisibilityChange)
      mobileExitCleanup = () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      scrollCleanupRef.current?.()
      exitIntentCleanup?.()
      mobileExitCleanup?.()
    }
  }, [disableAuto, hasLeadBeenCaptured, exitIntent, timeDelay, scrollDepth, trigger])

  return {
    isOpen: isPopupOpen,
    config: popupConfig,
    trigger,
    close: closePopup,
    hasLeadBeenCaptured,
  }
}

export default useLeadCapture
