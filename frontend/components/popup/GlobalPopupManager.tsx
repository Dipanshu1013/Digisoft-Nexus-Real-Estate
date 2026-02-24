'use client'
/**
 * GlobalPopupManager
 *
 * Drop into root layout (app/layout.tsx) or any page.
 * Manages ALL popup triggers and renders the correct popup variant.
 *
 * Features:
 * - Exit-intent detection (desktop mouse + mobile visibility)
 * - Scroll depth trigger (35% by default)
 * - Time delay trigger (8s by default)
 * - A/B test variant routing
 * - Mobile: full-screen bottom sheet
 * - Desktop: centered modal with backdrop
 * - Never shows if lead already captured
 * - Never shows on campaign pages (pass disableAuto)
 *
 * Usage:
 *   // In app/layout.tsx
 *   <GlobalPopupManager />
 *
 *   // On campaign pages (suppress auto triggers)
 *   <GlobalPopupManager disableAuto />
 */

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useLeadStore } from '@/store'
import useLeadCapture from '@/hooks/useLeadCapture'
import useABTest from '@/hooks/useABTest'
import ProgressiveLeadForm from './ProgressiveLeadForm'
import ExitIntentPopup from './ExitIntentPopup'
import LeadMagnetPopup from './LeadMagnetPopup'
import { trackPopupShown, trackPopupClosed } from '@/lib/analytics'

interface GlobalPopupManagerProps {
  /** Delay before time trigger. Default: 8000ms */
  triggerDelay?: number
  /** Scroll % to trigger. Default: 35 */
  scrollDepth?: number
  /** Disable all auto triggers (use on campaign pages) */
  disableAuto?: boolean
  /** Page context for lead attribution */
  propertySlug?: string
  campaignSlug?: string
}

export default function GlobalPopupManager({
  triggerDelay = 8000,
  scrollDepth = 35,
  disableAuto = false,
  propertySlug,
  campaignSlug,
}: GlobalPopupManagerProps) {
  const { isPopupOpen, popupConfig, closePopup, hasLeadBeenCaptured } = useLeadStore()

  const { isOpen, config, close } = useLeadCapture({
    timeDelay: triggerDelay,
    scrollDepth,
    disableAuto,
    defaultConfig: { propertySlug, campaignSlug },
  })

  // A/B test: which exit-intent variant to show
  const { variant: exitIntentVariant } = useABTest('exit-intent-type')
  // A/B test: progressive vs compact form
  const { variant: formTypeVariant } = useABTest('form-type')

  const handleClose = useCallback(() => {
    trackPopupClosed(config?.type || 'unknown', 'user-closed')
    close()
  }, [close, config])

  // Track popup shown
  useEffect(() => {
    if (isOpen && config) {
      trackPopupShown('auto', config.type || 'unknown')
    }
  }, [isOpen, config])

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, handleClose])

  // Prevent body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const popupType = config?.type || 'exit-intent'

  return (
    <AnimatePresence>
      <>
        {/* ── Backdrop ──────────────────────────────────────── */}
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* ── Mobile: Bottom Sheet ───────────────────────────── */}
        <motion.div
          key="popup-mobile"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white rounded-t-xl3 shadow-popup overflow-hidden max-h-[92vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Property enquiry"
        >
          {/* Close button */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <div className="w-10 h-1 bg-navy/20 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
            <div />
            <button
              onClick={handleClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full bg-light-grey flex items-center justify-center hover:bg-navy/10 transition-colors"
            >
              <X className="w-4 h-4 text-dark-grey" />
            </button>
          </div>

          <PopupContent
            type={popupType}
            exitIntentVariant={exitIntentVariant}
            formTypeVariant={formTypeVariant}
            propertySlug={propertySlug || config?.propertySlug}
            campaignSlug={campaignSlug || config?.campaignSlug}
            leadMagnetTitle={config?.leadMagnetTitle}
            onClose={handleClose}
          />
        </motion.div>

        {/* ── Desktop: Centered Modal ────────────────────────── */}
        <motion.div
          key="popup-desktop"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="fixed inset-0 z-50 hidden md:flex items-center justify-center p-4 pointer-events-none"
        >
          <div
            className="relative bg-white rounded-xl3 shadow-popup overflow-hidden w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              aria-label="Close popup"
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-light-grey hover:bg-navy/10 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-dark-grey" />
            </button>

            <PopupContent
              type={popupType}
              exitIntentVariant={exitIntentVariant}
              formTypeVariant={formTypeVariant}
              propertySlug={propertySlug || config?.propertySlug}
              campaignSlug={campaignSlug || config?.campaignSlug}
              leadMagnetTitle={config?.leadMagnetTitle}
              onClose={handleClose}
            />
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  )
}

// ──────────────────────────────────────────────────────────────
// Internal: PopupContent — routes to correct popup component
// ──────────────────────────────────────────────────────────────

interface PopupContentProps {
  type: string
  exitIntentVariant: 'A' | 'B'
  formTypeVariant: 'A' | 'B'
  propertySlug?: string
  campaignSlug?: string
  leadMagnetTitle?: string
  onClose: () => void
}

function PopupContent({
  type,
  exitIntentVariant,
  formTypeVariant,
  propertySlug,
  campaignSlug,
  leadMagnetTitle,
  onClose,
}: PopupContentProps) {
  // Exit-intent: A/B test — lead magnet chooser vs phone-first
  if (type === 'exit-intent') {
    if (exitIntentVariant === 'A') {
      return (
        <ExitIntentPopup onClose={onClose} />
      )
    } else {
      // Variant B: quick phone-first form
      return (
        <LeadMagnetPopup
          onClose={onClose}
          title={leadMagnetTitle || 'Get Free Expert Callback in 30 Minutes'}
        />
      )
    }
  }

  // Lead form: A/B test — progressive vs compact
  if (type === 'lead-form') {
    if (formTypeVariant === 'A') {
      return (
        <ProgressiveLeadForm
          onClose={onClose}
          onComplete={onClose}
          propertySlug={propertySlug}
          campaignSlug={campaignSlug}
        />
      )
    } else {
      // Variant B: compact single-step
      return (
        <LeadMagnetPopup
          onClose={onClose}
          title="Get Free Property Consultation"
        />
      )
    }
  }

  // Lead magnet popup
  if (type === 'lead-magnet') {
    return (
      <LeadMagnetPopup
        onClose={onClose}
        title={leadMagnetTitle}
      />
    )
  }

  // Default fallback
  return <ExitIntentPopup onClose={onClose} />
}
