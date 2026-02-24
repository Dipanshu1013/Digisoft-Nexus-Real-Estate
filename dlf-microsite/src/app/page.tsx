import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Shield, Award, MapPin } from 'lucide-react'
import { DLF_BRAND, DLF_PROJECTS } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'DLF Properties Gurugram | DLF Privana West & North | DigiSoft Nexus',
  description:
    'Authorised channel partner for DLF Limited in Gurugram. DLF Privana West, DLF Privana North. India\'s most trusted developer. Expert advisory, VIP pricing.',
  alternates: { canonical: 'https://dlf.digisoftnexus.com' },
}

// Inline LeadForm component - DLF branded
function DLFLeadForm({ source }: { source: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl overflow-hidden">
      <div className="h-1" style={{ background: 'linear-gradient(90deg, #0B1F4A, #D4AF37)' }} />
      <div className="p-6">
        <p className="text-[#D4AF37] text-[10px] font-semibold uppercase tracking-widest mb-1">DLF Properties</p>
        <h3 className="font-serif text-lg font-semibold text-white mb-4">
          Get VIP Access & Pricing
        </h3>
        {/* Form fields - static markup, JS handled by MicrositeLeadForm pattern */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Your Full Name"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#D4AF37] transition-all"
          />
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm">+91</span>
            <input
              type="tel"
              placeholder="Mobile Number"
              className="w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>
          <select className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white/70 outline-none focus:border-[#D4AF37] appearance-none">
            <option value="">Preferred Configuration</option>
            <option>3 BHK Ultra Luxury</option>
            <option>4 BHK Signature</option>
            <option>Penthouse</option>
          </select>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" className="mt-0.5 w-3.5 h-3.5 shrink-0" required />
            <span className="text-[10px] text-white/50 leading-relaxed">
              I consent to DigiSoft Nexus and DLF Limited sharing my data for property inquiries.{' '}
              <a href="/privacy-policy" className="text-[#D4AF37] hover:underline">Privacy Policy</a>
            </span>
          </label>
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-sm"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #B8961E)', color: '#0B1F4A' }}
          >
            Request Expert Callback
          </button>
        </div>
        <p className="text-[9px] text-white/30 text-center mt-3">
          🔒 RERA Verified · DPDP 2023 Compliant
        </p>
      </div>
    </div>
  )
}

export default function DLFHomePage() {
  return (
    <div className="font-sans bg-[#F5F7FA] text-[#0D1B2A]">
      {/* ── HEADER ────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0B1F4A] shadow-lg">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center border border-white/20">
              <span className="text-white font-bold text-xs">DLF</span>
            </div>
            <div>
              <p className="font-serif font-semibold text-white text-sm">DLF Properties</p>
              <p className="text-[9px] text-white/40">by DigiSoft Nexus</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {DLF_PROJECTS.map((p) => (
              <Link key={p.id} href={`/projects/${p.slug}`}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                {p.name}
              </Link>
            ))}
          </div>
          <Link href="/contact"
            className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            style={{ background: '#D4AF37', color: '#0B1F4A' }}>
            Get VIP Pricing
          </Link>
        </div>
      </header>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={DLF_PROJECTS[0].images[0].url} alt="DLF Privana West Gurugram"
            className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, rgba(11,31,74,0.97) 0%, rgba(11,31,74,0.88) 60%, rgba(11,31,74,0.75) 100%)'
          }} />
        </div>

        <div className="max-w-screen-xl mx-auto px-4 md:px-8 relative z-10 py-24 pt-36">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border"
                style={{ borderColor: 'rgba(192,192,192,0.3)', background: 'rgba(192,192,192,0.05)' }}>
                <Shield className="w-3.5 h-3.5" style={{ color: '#C0C0C0' }} />
                <span className="text-xs font-semibold" style={{ color: '#C0C0C0' }}>Authorised Channel Partner</span>
              </div>

              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] mb-6">
                DLF Properties<br />
                <span style={{ background: 'linear-gradient(135deg, #D4AF37, #EDCC55)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Gurugram
                </span>
              </h1>

              <p className="text-white/65 text-lg leading-relaxed mb-8 max-w-xl">
                India's largest publicly listed real estate developer. 75+ years of trust.
                DLF Privana — the most sought-after address in NCR.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {DLF_BRAND.stats.map((s) => (
                  <div key={s.label} className="text-center p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="font-serif text-lg font-semibold" style={{ color: '#D4AF37' }}>{s.value}</p>
                    <p className="text-[10px] text-white/50 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href={`/projects/${DLF_PROJECTS[0].slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
                  style={{ background: '#D4AF37', color: '#0B1F4A' }}>
                  View DLF Privana <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white border border-white/20 hover:bg-white/5 transition-colors">
                  About DLF
                </Link>
              </div>
            </div>

            <DLFLeadForm source="dlf-homepage-hero" />
          </div>
        </div>
      </section>

      {/* ── PROJECTS ──────────────────────────────────────────── */}
      <section className="py-16 md:py-20" style={{ background: '#F5F7FA' }}>
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <p className="text-[#0B1F4A] text-xs font-semibold uppercase tracking-widest mb-2">DLF Portfolio</p>
            <h2 className="font-serif text-4xl font-semibold text-[#0D1B2A]">
              Gurugram Projects
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {DLF_PROJECTS.map((project) => (
              <Link key={project.id} href={`/projects/${project.slug}`} className="group">
                <div className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-shadow">
                  <div className="relative h-56 overflow-hidden">
                    <img src={project.images[0].url} alt={project.images[0].alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        project.status === 'pre-launch' ? 'bg-amber-500 text-white' : 'bg-[#0B1F4A] text-white'
                      }`}>
                        {project.status === 'pre-launch' ? '🔴 Pre-Launch' : '🟢 Under Construction'}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-serif text-2xl font-semibold text-white">{project.name}</h3>
                      <p className="flex items-center gap-1 text-white/65 text-xs mt-1">
                        <MapPin className="w-3 h-3" /> {project.location}
                      </p>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-serif text-xl font-semibold" style={{ color: '#0B1F4A' }}>{project.priceRange}</p>
                      <p className="text-xs text-[#4A5568]">Possession: {project.possession}</p>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      {project.highlights.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-[#0B1F4A] shrink-0" />
                          <span className="text-[11px] text-[#4A5568]">{h}</span>
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-[#0B1F4A] flex items-center gap-1">
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{ background: '#0B1F4A' }} className="text-white/60 py-10">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-serif text-white font-semibold">DLF Properties — DigiSoft Nexus</p>
              <p className="text-xs mt-1">Authorised channel partner for DLF Limited</p>
            </div>
            <div className="text-[10px] text-center">
              <p>RERA: HARERA/GGM/2024/2345 · hrera.in</p>
              <p className="mt-1">© {new Date().getFullYear()} DigiSoft Nexus · Prices indicative, subject to change</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
