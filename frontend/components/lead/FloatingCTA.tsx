'use client'
/**
 * FloatingCTA
 *
 * Fixed floating action buttons on desktop:
 *   - WhatsApp
 *   - Call
 *   - Enquire (opens progressive form)
 *
 * Hidden on mobile (StickyLeadBar handles that).
 * Appears after 3s on page.
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useLeadStore } from '@/store'

interface FloatingCTAProps {
  phone?: string
  whatsapp?: string
  onEnquireClick?: () => void
  propertyTitle?: string
}

export default function FloatingCTA({
  phone = '+919999999999',
  whatsapp = '919999999999',
  onEnquireClick,
  propertyTitle,
}: FloatingCTAProps) {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(true)
  const { hasLeadBeenCaptured } = useLeadStore()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(t)
  }, [])

  const whatsappMsg = propertyTitle
    ? `Hi, I'm interested in ${propertyTitle}`
    : `Hi, I'm looking for a property in Gurugram`

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed right-4 bottom-8 z-30 hidden lg:flex flex-col items-end gap-2"
        >
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="flex flex-col gap-2"
              >
                {/* Call */}
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-2 bg-white shadow-luxury-md border border-navy/8 rounded-full px-4 py-2.5 text-xs font-syne font-semibold text-navy hover:bg-cream transition-all group"
                  aria-label="Call us"
                >
                  <div className="w-7 h-7 rounded-full bg-navy/8 group-hover:bg-gold/20 flex items-center justify-center transition-colors">
                    <Phone className="w-3.5 h-3.5 text-navy group-hover:text-gold transition-colors" />
                  </div>
                  Call Expert
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] shadow-luxury-md rounded-full px-4 py-2.5 text-xs font-syne font-semibold text-white hover:bg-[#1eb356] transition-all"
                  aria-label="WhatsApp"
                >
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                  WhatsApp
                </a>

                {/* Enquire */}
                {!hasLeadBeenCaptured && onEnquireClick && (
                  <button
                    onClick={onEnquireClick}
                    className="flex items-center gap-2 bg-gold shadow-gold rounded-full px-4 py-2.5 text-xs font-syne font-semibold text-navy hover:bg-gold-600 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-navy/15 flex items-center justify-center">
                      <span className="text-[10px] font-bold">✉</span>
                    </div>
                    Free Consultation
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle button */}
          <button
            onClick={() => setExpanded((e) => !e)}
            className="w-10 h-10 rounded-full bg-navy shadow-luxury-md flex items-center justify-center text-white hover:bg-navy-700 transition-colors"
            aria-label={expanded ? 'Collapse' : 'Expand contact options'}
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
