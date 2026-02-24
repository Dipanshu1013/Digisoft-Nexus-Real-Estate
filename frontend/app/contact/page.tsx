'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, Mail, MapPin, Clock, CheckCircle, Loader2 } from 'lucide-react'
import SiteLayout from '@/components/layout/SiteLayout'
import { getStoredUTM } from '@/lib/utils'

const ENQUIRY_TYPES = [
  'I want to buy a property',
  'I want to invest in real estate',
  'I want information on pre-launch projects',
  'I want to sell my property',
  'Other',
]

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', enquiryType: '', message: '', consent: false,
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        phone: `+91${form.phone}`,
        source: 'contact-form',
        ...getStoredUTM(),
        page_url: window.location.href,
      }
      await fetch('/api/leads/capture/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch {}
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <SiteLayout>
      {/* Header */}
      <section className="bg-navy py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="container-site relative z-10">
          <nav className="text-white/40 text-xs font-syne mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-white/70">Home</Link>
            <span>/</span>
            <span className="text-gold">Contact</span>
          </nav>
          <h1 className="font-display text-hero-sm text-white mb-3">Get In Touch</h1>
          <p className="text-white/60 text-base max-w-xl">
            Our expert advisors are ready to help you find your dream property. 
            Real humans, not chatbots.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-cream">
        <div className="container-site">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left — Contact Info */}
            <div>
              <h2 className="font-syne font-bold text-navy text-base mb-6">Reach Us</h2>
              <div className="space-y-5">
                {[
                  {
                    icon: Phone,
                    title: 'Call Us',
                    lines: ['+91 99999 99999', 'Mon–Sat, 9am–8pm'],
                    action: 'tel:+919999999999',
                  },
                  {
                    icon: MessageCircle,
                    title: 'WhatsApp',
                    lines: ['+91 99999 99999', 'Instant brochures & site visit booking'],
                    action: 'https://wa.me/919999999999',
                  },
                  {
                    icon: Mail,
                    title: 'Email',
                    lines: ['hello@digisoftnexus.com', 'We reply within 24 hours'],
                    action: 'mailto:hello@digisoftnexus.com',
                  },
                  {
                    icon: MapPin,
                    title: 'Office',
                    lines: ['Golf Course Road, Gurugram', 'Haryana 122002'],
                    action: null,
                  },
                ].map(({ icon: Icon, title, lines, action }) => (
                  <div key={title} className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <p className="font-syne font-semibold text-navy text-xs">{title}</p>
                      {lines.map((l, i) => (
                        <p key={i} className={`text-xs mt-0.5 ${i === 0 ? 'text-dark-grey' : 'text-mid-grey'}`}>{l}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-navy/5 rounded-xl2 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gold" />
                  <span className="font-syne font-semibold text-navy text-xs">Office Hours</span>
                </div>
                <div className="text-xs text-dark-grey space-y-1">
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span className="font-medium">9:00am – 8:00pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">10:00am – 6:00pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium text-mid-grey">By appointment</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl3 shadow-luxury p-10 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="font-syne font-bold text-xl text-navy mb-2">Message Received!</h3>
                  <p className="text-dark-grey text-sm">Our team will reach out within 30 minutes.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl3 shadow-luxury p-6 md:p-8">
                  <h2 className="font-syne font-bold text-lg text-navy mb-6">Send Us a Message</h2>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input type="text" className="form-input" value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div>
                      <label className="form-label">Phone *</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-dark-grey">+91</span>
                        <input type="tel" className="form-input pl-12" value={form.phone}
                          onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                          required inputMode="numeric" />
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">What are you looking for?</label>
                    <select className="form-input appearance-none" value={form.enquiryType}
                      onChange={e => setForm(f => ({ ...f, enquiryType: e.target.value }))}>
                      <option value="">Select enquiry type</option>
                      {ENQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Message</label>
                    <textarea className="form-input resize-none" rows={4} value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us more about your requirements — budget, location, configuration..." />
                  </div>
                  <div className="mb-5">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input type="checkbox" className="mt-0.5 w-4 h-4 accent-navy shrink-0"
                        checked={form.consent} onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))} required />
                      <span className="text-[11px] text-dark-grey leading-relaxed">
                        I consent to Digisoft Nexus sharing my data with the relevant developer for property
                        inquiries and marketing communication.{' '}
                        <Link href="/privacy-policy" className="text-gold hover:underline">Privacy Policy</Link>
                      </span>
                    </label>
                  </div>
                  <button type="submit" disabled={loading} className="btn btn-primary w-full">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
