'use client'
import { useState, useEffect } from 'react'
import SiteLayout from '@/components/layout/SiteLayout'
import { motion } from 'framer-motion'
import { Clock, Flame, CheckCircle, Star, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getStoredUTM } from '@/hooks/useUTMCapture'
import { useLeadStore } from '@/store'

// Static metadata exported separately for SSR compatibility
// export const metadata: Metadata = { title: 'Pre-Launch Projects Gurugram 2026 | VIP Access | DigiSoft', description: '...' }

const PRE_LAUNCH_PROJECTS = [
  { id:'1', title:'Godrej Emerald Phase 2', developer:'Godrej Properties', location:'Sector 89, Gurugram', launchDate:'March 15, 2026', priceTeaser:'Expected from ₹1.5 Cr', units:'320 units', registrations:847, capacity:1000, image:'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80', imageAlt:'Godrej Emerald Phase 2 pre-launch Sector 89 Gurugram apartments', perks:['Pre-launch pricing 12-18% lower', 'Early floor selection', 'Exclusive payment plans'], slug:'godrej-emerald-sector-89' },
  { id:'2', title:'M3M Golfestate 2.0', developer:'M3M India', location:'Sector 65, Gurugram', launchDate:'April 1, 2026', priceTeaser:'Expected from ₹3.2 Cr', units:'180 units', registrations:562, capacity:750, image:'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80', imageAlt:'M3M Golfestate 2.0 pre-launch luxury apartments Sector 65 Gurugram', perks:['Golf course facing units available', 'Smart home tech standard', 'Priority unit allotment'], slug:'m3m-altitude-sector-65' },
  { id:'3', title:'DLF Privana South', developer:'DLF Limited', location:'Sector 77, Gurugram', launchDate:'May 20, 2026', priceTeaser:'Expected from ₹4.5 Cr', units:'240 units', registrations:1203, capacity:1500, image:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', imageAlt:'DLF Privana South pre-launch luxury apartments Sector 77 Gurugram', perks:['DLF Ultra-Luxury segment', '70+ years brand trust', 'Green building certified'], slug:'dlf-privana-sector-77' },
]

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) return setTime({ d: 0, h: 0, m: 0, s: 0 })
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return (
    <div className="flex gap-1.5">
      {[{ v: time.d, l: 'D' }, { v: time.h, l: 'H' }, { v: time.m, l: 'M' }, { v: time.s, l: 'S' }].map(t => (
        <div key={t.l} className="bg-navy/10 rounded-lg px-2 py-1.5 text-center min-w-[40px]">
          <p className="font-mono font-bold text-base text-navy leading-none">{String(t.v).padStart(2,'0')}</p>
          <p className="text-[8px] text-mid-grey font-syne">{t.l}</p>
        </div>
      ))}
    </div>
  )
}

function VIPRegistrationForm({ project }: { project: any }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', consent: false })
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
        body: JSON.stringify({ first_name: form.name, email: form.email, phone: form.phone, consent_given: true, consent_text: 'I consent to Digisoft Nexus sharing my data with the relevant developer for property inquiries and marketing communication', property_interest: project.title, profile_stage: 2, ...utm }),
      })
      markLeadCaptured()
    } catch {}
    setLoading(false)
    setDone(true)
  }

  if (done) return (
    <div className="text-center py-6">
      <CheckCircle className="w-10 h-10 text-success mx-auto mb-3" />
      <p className="font-syne font-semibold text-sm text-navy mb-1">VIP Access Confirmed! 🔑</p>
      <p className="text-xs text-dark-grey">You'll get first dibs on {project.title} launch pricing via WhatsApp.</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="text" placeholder="Your Name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required className="form-input text-sm" />
      <input type="tel" placeholder="Mobile Number" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} required className="form-input text-sm" />
      <input type="email" placeholder="Email (optional)" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="form-input text-sm" />
      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" checked={form.consent} onChange={e => setForm(f => ({...f, consent: e.target.checked}))} required className="mt-0.5 accent-navy w-3.5 h-3.5 shrink-0" />
        <span className="text-[10px] text-dark-grey">I consent to Digisoft Nexus sharing my data with the relevant developer for property inquiries and marketing communication.</span>
      </label>
      <button type="submit" disabled={!form.consent || loading} className="btn btn-gold w-full justify-center gap-2 text-sm disabled:opacity-50">
        <Lock className="w-3.5 h-3.5" /> {loading ? 'Registering…' : 'Get VIP Access →'}
      </button>
    </form>
  )
}

export default function PreLaunchPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-navy py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-40" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/8 rounded-full blur-3xl" />
        <div className="container-site relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 rounded-full px-4 py-1.5 mb-6">
              <Flame className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span className="font-syne text-xs font-semibold uppercase tracking-widest text-gold">Limited Pre-Launch Slots</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-semibold mb-4">
              Pre-Launch Exclusives 2026
            </h1>
            <p className="text-white/55 text-lg max-w-xl mx-auto mb-8">
              Get first access to Gurugram's most anticipated projects — at 12-18% below post-launch pricing. VIP slots are strictly limited.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { v: '3', l: 'Pre-Launch Projects' },
                { v: '2,612', l: 'VIP Registrations' },
                { v: '18%', l: 'Avg. Below Launch Price' },
                { v: '48hr', l: 'Avg. Slot Booking Time' },
              ].map(stat => (
                <div key={stat.l} className="bg-white/6 border border-white/10 rounded-xl px-5 py-3 text-center">
                  <p className="font-display text-2xl font-semibold text-gold">{stat.v}</p>
                  <p className="text-white/45 text-[11px] font-syne">{stat.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section className="section bg-cream">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="section-label mb-2">Opening Soon</p>
            <h2 className="section-title">Register Now — Before Public Launch</h2>
          </div>

          <div className="space-y-8">
            {PRE_LAUNCH_PROJECTS.map((project, i) => {
              const fillPct = Math.round((project.registrations / project.capacity) * 100)
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="card overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
                    {/* Image */}
                    <div className="md:col-span-2 relative h-60 md:h-auto overflow-hidden">
                      <img src={project.image} alt={project.imageAlt} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="badge bg-gold text-navy text-xs">Pre-Launch</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="md:col-span-2 p-6 flex flex-col justify-between">
                      <div>
                        <p className="section-label mb-1">{project.developer}</p>
                        <h3 className="font-display text-2xl font-semibold text-navy mb-2">{project.title}</h3>
                        <p className="text-sm text-dark-grey mb-1">📍 {project.location}</p>
                        <p className="text-sm text-dark-grey mb-4">🏠 {project.units} · {project.priceTeaser}</p>

                        {/* Perks */}
                        <ul className="space-y-1.5 mb-5">
                          {project.perks.map(p => (
                            <li key={p} className="flex items-center gap-2 text-xs text-dark-grey">
                              <Star className="w-3.5 h-3.5 text-gold fill-gold shrink-0" />{p}
                            </li>
                          ))}
                        </ul>

                        {/* Countdown */}
                        <div className="mb-4">
                          <p className="text-xs font-syne text-mid-grey mb-2 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Launch in:
                          </p>
                          <CountdownTimer targetDate={project.launchDate} />
                        </div>

                        {/* Slots progress */}
                        <div>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-dark-grey">{project.registrations} registered</span>
                            <span className="font-syne font-semibold text-navy">{project.capacity - project.registrations} slots left</span>
                          </div>
                          <div className="h-2 bg-navy/8 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-gold rounded-full transition-all" style={{ width: `${fillPct}%` }} />
                          </div>
                          <p className="text-[10px] text-mid-grey mt-1">{fillPct}% of VIP slots filled</p>
                        </div>
                      </div>
                    </div>

                    {/* VIP Form */}
                    <div className="md:col-span-1 bg-cream p-6 flex flex-col justify-center border-t md:border-t-0 md:border-l border-navy/8">
                      <p className="font-syne font-semibold text-sm text-navy mb-4 flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-gold" /> VIP Registration
                      </p>
                      <VIPRegistrationForm project={project} />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
