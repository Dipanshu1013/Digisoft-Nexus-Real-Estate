'use client'
/**
 * ProgressiveLeadForm — 4-Stage Progressive Profiling
 *
 * Stage 1 — Awareness:    Name + Email → unlock 3D tour / brochure access
 * Stage 2 — Interest:     Phone + buyer/investor status → VIP listing alerts
 * Stage 3 — Consideration:Budget + city → floor plans + financial breakdown
 * Stage 4 — Intent:       Requirements + site visit → dedicated agent assignment
 *
 * Each stage submits independently so partial data is captured even if user drops off.
 * DPDP 2023 compliant — consent on Stage 1.
 */
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Phone, IndianRupee, MapPin, Calendar,
  CheckCircle, ArrowRight, ArrowLeft, Loader2, Gift, Star, Lock,
} from 'lucide-react'
import { useLeadStore } from '@/store'
import { submitLead, validateName, validatePhone, validateEmail, CONSENT_TEXT } from '@/lib/leadCapture'
import ProgressBar from '@/components/ui/ProgressBar'
import HCaptcha from '@/components/ui/HCaptcha'

const STAGES = [
  { num: 1, label: 'You',      unlock: '3D tour + Brochure',        icon: User },
  { num: 2, label: 'Contact',  unlock: 'VIP pricing alerts',        icon: Phone },
  { num: 3, label: 'Budget',   unlock: 'Floor plans + Financials',  icon: IndianRupee },
  { num: 4, label: 'Visit',    unlock: 'Dedicated agent',           icon: Calendar },
] as const

const BUYER_OPTIONS = [
  { value: 'buyer',    label: '🏠 End User / Buyer' },
  { value: 'investor', label: '📈 Investor' },
  { value: 'renter',   label: '🔑 Looking to Rent' },
  { value: 'nri',      label: '✈️ NRI Buyer' },
]

const BUDGET_OPTIONS = [
  'Under ₹50 Lakh',
  '₹50L – ₹1 Cr',
  '₹1 Cr – ₹2 Cr',
  '₹2 Cr – ₹5 Cr',
  '₹5 Cr – ₹10 Cr',
  '₹10 Cr+',
]

const NCR_CITIES = ['Gurugram', 'Noida', 'Delhi', 'Greater Noida', 'Faridabad', 'Other']

const TIMELINE_OPTIONS = [
  'Immediately (within 1 month)',
  'Short term (1–3 months)',
  'Medium term (3–6 months)',
  'Planning (6–12 months)',
  'Just exploring',
]

interface ProgressiveLeadFormProps {
  onClose?: () => void
  onComplete?: () => void
  propertySlug?: string
  campaignSlug?: string
  /** Start from a specific stage (e.g. if user already gave name/email) */
  startStage?: 1 | 2 | 3 | 4
  variant?: 'modal' | 'inline'
}

export default function ProgressiveLeadForm({
  onClose,
  onComplete,
  propertySlug,
  campaignSlug,
  startStage,
  variant = 'modal',
}: ProgressiveLeadFormProps) {
  const {
    currentStage: storedStage,
    leadData,
    updateLeadData,
    setStage,
    markLeadCaptured,
  } = useLeadStore()

  const [stage, setLocalStage] = useState<number>(startStage || storedStage)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [captchaToken, setCaptchaToken] = useState('')

  // Local form state (populated from Zustand store)
  const [s1, setS1] = useState({ name: leadData.firstName || '', email: leadData.email || '', consent: leadData.consentGiven || false })
  const [s2, setS2] = useState({ phone: leadData.phone || '', buyerStatus: leadData.buyerStatus || '' })
  const [s3, setS3] = useState({ budget: leadData.budget || '', city: leadData.currentCity || '' })
  const [s4, setS4] = useState({ requirements: leadData.specificRequirements || '', timeline: '' })

  const goToStage = (n: number) => {
    setLocalStage(n)
    setStage(n as any)
    setErrors({})
  }

  // ── Stage 1 ─────────────────────────────────────────────────
  const submitStage1 = async () => {
    const errs: Record<string, string> = {}
    const nameErr = validateName(s1.name)
    if (nameErr) errs.name = nameErr
    if (!s1.email) errs.email = 'Email is required for brochure delivery'
    else { const emailErr = validateEmail(s1.email); if (emailErr) errs.email = emailErr }
    if (!s1.consent) errs.consent = 'Please accept to continue'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    updateLeadData({ firstName: s1.name.split(' ')[0], email: s1.email, consentGiven: true })

    await submitLead({
      first_name: s1.name.split(' ')[0],
      last_name: s1.name.split(' ').slice(1).join(' ') || '',
      email: s1.email,
      phone: leadData.phone || 'not_yet_provided',
      property_interest: propertySlug,
      campaign_slug: campaignSlug,
      source: 'progressive-stage-1',
      profile_stage: 1,
      consent_given: true,
      consent_text: CONSENT_TEXT,
    })

    setLoading(false)
    goToStage(2)
  }

  // ── Stage 2 ─────────────────────────────────────────────────
  const submitStage2 = async () => {
    const errs: Record<string, string> = {}
    const phoneErr = validatePhone(s2.phone)
    if (phoneErr) errs.phone = phoneErr
    if (!s2.buyerStatus) errs.buyerStatus = 'Please select your buyer type'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    updateLeadData({ phone: `+91${s2.phone}`, buyerStatus: s2.buyerStatus as any })

    await submitLead({
      first_name: leadData.firstName || s1.name.split(' ')[0],
      email: leadData.email || s1.email,
      phone: `+91${s2.phone}`,
      property_interest: propertySlug,
      campaign_slug: campaignSlug,
      source: 'progressive-stage-2',
      profile_stage: 2,
      buyer_status: s2.buyerStatus,
      consent_given: true,
      consent_text: CONSENT_TEXT,
    })

    setLoading(false)
    goToStage(3)
  }

  // ── Stage 3 ─────────────────────────────────────────────────
  const submitStage3 = async () => {
    const errs: Record<string, string> = {}
    if (!s3.budget) errs.budget = 'Please select your budget range'
    if (!s3.city) errs.city = 'Please select your preferred city'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    updateLeadData({ budget: s3.budget, currentCity: s3.city })

    await submitLead({
      first_name: leadData.firstName || s1.name.split(' ')[0],
      email: leadData.email || s1.email,
      phone: leadData.phone || `+91${s2.phone}`,
      property_interest: propertySlug,
      campaign_slug: campaignSlug,
      source: 'progressive-stage-3',
      profile_stage: 3,
      budget: s3.budget,
      current_city: s3.city,
      consent_given: true,
      consent_text: CONSENT_TEXT,
    })

    setLoading(false)
    goToStage(4)
  }

  // ── Stage 4 ─────────────────────────────────────────────────
  const submitStage4 = async () => {
    setLoading(true)
    updateLeadData({ specificRequirements: s4.requirements })

    await submitLead({
      first_name: leadData.firstName || s1.name.split(' ')[0],
      email: leadData.email || s1.email,
      phone: leadData.phone || `+91${s2.phone}`,
      property_interest: propertySlug,
      campaign_slug: campaignSlug,
      source: 'progressive-stage-4',
      profile_stage: 4,
      specific_requirements: s4.requirements,
      hcaptcha_token: captchaToken || undefined,
      consent_given: true,
      consent_text: CONSENT_TEXT,
    })

    markLeadCaptured()
    setLoading(false)
    goToStage(5) // 5 = complete
    onComplete?.()
  }

  // ── Completed state ──────────────────────────────────────────
  if (stage === 5) {
    return (
      <div className="p-8 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-10 h-10 text-success" />
        </motion.div>
        <h3 className="font-display text-2xl font-semibold text-navy mb-2">
          Your Dedicated Expert is Assigned! 🎉
        </h3>
        <p className="text-dark-grey text-sm leading-relaxed mb-6 max-w-xs mx-auto">
          A specialist for your exact requirements — {s3.budget} budget in{' '}
          {s3.city || 'NCR'} — will call you within <strong>30 minutes</strong>.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left mb-5">
          <p className="text-xs font-syne font-semibold text-green-800 mb-1">What's Coming Your Way:</p>
          <ul className="text-xs text-green-700 space-y-1">
            <li>✓ WhatsApp brochure & floor plans (in 5 min)</li>
            <li>✓ Personalised shortlist based on your budget</li>
            <li>✓ Site visit booking confirmation</li>
            <li>✓ Pre-launch pricing sheet (if applicable)</li>
          </ul>
        </div>
        {onClose && (
          <button onClick={onClose} className="btn btn-outline btn-sm w-full justify-center">
            Continue Browsing
          </button>
        )}
      </div>
    )
  }

  const stageVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  return (
    <div className={variant === 'modal' ? '' : 'bg-white rounded-xl2 shadow-luxury overflow-hidden'}>
      {/* Top bar */}
      <div className="h-1 bg-gradient-gold w-full" />

      <div className="p-6">
        {/* Stage header */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-syne text-mid-grey">
              Step {stage} of {STAGES.length}
            </p>
            <span className="text-[10px] font-syne font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
              Unlock: {STAGES[stage - 1]?.unlock}
            </span>
          </div>
          <ProgressBar
            stages={STAGES.map((s) => ({ num: s.num, label: s.label }))}
            currentStage={stage}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            variants={stageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            {/* ─── STAGE 1: Name + Email ─── */}
            {stage === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-xl font-semibold text-navy mb-1">
                    Tell us who you are
                  </h3>
                  <p className="text-dark-grey text-xs">
                    Get instant access to the 3D tour and project brochure
                  </p>
                </div>

                <div>
                  <label className="form-label">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mid-grey" />
                    <input
                      type="text"
                      placeholder="Rahul Sharma"
                      value={s1.name}
                      onChange={(e) => setS1((f) => ({ ...f, name: e.target.value }))}
                      className={`form-input pl-10 ${errors.name ? 'border-error' : ''}`}
                      autoFocus
                    />
                  </div>
                  {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="form-label">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mid-grey" />
                    <input
                      type="email"
                      placeholder="rahul@email.com"
                      value={s1.email}
                      onChange={(e) => setS1((f) => ({ ...f, email: e.target.value }))}
                      className={`form-input pl-10 ${errors.email ? 'border-error' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
                </div>

                {/* DPDP Consent — Stage 1 */}
                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s1.consent}
                      onChange={(e) => setS1((f) => ({ ...f, consent: e.target.checked }))}
                      className="mt-0.5 w-4 h-4 accent-navy flex-shrink-0"
                      required
                    />
                    <span className="text-[11px] text-dark-grey leading-relaxed">
                      {CONSENT_TEXT}.{' '}
                      <a href="/privacy-policy" target="_blank" className="text-gold hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                  {errors.consent && <p className="text-error text-xs mt-1">{errors.consent}</p>}
                </div>

                <button
                  onClick={submitStage1}
                  disabled={loading}
                  className="btn btn-primary w-full justify-center"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                  ) : (
                    <>Get Instant Access <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            )}

            {/* ─── STAGE 2: Phone + Buyer Status ─── */}
            {stage === 2 && (
              <div className="space-y-4">
                <div className="bg-gold/8 rounded-xl p-3 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-gold shrink-0" />
                  <p className="text-xs text-navy font-syne font-semibold">
                    Brochure sent to {s1.email}! Now unlock VIP pricing alerts:
                  </p>
                </div>

                <div>
                  <label className="form-label">Mobile Number *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-dark-grey font-medium">+91</span>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      value={s2.phone}
                      onChange={(e) => setS2((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                      className={`form-input pl-12 ${errors.phone ? 'border-error' : ''}`}
                      inputMode="numeric"
                      autoFocus
                    />
                  </div>
                  {errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="form-label">I am a... *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {BUYER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setS2((f) => ({ ...f, buyerStatus: opt.value }))}
                        className={`text-xs font-syne font-medium px-3 py-2.5 rounded-xl border-2 transition-all text-left ${
                          s2.buyerStatus === opt.value
                            ? 'border-gold bg-gold/8 text-navy'
                            : 'border-navy/12 hover:border-navy/25 text-dark-grey'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {errors.buyerStatus && <p className="text-error text-xs mt-1">{errors.buyerStatus}</p>}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => goToStage(1)}
                    className="btn btn-ghost btn-sm gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    onClick={submitStage2}
                    disabled={loading}
                    className="btn btn-primary btn-sm flex-1 justify-center"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    ) : (
                      <>Get VIP Alerts <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ─── STAGE 3: Budget + City ─── */}
            {stage === 3 && (
              <div className="space-y-4">
                <div className="bg-gold/8 rounded-xl p-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-gold shrink-0" />
                  <p className="text-xs text-navy font-syne font-semibold">
                    Almost there! Share your budget to unlock detailed floor plans:
                  </p>
                </div>

                <div>
                  <label className="form-label">Budget Range *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {BUDGET_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setS3((f) => ({ ...f, budget: opt }))}
                        className={`text-xs font-syne font-medium px-3 py-2 rounded-xl border-2 transition-all text-left ${
                          s3.budget === opt
                            ? 'border-gold bg-gold/8 text-navy'
                            : 'border-navy/12 hover:border-navy/25 text-dark-grey'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {errors.budget && <p className="text-error text-xs mt-1">{errors.budget}</p>}
                </div>

                <div>
                  <label className="form-label">Preferred City *</label>
                  <div className="flex flex-wrap gap-2">
                    {NCR_CITIES.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => setS3((f) => ({ ...f, city }))}
                        className={`text-xs font-syne font-medium px-3 py-1.5 rounded-full border-2 transition-all ${
                          s3.city === city
                            ? 'border-gold bg-gold/8 text-navy'
                            : 'border-navy/12 hover:border-navy/25 text-dark-grey'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                  {errors.city && <p className="text-error text-xs mt-1">{errors.city}</p>}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => goToStage(2)} className="btn btn-ghost btn-sm gap-1.5">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    onClick={submitStage3}
                    disabled={loading}
                    className="btn btn-primary btn-sm flex-1 justify-center"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    ) : (
                      <>Unlock Floor Plans <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ─── STAGE 4: Requirements + Site Visit ─── */}
            {stage === 4 && (
              <div className="space-y-4">
                <div className="bg-gold/8 rounded-xl p-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gold shrink-0" />
                  <p className="text-xs text-navy font-syne font-semibold">
                    Final step — tell us exactly what you're looking for:
                  </p>
                </div>

                <div>
                  <label className="form-label">Purchase Timeline</label>
                  <select
                    value={s4.timeline}
                    onChange={(e) => setS4((f) => ({ ...f, timeline: e.target.value }))}
                    className="form-input appearance-none"
                  >
                    <option value="">When are you planning to buy?</option>
                    {TIMELINE_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Specific Requirements (optional)</label>
                  <textarea
                    placeholder="E.g. 3BHK, south-facing, near school, investment for rental income..."
                    value={s4.requirements}
                    onChange={(e) => setS4((f) => ({ ...f, requirements: e.target.value }))}
                    className="form-input resize-none"
                    rows={3}
                  />
                </div>

                <HCaptcha
                  onVerify={setCaptchaToken}
                  onExpire={() => setCaptchaToken('')}
                />

                <div className="flex gap-2">
                  <button onClick={() => goToStage(3)} className="btn btn-ghost btn-sm gap-1.5">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    onClick={submitStage4}
                    disabled={loading}
                    className="btn btn-primary btn-sm flex-1 justify-center"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Almost done...</>
                    ) : (
                      <>Book Site Visit <Calendar className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Skip link (except final stage) */}
        {stage < 4 && onClose && (
          <button
            onClick={onClose}
            className="block text-center text-[10px] text-mid-grey hover:text-dark-grey mt-3 w-full transition-colors"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  )
}
