'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle, Phone, MessageCircle, Download, Timer, Star,
  MapPin, Bed, Maximize2, Shield, ArrowRight, ChevronDown, Loader2,
} from 'lucide-react'
import CountdownTimer from '@/components/ui/CountdownTimer'
import { storeUTM } from '@/lib/utils'

interface CampaignPageClientProps {
  campaign: any
  utmParams: Record<string, string>
}

export default function CampaignPageClient({ campaign, utmParams }: CampaignPageClientProps) {
  const [form, setForm] = useState({ name: '', phone: '', consent: false })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Persist UTM on mount
  useEffect(() => {
    storeUTM(utmParams)
    fetch(`/api/campaigns/${campaign.slug}/click/`, { method: 'POST' }).catch(() => {})
  }, [])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim() || form.name.length < 2) e.name = 'Please enter your name'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit number'
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
      const payload = {
        first_name: form.name.split(' ')[0],
        last_name: form.name.split(' ').slice(1).join(' ') || '',
        phone: `+91${form.phone}`,
        property_interest: campaign.title,
        campaign_slug: campaign.slug,
        source: 'campaign',
        consent_given: true,
        consent_text: 'I consent to Digisoft Nexus sharing my data with the relevant developer for property inquiries and marketing communication',
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        ...utmParams,
      }
      await fetch('/api/leads/capture/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch { /* soft fail */ }

    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-navy">
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[70vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={campaign.heroImage}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container-site py-12 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Copy */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-gold/20 text-gold text-[10px] font-syne font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-gold/30">
                  {campaign.developer}
                </span>
                <span className="bg-white/10 text-white/80 text-[10px] font-syne px-3 py-1 rounded-full">
                  {campaign.location}
                </span>
              </div>

              <h1 className="font-display text-hero-sm text-white mb-4 leading-tight">
                {campaign.tagline}
              </h1>

              <p className="text-white/70 text-base leading-relaxed mb-6 max-w-lg">
                {campaign.description}
              </p>

              {/* Price highlight */}
              <div className="flex items-baseline gap-3 mb-8">
                <span className="font-display text-3xl font-semibold text-gold">
                  {campaign.priceDisplay}
                </span>
                <span className="text-white/60 text-sm">Starting price</span>
              </div>

              {/* Countdown */}
              <CountdownTimer label={campaign.urgencyText} />
            </motion.div>

            {/* Right — Lead Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-white rounded-xl3 shadow-popup overflow-hidden"
            >
              {submitted ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="font-syne font-bold text-xl text-navy mb-2">You're Registered! 🎉</h3>
                  <p className="text-dark-grey text-sm mb-6">
                    Our expert will call you within <strong>15 minutes</strong>. 
                    Check WhatsApp — brochure + floor plans are on their way!
                  </p>
                  <div className="bg-green-50 rounded-xl p-4 mb-4 flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-green-600 shrink-0" />
                    <div className="text-left">
                      <p className="text-xs font-syne font-semibold text-green-800">WhatsApp Sent</p>
                      <p className="text-xs text-green-700">+91 {form.phone} — Project brochure + pricing</p>
                    </div>
                  </div>
                  <Link href={`/properties/${campaign.propertySlug}`} className="btn btn-primary w-full">
                    View Full Project Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <>
                  <div className="bg-navy p-5">
                    <h2 className="font-syne font-bold text-white text-base">
                      {campaign.leadMagnet}
                    </h2>
                    <p className="text-white/60 text-xs mt-1">
                      Free • Instant WhatsApp delivery • No spam
                    </p>
                  </div>
                  <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Name */}
                    <div>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className={`form-input ${errors.name ? 'border-error' : ''}`}
                        required
                      />
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

                    {/* Consent */}
                    <div>
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.consent}
                          onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))}
                          className="mt-0.5 w-4 h-4 accent-navy flex-shrink-0"
                          required
                        />
                        <span className="text-[11px] text-dark-grey leading-relaxed">
                          I consent to Digisoft Nexus sharing my data with the relevant developer for
                          property inquiries and marketing communication.{' '}
                          <Link href="/privacy-policy" className="text-gold hover:underline">Privacy Policy</Link>
                        </span>
                      </label>
                      {errors.consent && <p className="text-error text-xs mt-1">{errors.consent}</p>}
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary w-full text-sm">
                      {loading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                      ) : (
                        <><Download className="w-4 h-4" /> Get Free Brochure + Pricing</>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-1.5">
                      <Shield className="w-3 h-3 text-gold" />
                      <span className="text-[10px] text-mid-grey">DPDP compliant · No spam ever</span>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Configurations ─── */}
      <section className="bg-white py-12">
        <div className="container-site">
          <h2 className="font-display text-section text-navy text-center mb-2">
            Available Configurations
          </h2>
          <p className="text-center text-dark-grey text-sm mb-8">
            All prices are all-inclusive — no hidden charges
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {campaign.configurations.map((config: any, i: number) => (
              <motion.div
                key={config.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-cream rounded-xl2 p-6 border border-navy/8 hover:border-gold/40 hover:shadow-gold transition-all text-center"
              >
                <h3 className="font-syne font-bold text-lg text-navy mb-1">{config.type}</h3>
                <p className="text-dark-grey text-sm mb-3">{config.area}</p>
                <p className="font-display text-2xl font-semibold text-gold">{config.price}</p>
                <p className="text-xs text-mid-grey mt-1">Starting price</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Project Highlights ─── */}
      <section className="bg-cream py-12">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-display text-section text-navy mb-6">Why This Project?</h2>
              <ul className="space-y-3">
                {campaign.highlights.map((h: string, i: number) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-card"
                  >
                    <CheckCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <span className="text-dark-grey text-sm font-medium">{h}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-section text-navy mb-6">Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {campaign.amenities.map((a: string) => (
                  <div key={a} className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-card text-sm text-dark-grey">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Social Proof ─── */}
      <section className="bg-navy py-12">
        <div className="container-site text-center">
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {[
              { value: '1,200+', label: 'Families Helped' },
              { value: '₹500Cr+', label: 'Deals Closed' },
              { value: '4.8★', label: 'Average Rating' },
              { value: '10+', label: 'Years Experience' },
            ].map(s => (
              <div key={s.label}>
                <p className="font-display text-3xl font-semibold text-gold">{s.value}</p>
                <p className="text-white/60 text-xs font-syne mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-white/70 text-sm max-w-xl mx-auto mb-6">
            Digisoft Nexus is an authorised channel partner for {campaign.developer}. 
            Our advisors have helped over 1,200 families find their dream home.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:+919999999999" className="btn btn-outline-gold btn-sm gap-2">
              <Phone className="w-4 h-4" /> Call: +91 99999 99999
            </a>
            <a
              href={`https://wa.me/919999999999?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(campaign.title)}`}
              target="_blank" rel="noopener noreferrer"
              className="btn btn-sm gap-2 bg-[#25D366] text-white border-0 hover:bg-[#1eb356]"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA Bar ─── */}
      <div className="sticky bottom-0 bg-white border-t border-navy/10 shadow-popup py-3 px-4 md:hidden z-40">
        <div className="flex gap-3">
          <a href="tel:+919999999999" className="flex-1 btn btn-outline btn-sm justify-center gap-1.5">
            <Phone className="w-3.5 h-3.5" /> Call Now
          </a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-1 btn btn-primary btn-sm justify-center"
          >
            Get Brochure
          </button>
        </div>
      </div>
    </div>
  )
}
