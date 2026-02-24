'use client'
import { useState } from 'react'
import { Phone, CheckCircle, Loader2, Lock, ArrowRight } from 'lucide-react'
import { GODREJ_BRAND } from '@/lib/brand'

const CONSENT_TEXT =
  'I consent to DigiSoft Nexus and Godrej Properties sharing my data for property inquiries and marketing communication'

interface MicrositeLeadFormProps {
  projectName?: string
  projectSlug?: string
  source?: string
  variant?: 'hero' | 'sidebar' | 'modal' | 'inline'
  onSuccess?: () => void
}

export default function MicrositeLeadForm({
  projectName = 'Godrej Properties',
  projectSlug,
  source = 'microsite-form',
  variant = 'hero',
  onSuccess,
}: MicrositeLeadFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [config, setConfig] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim() || name.trim().length < 2) errs.name = 'Please enter your full name'
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 10) errs.phone = 'Please enter a valid 10-digit mobile number'
    else if (!/^[6-9]/.test(digits)) errs.phone = 'Enter a valid Indian mobile number'
    if (!consent) errs.consent = 'Please accept the terms to continue'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    // Read stored UTM from localStorage
    let utmData: Record<string, string> = {}
    try {
      const raw = localStorage.getItem('digisoft_utm')
      if (raw) utmData = JSON.parse(raw)
    } catch {}

    const payload = {
      first_name: name.trim().split(' ')[0],
      last_name: name.trim().split(' ').slice(1).join(' '),
      phone: `+91${phone.replace(/\D/g, '')}`,
      property_interest: projectName,
      property_slug: projectSlug,
      preferred_config: config,
      source,
      profile_stage: 1,
      consent_given: true,
      consent_text: CONSENT_TEXT,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      ...utmData,
    }

    try {
      await fetch('/api/leads/capture/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch {}

    setLoading(false)
    setDone(true)
    onSuccess?.()
  }

  if (done) {
    return (
      <div className={`${variant === 'hero' ? 'bg-white/10 backdrop-blur-sm text-white' : 'bg-white'} rounded-2xl p-6 text-center`}>
        <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-7 h-7 text-green-400" />
        </div>
        <p className={`font-display font-semibold text-lg mb-1 ${variant === 'hero' ? 'text-white' : 'text-[#1A2E25]'}`}>
          You're on the VIP List!
        </p>
        <p className={`text-xs leading-relaxed ${variant === 'hero' ? 'text-white/70' : 'text-[#4A7260]'}`}>
          Our {projectName} expert will call you within 30 minutes.
          Check WhatsApp for the brochure.
        </p>
      </div>
    )
  }

  const isHero = variant === 'hero'

  return (
    <div className={`rounded-2xl overflow-hidden ${
      isHero
        ? 'bg-white/10 backdrop-blur-sm border border-white/20'
        : 'bg-white shadow-xl border border-[#2D6A4F]/8'
    }`}>
      {/* Top accent */}
      <div className="h-1" style={{ background: 'linear-gradient(90deg, #2D6A4F, #D4AF37)' }} />

      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="mb-5">
          <p className={`text-[10px] font-semibold uppercase tracking-widest mb-1 ${
            isHero ? 'text-[#D4AF37]' : 'text-[#2D6A4F]'
          }`}>
            {projectName} — Enquire Now
          </p>
          <h3 className={`font-display text-lg font-semibold ${isHero ? 'text-white' : 'text-[#1A2E25]'}`}>
            Get VIP Pricing & Floor Plans
          </h3>
          <p className={`text-xs mt-1 ${isHero ? 'text-white/60' : 'text-[#4A7260]'}`}>
            Expert callback in 30 min · Free brochure on WhatsApp
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Your Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`input-godrej ${isHero ? 'bg-white/90 text-[#1A2E25] placeholder:text-[#1A2E25]/40' : ''} ${errors.name ? 'border-red-400' : ''}`}
            />
            {errors.name && <p className="text-red-400 text-[10px] mt-0.5">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium ${isHero ? 'text-[#1A2E25]/60' : 'text-[#4A7260]'}`}>+91</span>
              <input
                type="tel"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className={`input-godrej pl-12 ${isHero ? 'bg-white/90 text-[#1A2E25] placeholder:text-[#1A2E25]/40' : ''} ${errors.phone ? 'border-red-400' : ''}`}
                inputMode="numeric"
              />
            </div>
            {errors.phone && <p className="text-red-400 text-[10px] mt-0.5">{errors.phone}</p>}
          </div>

          {/* Config preference (optional) */}
          <select
            value={config}
            onChange={(e) => setConfig(e.target.value)}
            className={`input-godrej ${isHero ? 'bg-white/90 text-[#1A2E25]' : ''}`}
          >
            <option value="">Preferred Configuration (optional)</option>
            <option>2 BHK</option>
            <option>2.5 BHK</option>
            <option>3 BHK</option>
            <option>4 BHK</option>
            <option>Penthouse</option>
          </select>

          {/* Consent */}
          <div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 accent-[#2D6A4F] flex-shrink-0"
              />
              <span className={`text-[10px] leading-relaxed ${isHero ? 'text-white/60' : 'text-[#4A7260]'}`}>
                {CONSENT_TEXT}.{' '}
                <a href="/privacy-policy" className="text-[#D4AF37] hover:underline">Privacy Policy</a>
              </span>
            </label>
            {errors.consent && <p className="text-red-400 text-[10px] mt-0.5">{errors.consent}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-godrej-gold w-full justify-center text-sm disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
            ) : (
              <><Phone className="w-4 h-4" /> Request Expert Callback</>
            )}
          </button>
        </form>

        {/* Trust note */}
        <div className={`flex items-center gap-1.5 mt-3 justify-center ${isHero ? 'text-white/40' : 'text-[#4A7260]/60'}`}>
          <Lock className="w-3 h-3" />
          <span className="text-[9px]">RERA Verified · DPDP 2023 Compliant · No Spam</span>
        </div>
      </div>
    </div>
  )
}
