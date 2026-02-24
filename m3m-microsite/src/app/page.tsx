import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle, MapPin, Zap } from 'lucide-react'
import { M3M_BRAND, M3M_PROJECTS } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'M3M India Properties Gurugram | M3M Altitude & Capital | DigiSoft Nexus',
  description:
    'Authorised channel partner for M3M India in Gurugram. M3M Altitude, M3M Capital — ultra-luxury residences. Expert advisory, pre-launch pricing, RERA registered.',
  alternates: { canonical: 'https://m3m.digisoftnexus.com' },
}

export default function M3MHomePage() {
  return (
    <div className="font-sans bg-[#FAFAFA] text-[#111111]">
      {/* ── HEADER ────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#111111]">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #B8961E)' }}>
              <span className="text-[#111111] font-black text-xs">M3M</span>
            </div>
            <div>
              <p className="font-bold text-white text-sm tracking-wide">M3M India</p>
              <p className="text-[9px] text-white/40">by DigiSoft Nexus</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {M3M_PROJECTS.map((p) => (
              <Link key={p.id} href={`/projects/${p.slug}`}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors">
                {p.name}
              </Link>
            ))}
          </nav>
          <Link href="/contact"
            className="text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #B8961E)', color: '#111111' }}>
            Get VIP Pricing
          </Link>
        </div>
      </header>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#111111]">
        {/* Background image with minimal overlay */}
        <div className="absolute inset-0">
          <img src={M3M_PROJECTS[0].images[0].url} alt="M3M Altitude Gurugram"
            className="w-full h-full object-cover opacity-30" />
        </div>

        {/* Geometric accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full"
          style={{ background: 'linear-gradient(135deg, transparent 0%, rgba(212,175,55,0.06) 100%)' }} />

        <div className="max-w-screen-xl mx-auto px-4 md:px-8 relative z-10 py-24 pt-36">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Copy — 3 cols */}
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/5">
                <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">Authorised Channel Partner</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-6 tracking-tight">
                M3M INDIA
                <br />
                <span style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #EDCC55 50%, #B8961E 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  GURUGRAM
                </span>
              </h1>

              <p className="text-white/55 text-lg leading-relaxed mb-8 max-w-lg">
                Ultra-luxury living at its most audacious.
                M3M redefines what's possible — sky pools, observatory floors, butler service on demand.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-5 mb-8">
                {M3M_BRAND.stats.map((s) => (
                  <div key={s.label}>
                    <p className="font-black text-xl" style={{ color: '#D4AF37' }}>{s.value}</p>
                    <p className="text-[10px] text-white/40">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href={`/projects/${M3M_PROJECTS[0].slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #B8961E)', color: '#111111' }}>
                  View M3M Altitude <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href={`/projects/${M3M_PROJECTS[1].slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white border border-white/15 hover:border-[#D4AF37]/50 transition-colors">
                  M3M Capital (Pre-Launch)
                </Link>
              </div>
            </div>

            {/* Form — 2 cols */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl overflow-hidden border border-white/8"
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>
                <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
                <div className="p-6">
                  <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-1">M3M VIP Access</p>
                  <h3 className="text-lg font-bold text-white mb-4">Unlock Pre-Launch Pricing</h3>
                  <div className="space-y-3">
                    <input type="text" placeholder="Full Name"
                      className="w-full rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-[#D4AF37] transition-all" />
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">+91</span>
                      <input type="tel" placeholder="Mobile Number"
                        className="w-full rounded-xl border border-white/12 bg-white/5 pl-12 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-[#D4AF37] transition-all" />
                    </div>
                    <select className="w-full rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/60 outline-none focus:border-[#D4AF37] appearance-none">
                      <option>Select Project</option>
                      {M3M_PROJECTS.map((p) => <option key={p.id}>{p.name}</option>)}
                    </select>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" className="mt-0.5 w-3.5 h-3.5 shrink-0" required />
                      <span className="text-[10px] text-white/40 leading-relaxed">
                        I consent to DigiSoft Nexus and M3M India using my data.{' '}
                        <a href="/privacy-policy" className="text-[#D4AF37] hover:underline">Privacy Policy</a>
                      </span>
                    </label>
                    <button type="submit"
                      className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-[#D4AF37]/20"
                      style={{ background: 'linear-gradient(135deg, #D4AF37, #B8961E)', color: '#111111' }}>
                      Get VIP Pricing Now
                    </button>
                  </div>
                  <p className="text-[9px] text-white/25 text-center mt-3">🔒 DPDP 2023 Compliant · RERA Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ──────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-[#111111] tracking-tight">
              M3M Portfolio
            </h2>
            <p className="text-[#555] text-sm mt-2">Gurugram's most audacious residential projects</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {M3M_PROJECTS.map((project) => (
              <Link key={project.id} href={`/projects/${project.slug}`} className="group">
                <div className="bg-[#FAFAFA] rounded-2xl overflow-hidden border border-[#111]/6 hover:shadow-2xl transition-all">
                  <div className="relative h-60 overflow-hidden">
                    <img src={project.images[0].url} alt={project.images[0].alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-full ${
                        project.status === 'pre-launch'
                          ? 'bg-[#D4AF37] text-[#111111]'
                          : 'bg-white/20 text-white backdrop-blur-sm'
                      }`}>
                        {project.status === 'pre-launch' ? '◆ PRE-LAUNCH' : '◆ UNDER CONSTRUCTION'}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-black text-white">{project.name}</h3>
                      <p className="flex items-center gap-1 text-white/60 text-xs mt-1">
                        <MapPin className="w-3 h-3" /> {project.location}
                      </p>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xl font-black" style={{ color: '#D4AF37' }}>{project.priceRange}</p>
                      <p className="text-xs text-[#555]">{project.possession}</p>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      {project.highlights.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-[#D4AF37] shrink-0" />
                          <span className="text-[11px] text-[#555]">{h}</span>
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-bold flex items-center gap-1" style={{ color: '#D4AF37' }}>
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
      <footer className="bg-[#111111] text-white/50 py-10">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-bold text-white">M3M India — DigiSoft Nexus</p>
            <p className="text-[10px] text-center">
              RERA: HARERA/GGM/2024/9012 · hrera.in · © {new Date().getFullYear()} DigiSoft Nexus · Prices indicative
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
