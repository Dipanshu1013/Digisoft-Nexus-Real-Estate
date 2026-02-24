'use client'
/**
 * InlineLeadForm
 *
 * Compact lead capture form to embed within article content,
 * blog posts, hyperlocal pages, or between property sections.
 *
 * Usage:
 *   <InlineLeadForm
 *     headline="Looking for property in Gurugram?"
 *     source="gurugram-blog-inline"
 *   />
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, CheckCircle, Loader2, ArrowRight } from 'lucide-react'
import { submitLead, validatePhone, validateName, CONSENT_TEXT } from '@/lib/leadCapture'
import { useLeadStore } from '@/store'
import { trackFormView, trackFormSubmit, trackLeadCaptured } from '@/lib/analytics'

interface InlineLeadFormProps {
  headline?: string
  subheadline?: string
  cta?: string
  source: string
  propertySlug?: string
  campaignSlug?: string
  /** Background variant */
  bg?: 'cream' | 'navy' | 'white' | 'gold'
  className?: string
}

export default function InlineLeadForm({
  headline = 'Get Free Expert Consultation',
  subheadline = 'Our advisor will call you within 30 minutes',
  cta = 'Call Me Back',
  source,
  propertySlug,
  campaignSlug,
  bg = 'cream',
  className = '',
}: InlineLeadFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const { hasLeadBeenCaptured, markLeadCaptured } = useLeadStore()

  const bgClasses = {
    cream: 'bg-cream border border-navy/8',
    navy: 'bg-navy',
    white: 'bg-white border border-navy/8 shadow-card',
    gold: 'bg-gradient-gold',
  }

  const textColor = bg === 'navy' ? 'text-white' : 'text-navy'
  const subtextColor = bg === 'navy' ? 'text-white/60' : 'text-dark-grey'

  if (hasLeadBeenCaptured || done) {
    return (
      <div className={`rounded-xl2 p-5 ${bgClasses[bg]} ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-success/15 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className={`font-syne font-bold text-sm ${textColor}`}>
              You're all set! Expect a call within 30 minutes.
            </p>
            <p className={`text-xs mt-0.5 ${subtextColor}`}>
              We'll also send the project brochure to your WhatsApp.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    const nameErr = validateName(name)
    if (nameErr) errs.name = nameErr
    const phoneErr = validatePhone(phone)
    if (phoneErr) errs.phone = phoneErr
    if (!consent) errs.consent = 'Please accept the terms to continue'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    trackFormSubmit(source)

    const result = await submitLead({
      first_name: name.trim().split(' ')[0],
      last_name: name.trim().split(' ').slice(1).join(' '),
      phone: `+91${phone}`,
      property_interest: propertySlug,
      campaign_slug: campaignSlug,
      source,
      profile_stage: 1,
      consent_given: true,
      consent_text: CONSENT_TEXT,
    })

    setLoading(false)

    if (result.success || result.alreadySubmitted) {
      markLeadCaptured()
      trackLeadCaptured(source, campaignSlug)
      setDone(true)
    } else if (result.rateLimited) {
      setErrors({ phone: 'Please wait 30 seconds before submitting again.' })
    } else {
      setErrors({ phone: result.error || 'Something went wrong. Please try again.' })
    }
  }

  return (
    <div className={`rounded-xl2 p-5 md:p-6 ${bgClasses[bg]} ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        {/* Copy */}
        <div className="flex-1">
          <p className={`font-display text-xl font-semibold leading-tight ${textColor}`}>
            {headline}
          </p>
          <p className={`text-xs mt-1 ${subtextColor}`}>{subheadline}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => trackFormView(source)}
                className={`form-input text-sm py-2.5 ${errors.name ? 'border-error' : ''}`}
              />
              {errors.name && <p className="text-error text-[10px] mt-0.5">{errors.name}</p>}
            </div>
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-dark-grey">+91</span>
                <input
                  type="tel"
                  placeholder="Mobile No."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`form-input text-sm py-2.5 pl-9 ${errors.phone ? 'border-error' : ''}`}
                  inputMode="numeric"
                />
              </div>
              {errors.phone && <p className="text-error text-[10px] mt-0.5">{errors.phone}</p>}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id={`inline-consent-${source}`}
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 w-3.5 h-3.5 accent-navy shrink-0"
            />
            <label
              htmlFor={`inline-consent-${source}`}
              className={`text-[10px] leading-relaxed cursor-pointer ${subtextColor}`}
            >
              {CONSENT_TEXT}.{' '}
              <a href="/privacy-policy" className="text-gold hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.consent && <p className="text-error text-[10px]">{errors.consent}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`btn btn-sm w-full justify-center gap-2 ${
              bg === 'navy' || bg === 'gold'
                ? 'bg-gold text-navy hover:bg-gold-600 border-0'
                : 'btn-primary'
            } disabled:opacity-50`}
          >
            {loading ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...</>
            ) : (
              <><Phone className="w-3.5 h-3.5" /> {cta}</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
