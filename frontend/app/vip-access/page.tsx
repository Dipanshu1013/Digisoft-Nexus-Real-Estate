'use client'
import { useState } from 'react'
import SiteLayout from '@/components/layout/SiteLayout'
import { motion } from 'framer-motion'
import { Lock, Star, CheckCircle, Zap, Eye, Bell } from 'lucide-react'
import { getStoredUTM } from '@/hooks/useUTMCapture'
import { useLeadStore } from '@/store'

const VIP_BENEFITS = [
  { icon: Zap,  title: 'Pre-Launch Priority Access', desc: 'Get access 48 hours before public launch — best floors and units go first.' },
  { icon: Star, title: 'Pre-Launch Pricing', desc: 'VIP members get pricing 12-18% lower than post-launch market rates.' },
  { icon: Eye,  title: 'Exclusive Floor Plans', desc: 'Detailed floor plans, unit-specific price sheets, and payment plan options.' },
  { icon: Bell, title: 'Instant WhatsApp Alerts', desc: 'Be the first to know when a new high-demand project opens for registration.' },
]

const UPCOMING_PROJECTS = [
  { name: 'Godrej Emerald Phase 2', location: 'Sector 89, Gurugram', launchDate: 'March 2026', expectedPrice: '₹1.5 Cr+', slots: 23 },
  { name: 'M3M Golfestate 2.0',     location: 'Sector 65, Gurugram', launchDate: 'April 2026', expectedPrice: '₹3.2 Cr+', slots: 12 },
  { name: 'DLF Privana South',      location: 'Sector 77, Gurugram', launchDate: 'May 2026',   expectedPrice: '₹4.5 Cr+', slots: 8 },
]

export default function VIPAccessPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', budget: '', consent: false })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const { updateLeadData, markLeadCaptured } = useLeadStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.consent) return
    setLoading(true)
    const utm = getStoredUTM()
    updateLeadData({ firstName: form.name, phone: form.phone, email: form.email, consentGiven: true })
    try {
      await fetch('/api/leads/capture/', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: form.name, email: form.email, phone: form.phone, consent_given: true, consent_text: 'I consent to Digisoft Nexus sharing my data with the relevant developer for property inquiries and marketing communication', property_interest: 'VIP Early Access Program', profile_stage: 2, ...utm }),
      })
      markLeadCaptured()
    } catch {}
    setLoading(false)
    setDone(true)
  }

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-navy py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
        <div className="container-site relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 rounded-full px-5 py-2 mb-6">
              <Lock className="w-3.5 h-3.5 text-gold" />
              <span className="font-syne text-xs font-semibold uppercase tracking-widest text-gold">Exclusive Programme</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-white mb-5 leading-tight">
              DigiSoft<br /><span className="text-gold">VIP Early Access</span>
            </h1>
            <p className="text-white/55 text-lg max-w-xl mx-auto">
              Join 500+ savvy investors who get first access to Gurugram's most sought-after pre-launch projects — at pricing you won't find anywhere else.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-warm-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Left: Benefits + Upcoming */}
            <div className="lg:col-span-3 space-y-8">
              {/* Benefits */}
              <div>
                <p className="section-label mb-4">What VIP Members Get</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {VIP_BENEFITS.map(b => (
                    <div key={b.title} className="card p-5">
                      <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center mb-3">
                        <b.icon className="w-5 h-5 text-gold" />
                      </div>
                      <h3 className="font-syne font-semibold text-sm text-navy mb-1.5">{b.title}</h3>
                      <p className="text-xs text-dark-grey leading-relaxed">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming VIP projects */}
              <div>
                <p className="section-label mb-4">Upcoming VIP Projects</p>
                <div className="space-y-3">
                  {UPCOMING_PROJECTS.map(p => (
                    <div key={p.name} className="card p-4 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-syne font-semibold text-sm text-navy">{p.name}</h4>
                        <p className="text-xs text-dark-grey">{p.location} · Launch: {p.launchDate}</p>
                        <p className="text-xs text-gold font-medium mt-1">{p.expectedPrice}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-display text-2xl font-semibold text-navy">{p.slots}</p>
                        <p className="text-[10px] text-mid-grey font-syne">VIP slots left</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: VIP Registration form */}
            <div className="lg:col-span-2">
              <div className="sticky top-28 bg-white rounded-xl4 shadow-luxury-lg border border-navy/8 overflow-hidden">
                <div className="bg-gradient-to-br from-navy via-navy to-navy/80 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-5 h-5 text-gold" />
                    <p className="font-syne font-semibold text-sm uppercase tracking-wider text-gold">VIP Registration</p>
                  </div>
                  <h3 className="font-display text-2xl text-white font-semibold">Claim Your VIP Access</h3>
                  <p className="text-white/50 text-xs mt-1">Free. No obligation. Cancel anytime.</p>
                </div>

                {done ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-gold fill-gold" />
                    </div>
                    <h4 className="font-syne font-semibold text-lg text-navy mb-2">Welcome to VIP! 🥂</h4>
                    <p className="text-sm text-dark-grey mb-2">You're now on the priority list for all upcoming launches.</p>
                    <p className="text-xs text-mid-grey">Check WhatsApp — we've sent your VIP confirmation and upcoming project schedule.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div><label className="form-label">Full Name *</label><input type="text" placeholder="Rahul Sharma" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required className="form-input" /></div>
                    <div><label className="form-label">Mobile Number *</label><input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} required className="form-input" /></div>
                    <div><label className="form-label">Email Address</label><input type="email" placeholder="rahul@email.com" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="form-input" /></div>
                    <div>
                      <label className="form-label">Investment Budget</label>
                      <select value={form.budget} onChange={e => setForm(f => ({...f, budget: e.target.value}))} className="form-input">
                        <option value="">Select Budget Range</option>
                        <option>₹50L – ₹1 Cr</option><option>₹1 Cr – ₹2 Cr</option>
                        <option>₹2 Cr – ₹5 Cr</option><option>₹5 Cr – ₹10 Cr</option><option>₹10 Cr+</option>
                      </select>
                    </div>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.consent} onChange={e => setForm(f => ({...f, consent: e.target.checked}))} required className="mt-0.5 accent-navy w-3.5 h-3.5 shrink-0" />
                      <span className="text-[10px] text-dark-grey leading-relaxed">I consent to Digisoft Nexus sharing my data with the relevant developer for property inquiries and marketing communication.</span>
                    </label>
                    <button type="submit" disabled={!form.consent || loading} className="btn btn-gold w-full justify-center disabled:opacity-50">
                      {loading ? 'Registering…' : <><Lock className="w-4 h-4" /> Get VIP Access →</>}
                    </button>
                    <p className="text-[10px] text-center text-mid-grey">🔒 Your data is secure. Unsubscribe anytime.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
