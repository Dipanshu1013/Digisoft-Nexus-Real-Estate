'use client'
import { useState } from 'react'
import { Download, CheckCircle } from 'lucide-react'
import { getStoredUTM } from '@/hooks/useUTMCapture'
import { useLeadStore } from '@/store'

export default function LeadMagnetPopup({ onClose, title }: { onClose: () => void; title?: string }) {
  const [email, setEmail] = useState('')
  const [name, setName]   = useState('')
  const [consent, setConsent] = useState(false)
  const [done, setDone]   = useState(false)
  const [loading, setLoading] = useState(false)
  const { updateLeadData, markLeadCaptured } = useLeadStore()

  const magnetTitle = title || 'Gurugram 2026 Investment ROI Forecast'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) return
    setLoading(true)
    const utm = getStoredUTM()
    updateLeadData({ firstName: name, email, consentGiven: true })
    try {
      await fetch('/api/leads/capture/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: name, email, consent_given: true, consent_text: 'I consent to Digisoft Nexus sharing my data with the relevant developer for property inquiries and marketing communication', property_interest: magnetTitle, profile_stage: 1, ...utm }),
      })
      markLeadCaptured()
    } catch {}
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h3 className="font-display text-xl font-semibold text-navy mb-2">Report Sent!</h3>
        <p className="text-sm text-dark-grey mb-5">Check your inbox for <strong>{magnetTitle}</strong>.</p>
        <button onClick={onClose} className="btn btn-primary w-full justify-center">Continue Browsing</button>
      </div>
    )
  }

  return (
    <div>
      <div className="h-1 bg-gradient-gold" />
      <div className="p-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
            <Download className="w-6 h-6 text-gold-600" />
          </div>
          <div className="pr-8">
            <p className="section-label mb-0.5">Free Download</p>
            <h3 className="font-display text-lg font-semibold text-navy leading-snug">{magnetTitle}</h3>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div><label className="form-label">Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" className="form-input" /></div>
          <div><label className="form-label">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" className="form-input" /></div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} required className="mt-0.5 accent-navy w-3.5 h-3.5 shrink-0" />
            <span className="text-[10px] text-dark-grey leading-relaxed">I consent to Digisoft Nexus sharing my data with the relevant developer for property inquiries and marketing communication.</span>
          </label>
          <button type="submit" disabled={!consent || loading} className="btn btn-gold w-full justify-center gap-2 disabled:opacity-50">
            {loading ? 'Sending…' : <><Download className="w-4 h-4" /> Send My Free Report</>}
          </button>
        </form>
      </div>
    </div>
  )
}
