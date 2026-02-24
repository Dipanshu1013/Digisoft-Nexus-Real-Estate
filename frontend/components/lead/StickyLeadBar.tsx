'use client'
/**
 * StickyLeadBar — Enhanced Phase 4
 *
 * Mobile-only sticky bottom bar.
 * - Appears after 300px scroll
 * - A/B test: Variant A = 3 buttons, Variant B = 2 buttons + inline name field
 * - Opens bottom-sheet LeadForm on "Enquire" tap
 * - Hides once lead is captured
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MessageCircle, X, Loader2, CheckCircle } from 'lucide-react'
import { useLeadStore } from '@/store'
import useABTest from '@/hooks/useABTest'
import { submitLead, validatePhone, CONSENT_TEXT } from '@/lib/leadCapture'

interface StickyLeadBarProps {
  phone?: string
  whatsapp?: string
  propertyTitle?: string
  propertySlug?: string
}

export default function StickyLeadBar({
  phone = '+919999999999',
  whatsapp = '919999999999',
  propertyTitle,
  propertySlug,
}: StickyLeadBarProps) {
  const [visible, setVisible] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [phoneNum, setPhoneNum] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const { hasLeadBeenCaptured, markLeadCaptured } = useLeadStore()
  const { variant } = useABTest('sticky-bar-variant')

  const whatsappMsg = propertyTitle
    ? `Hi, I'm interested in ${propertyTitle}. Please share details.`
    : `Hi, I'm looking for a property in Gurugram. Can you help?`

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNum || phoneNum.length < 10) return
    setLoading(true)

    await submitLead({
      first_name: name || 'Visitor',
      phone: `+91${phoneNum}`,
      property_interest: propertySlug,
      source: 'sticky-lead-bar',
      profile_stage: 1,
      consent_given: true,
      consent_text: CONSENT_TEXT,
    })

    setLoading(false)
    markLeadCaptured()
    setDone(true)
    setTimeout(() => setSheetOpen(false), 2000)
  }

  if (hasLeadBeenCaptured && !sheetOpen) return null

  return (
    <>
      {/* ── Sticky Bar ──────────────────────────────────────── */}
      <AnimatePresence>
        {visible && !sheetOpen && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white border-t border-navy/10 shadow-popup safe-area-bottom"
          >
            <div className="flex items-center gap-2 px-4 py-3">
              {/* Call */}
              <a
                href={`tel:${phone}`}
                className="flex-1 flex items-center justify-center gap-1.5 bg-navy/5 hover:bg-navy/10 rounded-xl py-3 text-navy text-xs font-syne font-semibold transition-colors"
                aria-label="Call"
              >
                <Phone className="w-4 h-4" />
                Call
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] rounded-xl py-3 text-white text-xs font-syne font-semibold"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>

              {/* Enquire */}
              {!hasLeadBeenCaptured && (
                <button
                  onClick={() => setSheetOpen(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gold rounded-xl py-3 text-navy text-xs font-syne font-semibold"
                >
                  ✉ Enquire
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom Sheet ─────────────────────────────────────── */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-navy/50 backdrop-blur-sm lg:hidden"
              onClick={() => setSheetOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-xl3 shadow-popup overflow-hidden lg:hidden"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-navy/20 rounded-full" />
              </div>

              {/* Close */}
              <div className="flex items-center justify-between px-5 py-2">
                <p className="font-syne font-bold text-navy text-sm">
                  {propertyTitle ? `Enquire about ${propertyTitle.split(' ').slice(0, 3).join(' ')}` : 'Quick Enquiry'}
                </p>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="w-8 h-8 rounded-full bg-light-grey flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-dark-grey" />
                </button>
              </div>

              {/* Form */}
              <div className="px-5 pb-6 pt-2">
                {done ? (
                  <div className="flex flex-col items-center gap-3 py-6">
                    <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-success" />
                    </div>
                    <p className="font-syne font-bold text-navy text-center">
                      We'll call you within 30 minutes!
                    </p>
                    <p className="text-xs text-dark-grey text-center">
                      Check WhatsApp for the brochure shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="form-label">Your Name</label>
                      <input
                        type="text"
                        placeholder="Rahul Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Mobile Number *</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-dark-grey">+91</span>
                        <input
                          type="tel"
                          placeholder="98765 43210"
                          value={phoneNum}
                          onChange={(e) => setPhoneNum(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="form-input pl-12"
                          inputMode="numeric"
                          required
                          autoFocus
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-mid-grey leading-relaxed">
                      By submitting, I consent to Digisoft Nexus using my data per their{' '}
                      <a href="/privacy-policy" className="text-gold underline">Privacy Policy</a>.
                    </p>
                    <button
                      type="submit"
                      disabled={loading || phoneNum.length < 10}
                      className="btn btn-primary w-full justify-center disabled:opacity-50"
                    >
                      {loading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                      ) : (
                        'Request Callback'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
