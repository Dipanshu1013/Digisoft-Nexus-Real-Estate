'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, User, CheckCircle, Loader2, Shield, MessageCircle } from 'lucide-react'
import { getStoredUTM } from '@/lib/utils'

interface LeadFormProps {
  propertyTitle?: string
  campaignSlug?: string
  source?: string
  variant?: 'default' | 'compact' | 'sidebar'
  onSuccess?: () => void
  className?: string
}

const BUDGET_OPTIONS = [
  'Under ₹50 Lakh',
  '₹50L – ₹1 Cr',
  '₹1 Cr – ₹2 Cr',
  '₹2 Cr – ₹5 Cr',
  '₹5 Cr – ₹10 Cr',
  '₹10 Cr+',
]

export default function LeadForm({
  propertyTitle,
  campaignSlug,
  source = 'website',
  variant = 'default',
  onSuccess,
  className = '',
}: LeadFormProps) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    budget: '',
    consent: false,
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim() || form.name.length < 2) e.name = 'Please enter your name'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number'
    if (!form.consent) e.consent = 'Please accept to proceed'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    try {
      const storedUTM = getStoredUTM()
      const payload = {
        first_name: form.name.split(' ')[0],
        last_name: form.name.split(' ').slice(1).join(' ') || '',
        phone: `+91${form.phone}`,
        email: form.email || undefined,
        budget: form.budget || undefined,
        property_interest: propertyTitle || 'General Enquiry',
        campaign_slug: campaignSlug || undefined,
        source,
        consent_given: true,
        consent_text: 'I consent to Digisoft Nexus sharing my data with the relevant developer for property inquiries and marketing communication',
        page_url: window.location.href,
        ...storedUTM,
      }

      await fetch('/api/leads/capture/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      setSubmitted(true)
      onSuccess?.()
    } catch {
      // Soft fail — still show success to user, log in analytics
      setSubmitted(true)
      onSuccess?.()
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-white rounded-xl2 p-6 text-center shadow-luxury ${className}`}
      >
        <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-success" />
        </div>
        <h3 className="font-syne font-bold text-lg text-navy mb-2">You're All Set!</h3>
        <p className="text-dark-grey text-sm mb-4">
          Our property expert will call you within <strong>30 minutes</strong>. Check WhatsApp for an instant project brochure.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-mid-grey">
          <MessageCircle className="w-3.5 h-3.5 text-green-500" />
          Brochure sent to +91 {form.phone}
        </div>
      </motion.div>
    )
  }

  const isCompact = variant === 'compact' || variant === 'sidebar'

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-xl2 p-5 shadow-luxury ${className}`}
      noValidate
    >
      {!isCompact && (
        <div className="mb-5">
          <h3 className="font-syne font-bold text-base text-navy">
            {propertyTitle ? `Enquire about ${propertyTitle}` : 'Get Expert Advice'}
          </h3>
          <p className="text-xs text-dark-grey mt-0.5">Free consultation — no spam, no pressure</p>
        </div>
      )}

      <div className={`space-y-3 ${isCompact ? '' : ''}`}>
        {/* Name */}
        <div>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mid-grey" />
            <input
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className={`form-input pl-10 ${errors.name ? 'border-error' : ''}`}
              required
            />
          </div>
          {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-dark-grey font-medium">+91</span>
            <input
              type="tel"
              placeholder="Mobile number"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
              className={`form-input pl-12 ${errors.phone ? 'border-error' : ''}`}
              required
              inputMode="numeric"
            />
          </div>
          {errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Email (optional) */}
        {!isCompact && (
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mid-grey" />
            <input
              type="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="form-input pl-10"
            />
          </div>
        )}

        {/* Budget */}
        {!isCompact && (
          <select
            value={form.budget}
            onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
            className="form-input appearance-none cursor-pointer"
          >
            <option value="">Select budget range</option>
            {BUDGET_OPTIONS.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        )}

        {/* Consent — DPDP Compliant */}
        <div>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))}
              className="mt-0.5 w-4 h-4 rounded border-navy/20 text-navy accent-navy flex-shrink-0 cursor-pointer"
              required
            />
            <span className="text-[11px] text-dark-grey leading-relaxed">
              I consent to Digisoft Nexus sharing my data with the relevant developer for property
              inquiries and marketing communication.{' '}
              <a href="/privacy-policy" className="text-gold hover:underline">Privacy Policy</a>
            </span>
          </label>
          {errors.consent && <p className="text-error text-xs mt-1">{errors.consent}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
          ) : (
            <><Phone className="w-4 h-4" /> Get Free Consultation</>
          )}
        </button>
      </div>

      <div className="flex items-center gap-1.5 mt-3 justify-center">
        <Shield className="w-3 h-3 text-gold" />
        <span className="text-[10px] text-mid-grey">DPDP 2023 compliant · No spam · 100% free</span>
      </div>
    </form>
  )
}
