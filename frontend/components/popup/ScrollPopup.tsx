'use client'
/**
 * ScrollPopup
 *
 * Renders a compact slide-up popup triggered at a scroll depth threshold.
 * Unlike the modal popup, this is a persistent bottom bar on desktop.
 * Dismissible with a close button.
 *
 * Usage:
 *   <ScrollPopup threshold={35} propertySlug="godrej-emerald" />
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, ArrowRight } from 'lucide-react'
import { useLeadStore } from '@/store'
import { submitLead, CONSENT_TEXT } from '@/lib/leadCapture'

interface ScrollPopupProps {
  threshold?: number
  propertySlug?: string
  campaignSlug?: string
  leadMagnetTitle?: string
}

export default function ScrollPopup({
  threshold = 35,
  propertySlug,
  campaignSlug,
  leadMagnetTitle = 'Get Free Brochure + Floor Plans',
}: ScrollPopupProps) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { hasLeadBeenCaptured, markLeadCaptured } = useLeadStore()

  useEffect(() => {
    if (dismissed || hasLeadBeenCaptured) return

    const handleScroll = () => {
      const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      if (pct >= threshold) setVisible(true)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold, dismissed, hasLeadBeenCaptured])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    await submitLead({
      first_name: 'Visitor',
      email,
      phone: 'not_provided',
      property_interest: propertySlug,
      campaign_slug: campaignSlug,
      source: 'scroll-popup',
      profile_stage: 1,
      consent_given: true,
      consent_text: CONSENT_TEXT,
    })

    markLeadCaptured()
    setSubmitted(true)
    setTimeout(() => setDismissed(true), 2500)
  }

  if (dismissed || hasLeadBeenCaptured) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-20 md:bottom-5 right-4 md:right-6 z-40 w-[calc(100vw-2rem)] md:w-80"
        >
          <div className="bg-white rounded-xl2 shadow-popup border border-navy/8 overflow-hidden">
            {/* Top accent */}
            <div className="h-1 bg-gradient-gold" />

            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="font-syne font-bold text-navy text-sm">{leadMagnetTitle}</p>
                  <p className="text-[11px] text-dark-grey mt-0.5">Free • WhatsApp delivery in 5 min</p>
                </div>
                <button
                  onClick={() => setDismissed(true)}
                  className="w-6 h-6 rounded-full bg-light-grey flex items-center justify-center shrink-0 hover:bg-navy/10"
                >
                  <X className="w-3 h-3 text-dark-grey" />
                </button>
              </div>

              {submitted ? (
                <p className="text-success text-xs font-syne font-semibold">
                  ✓ Sent! Check your email in a moment.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input flex-1 text-xs py-2"
                    required
                  />
                  <button type="submit" className="btn btn-primary btn-sm shrink-0 px-3">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              <p className="text-[9px] text-mid-grey mt-2">
                By submitting, I consent to Digisoft Nexus using my data per their{' '}
                <a href="/privacy-policy" className="underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
