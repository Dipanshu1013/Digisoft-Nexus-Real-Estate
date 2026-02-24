'use client'
import { useEffect, useRef, useCallback } from 'react'
import { useLeadStore } from '@/store'
import type { PopupConfig } from '@/types'

interface UsePopupTriggerOptions {
  delayMs?: number          // Time delay before popup can show (default: 8000ms)
  scrollDepth?: number      // % scroll depth to trigger (default: 35)
  exitIntent?: boolean      // Enable exit-intent detection (default: true)
  popupConfig: PopupConfig
  disabled?: boolean        // Disable all triggers
}

export function usePopupTrigger({
  delayMs = 8000,
  scrollDepth = 35,
  exitIntent = true,
  popupConfig,
  disabled = false,
}: UsePopupTriggerOptions) {
  const { openPopup, isPopupOpen, hasLeadBeenCaptured } = useLeadStore()
  const hasTriggered = useRef(false)
  const delayReached = useRef(false)
  const timerId = useRef<NodeJS.Timeout>()

  const trigger = useCallback(() => {
    // Only trigger once per session if lead already captured at stage 2+
    if (hasTriggered.current || isPopupOpen || disabled) return
    if (hasLeadBeenCaptured && (useLeadStore.getState().currentStage ?? 1) >= 2) return

    hasTriggered.current = true
    openPopup(popupConfig)
  }, [openPopup, isPopupOpen, disabled, hasLeadBeenCaptured, popupConfig])

  useEffect(() => {
    if (disabled) return

    // 1. Time delay trigger
    timerId.current = setTimeout(() => {
      delayReached.current = true
      trigger()
    }, delayMs)

    // 2. Scroll depth trigger
    const handleScroll = () => {
      if (hasTriggered.current || !delayReached.current) return

      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total <= 0) return

      const pct = (scrolled / total) * 100
      if (pct >= scrollDepth) {
        trigger()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // 3. Exit-intent detection (desktop only)
    const handleMouseLeave = (e: MouseEvent) => {
      if (!exitIntent || hasTriggered.current) return
      // Cursor leaving from top of viewport = exit intent
      if (e.clientY <= 0) {
        clearTimeout(timerId.current)
        trigger()
      }
    }

    if (exitIntent) {
      document.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      clearTimeout(timerId.current)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [trigger, delayMs, scrollDepth, exitIntent, disabled])
}
