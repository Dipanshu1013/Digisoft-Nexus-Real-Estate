import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Award, Users, TrendingUp, Star, MapPin, Shield } from 'lucide-react'
import GodrejHeader from '@/components/layout/GodrejHeader'
import GodrejFooter from '@/components/layout/GodrejFooter'
import MicrositeLeadForm from '@/components/lead/MicrositeLeadForm'
import { GODREJ_BRAND, GODREJ_PROJECTS } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Godrej Properties Gurugram | Authorised Channel Partner | DigiSoft Nexus',
  description:
    'Explore Godrej Properties in Gurugram — Godrej Emerald, Godrej Central. Authorised channel partner. VIP pre-launch pricing, expert advisory, RERA-registered projects.',
  alternates: { canonical: 'https://godrej.digisoftnexus.com' },
}

// Organisation Schema
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'DigiSoft Nexus — Godrej Properties Partner',
  description: 'Authorised channel partner for Godrej Properties in Gurugram',
  url: 'https://godrej.digisoftnexus.com',
  telephone: GODREJ_BRAND.contact.phone,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Gurugram',
    addressRegion: 'Haryana',
    addressCountry: 'IN',
  },
}

export default function GodrejHomePage() {
  const featuredProject = GODREJ_PROJECTS[0]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <GodrejHeader />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={featuredProject.images[0].url}
            alt={featuredProject.images[0].alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, rgba(27,67,50,0.95) 0%, rgba(45,106,79,0.80) 60%, rgba(27,67,50,0.70) 100%)',
          }} />
        </div>

        <div className="container-godrej relative z-10 py-24 pt-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Copy */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30">
                  <span className="text-[#D4AF37] text-[10px] font-semibold uppercase tracking-widest">
                    Authorised Channel Partner
                  </span>
                </div>
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] mb-6">
                Godrej Properties
                <br />
                <span className="text-gold-godrej">in Gurugram</span>
              </h1>

              <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-lg">
                India's most trusted developer meets NCR's most dynamic real estate market.
                VIP access to {GODREJ_BRAND.stats[0].value} cities, {GODREJ_BRAND.stats[1].value} delivered projects.
              </p>

              {/* Certifications */}
              <div className="flex flex-wrap gap-2 mb-8">
                {GODREJ_BRAND.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="flex items-center gap-1.5 text-[10px] text-white/70 bg-white/10 px-3 py-1.5 rounded-full border border-white/15"
                  >
                    <Shield className="w-3 h-3 text-[#D4AF37]" /> {cert}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {GODREJ_BRAND.stats.map((s) => (
                  <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                    <p className="font-display text-2xl font-semibold text-[#D4AF37]">{s.value}</p>
                    <p className="text-[10px] text-white/60 mt-0.5 font-sans">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href={`/projects/${featuredProject.slug}`} className="btn-godrej-gold text-sm gap-2">
                  View Projects <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/about" className="btn-godrej text-white border-2 border-white/30 hover:bg-white/10 text-sm">
                  About Godrej
                </Link>
              </div>
            </div>

            {/* Right — Lead Form */}
            <div>
              <MicrositeLeadForm
                projectName="Godrej Properties Gurugram"
                source="godrej-homepage-hero"
                variant="hero"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ──────────────────────────────────────────── */}
      <section className="section-godrej bg-[#F8FBF9]">
        <div className="container-godrej">
          <div className="text-center mb-10">
            <p className="label-godrej mb-2">Our Portfolio</p>
            <h2 className="font-display text-4xl font-semibold text-[#1A2E25]">
              Godrej Projects in Gurugram
            </h2>
            <p className="text-[#4A7260] text-sm mt-2 max-w-lg mx-auto">
              Every project is RERA registered, quality-certified, and backed by 35+ years of Godrej trust.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {GODREJ_PROJECTS.map((project) => (
              <Link key={project.id} href={`/projects/${project.slug}`} className="group">
                <div className="card-godrej overflow-hidden">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={project.images[0].url}
                      alt={project.images[0].alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Status badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`badge-godrej text-[10px] font-bold ${
                        project.status === 'pre-launch' ? 'bg-amber-500 text-white' :
                        project.status === 'under-construction' ? 'bg-[#2D6A4F] text-white' :
                        'bg-white text-[#2D6A4F]'
                      }`}>
                        {project.status === 'pre-launch' ? '🔴 Pre-Launch' :
                         project.status === 'under-construction' ? '🟢 Under Construction' : '✅ Ready'}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-display text-2xl font-semibold text-white">{project.name}</h3>
                      <p className="flex items-center gap-1 text-white/70 text-xs mt-1">
                        <MapPin className="w-3 h-3" /> {project.location}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <p className="text-[#4A7260] text-xs italic mb-3">{project.tagline}</p>

                    {/* Price + Possession */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-display text-xl font-semibold text-[#2D6A4F]">{project.priceRange}</p>
                        <p className="text-[10px] text-[#4A7260] mt-0.5">
                          {project.configs.length} configurations available
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-[#4A7260]">Possession</p>
                        <p className="font-sans font-semibold text-[#1A2E25] text-xs">{project.possession}</p>
                      </div>
                    </div>

                    {/* Config pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.configs.map((c) => (
                        <span key={c.type} className="badge-green text-[10px]">{c.type}</span>
                      ))}
                    </div>

                    {/* Highlights */}
                    <div className="space-y-1 mb-4">
                      {project.highlights.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-[#2D6A4F] shrink-0" />
                          <span className="text-[11px] text-[#4A7260]">{h}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#2D6A4F]/8">
                      <span className="text-xs font-semibold text-[#2D6A4F] group-hover:text-[#1B4332] transition-colors flex items-center gap-1">
                        View Full Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                      <span className="text-[10px] text-[#4A7260]">RERA: {project.reraNumber.split('/').pop()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEVELOPER LEGACY ──────────────────────────────────── */}
      <section className="section-godrej bg-white">
        <div className="container-godrej">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="label-godrej mb-3">The Godrej Legacy</p>
              <h2 className="font-display text-4xl font-semibold text-[#1A2E25] mb-5">
                35+ Years of Building<br />Brighter Living
              </h2>
              <div className="space-y-4 text-[#4A7260] text-sm leading-relaxed">
                <p>
                  Godrej Properties is a subsidiary of Godrej Industries — one of India's most respected conglomerates with a 125-year heritage of trust, quality, and innovation.
                </p>
                <p>
                  Every Godrej project in Gurugram reflects the group's hallmark standards: RERA-compliant delivery, best-in-class construction quality, and designs built around how modern families actually live.
                </p>
                <p>
                  As an authorised channel partner, DigiSoft Nexus offers exclusive access to Godrej pre-launches and best-floor allocations at developer prices — no markups, no hidden charges.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  { icon: Award, value: 'ISO 9001:2015', label: 'Quality Certified' },
                  { icon: Shield, value: '100%', label: 'RERA Registered' },
                  { icon: TrendingUp, value: '22%', label: 'Avg. Appreciation' },
                  { icon: Star, value: '4.8★', label: 'Customer Rating' },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex items-center gap-3 p-3 bg-[#F8FBF9] rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#2D6A4F]" />
                    </div>
                    <div>
                      <p className="font-sans font-bold text-[#1A2E25] text-sm">{value}</p>
                      <p className="text-[10px] text-[#4A7260]">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"
                alt="Godrej Properties luxury interior"
                className="rounded-2xl h-52 w-full object-cover shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80"
                alt="Godrej Properties sustainable architecture"
                className="rounded-2xl h-52 w-full object-cover shadow-lg mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80"
                alt="Godrej Properties amenities"
                className="rounded-2xl h-40 w-full object-cover shadow-lg -mt-4 col-span-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── INLINE CTA ────────────────────────────────────────── */}
      <section className="section-godrej gradient-godrej">
        <div className="container-godrej">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl font-semibold text-white mb-4">
                Ready to Explore Godrej Gurugram?
              </h2>
              <p className="text-white/70 text-base leading-relaxed mb-6">
                Get VIP pricing, floor plan access, and a dedicated expert — all free, no obligation.
              </p>
              <ul className="space-y-2">
                {[
                  'Pre-launch pricing locked before public announcement',
                  'Best floor allocations reserved for registered enquiries',
                  'Site visit + 3D walkthrough arranged within 48 hours',
                  'RERA documents and payment plan transparency',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <MicrositeLeadForm
              projectName="Godrej Properties Gurugram"
              source="godrej-homepage-cta"
              variant="hero"
            />
          </div>
        </div>
      </section>

      <GodrejFooter />
    </>
  )
}
