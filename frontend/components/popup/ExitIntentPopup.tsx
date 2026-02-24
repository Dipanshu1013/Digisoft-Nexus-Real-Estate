'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react'
import { useLeadStore } from '@/store'
import { getStoredUTM } from '@/hooks/useUTMCapture'

const LEAD_MAGNETS = [
  {
    id: 'roi-report',
    icon: TrendingUp,
    title: 'Gurugram 2026 Investment ROI Forecast',
    subtitle: '48-page analyst report — sector-wise returns, upcoming projects, risk factors',
    badge: 'HNI Favourite',
  },
  {
    id: 'floor-plans',
    icon: Download,
    title: 'Godrej Emerald Floor Plans + Pre-Launch Pricing',
    subtitle: 'Exclusive access — full brochure, payment plan, price comparison',
    badge: 'Most Downloaded',
  },
]

export default function ExitIntentPopup({ onClose }: { onClose: () => void }) {
  const [selectedMagnet, setSelectedMagnet] = useState(LEAD_MAGNETS[0])
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { updateLeadData, markLeadCaptured, setStage } = useLeadStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) return
    setLoading(true)

    const utm = getStoredUTM()
    const payload = {
      first_name:    name.split(' ')[0] || name,
      email,
      consent_given: true,
      consent_text:  'I consent to Digisoft Nexus sharing my data with the relevant developer for property inquiries and marketing communication',
      property_interest: selectedMagnet.title,
      ...utm,
    }

    // Save to Zustand
    updateLeadData({ firstName: name.split(' ')[0], email, consentGiven: true })
    setStage(1)

    try {
      await fetch('/api/leads/capture/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      markLeadCaptured()
    } catch (e) { /* silent fail — still show success */ }

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-8 h-8 text-success" />
        </motion.div>
        <h3 className="font-display text-2xl font-semibold text-navy mb-2">Sent to Your Email! ✨</h3>
        <p className="text-dark-grey text-sm leading-relaxed mb-6">
          <strong>{selectedMagnet.title}</strong> has been sent to <strong>{email}</strong>. Check your inbox (and spam folder).
        </p>
        <button
          onClick={onClose}
          className="btn btn-primary w-full justify-center"
        >
          Continue Browsing <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-gold" />

      <div className="p-6 pt-5">
        {/* Header */}
        <div className="mb-5 pr-8">
          <p className="section-label mb-1">Exclusive Free Download</p>
          <h3 className="font-display text-2xl font-semibold text-navy leading-tight">
            Before you go — grab your free report
          </h3>
        </div>

        {/* Lead magnet selection */}
        <div className="flex flex-col gap-2.5 mb-5">
          {LEAD_MAGNETS.map((magnet) => (
            <button
              key={magnet.id}
              onClick={() => setSelectedMagnet(magnet)}
              className={`
                flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all
                ${selectedMagnet.id === magnet.id
                  ? 'border-gold bg-gold/5 shadow-gold'
                  : 'border-navy/10 hover:border-navy/25'
                }
              `}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${selectedMagnet.id === magnet.id ? 'bg-gold/20' : 'bg-navy/5'}`}>
                <magnet.icon className={`w-4 h-4 ${selectedMagnet.id === magnet.id ? 'text-gold-600' : 'text-dark-grey'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <p className="font-syne text-xs font-semibold text-navy leading-snug">{magnet.title}</p>
                  <span className="badge bg-navy text-gold text-[9px] shrink-0">{magnet.badge}</span>
                </div>
                <p className="text-xs text-dark-grey mt-0.5 leading-relaxed">{magnet.subtitle}</p>
              </div>
              {selectedMagnet.id === magnet.id && (
                <div className="w-4 h-4 rounded-full bg-gold flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-navy" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Your Name</label>
              <input
                type="text"
                placeholder="Rahul"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="form-input text-sm"
              />
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="rahul@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="form-input text-sm"
              />
            </div>
          </div>

          {/* DPDP Consent */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              className="mt-0.5 accent-navy w-3.5 h-3.5 shrink-0"
              required
            />
            <span className="text-[10px] text-dark-grey leading-relaxed">
              I consent to Digisoft Nexus sharing my data with the relevant developer for property inquiries and marketing communication.
            </span>
          </label>

          <button
            type="submit"
            disabled={!consent || loading}
            className="btn btn-gold w-full justify-center text-sm disabled:opacity-50"
          >
            {loading
              ? 'Sending…'
              : <><Download className="w-4 h-4" /> Send Me the Free Report</>
            }
          </button>
        </form>

        <p className="text-[10px] text-center text-mid-grey mt-3">
          🔒 No spam, unsubscribe anytime. DPDP Act 2023 compliant.
        </p>
      </div>
    </div>
  )
}
