'use client'
import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPin, CheckCircle, ArrowRight, Download, Calendar,
  Phone, MessageCircle, ChevronLeft, ChevronRight, X,
  Building2, Layers, Trees, Users,
} from 'lucide-react'
import GodrejHeader from '@/components/layout/GodrejHeader'
import GodrejFooter from '@/components/layout/GodrejFooter'
import MicrositeLeadForm from '@/components/lead/MicrositeLeadForm'
import { GODREJ_PROJECTS, GODREJ_BRAND } from '@/lib/brand'

// ─── Static Page Generation ───────────────────────────────

export async function generateStaticParams() {
  return GODREJ_PROJECTS.map((p) => ({ slug: p.slug }))
}

// ─── Page ─────────────────────────────────────────────────

interface PageProps {
  params: { slug: string }
}

export default function ProjectDetailPage({ params }: PageProps) {
  const project = GODREJ_PROJECTS.find((p) => p.slug === params.slug)
  if (!project) notFound()

  const [activeTab, setActiveTab] = useState<'overview' | 'amenities' | 'floor-plans' | 'payment'>('overview')
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'floor-plans', label: 'Floor Plans' },
    { id: 'payment', label: 'Payment Plans' },
  ] as const

  // JSON-LD schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: project.name,
    description: project.tagline,
    url: `https://godrej.digisoftnexus.com/projects/${project.slug}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: project.sector,
      addressLocality: project.city,
      addressRegion: 'Haryana',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: project.lat,
      longitude: project.lng,
    },
    floorSize: {
      '@type': 'QuantitativeValue',
      value: project.configs[0]?.area,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <GodrejHeader />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative h-[60vh] md:h-[75vh] overflow-hidden">
        {/* Gallery */}
        <img
          src={project.images[galleryIndex].url}
          alt={project.images[galleryIndex].alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(27,67,50,0.5) 0%, rgba(27,67,50,0.9) 100%)',
        }} />

        {/* Gallery nav */}
        {project.images.length > 1 && (
          <>
            <button
              onClick={() => setGalleryIndex((i) => (i - 1 + project.images.length) % project.images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setGalleryIndex((i) => (i + 1) % project.images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-24 right-4 text-[10px] text-white/70 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm hover:bg-black/50 transition-colors"
            >
              {galleryIndex + 1} / {project.images.length} · View all
            </button>
          </>
        )}

        {/* Content overlay */}
        <div className="absolute bottom-0 inset-x-0 p-6 md:p-10">
          <div className="container-godrej">
            <nav className="flex items-center gap-2 text-white/40 text-xs font-sans mb-4">
              <Link href="/" className="hover:text-white/70">Home</Link>
              <span>/</span>
              <Link href="/projects" className="hover:text-white/70">Projects</Link>
              <span>/</span>
              <span className="text-[#D4AF37]">{project.name}</span>
            </nav>

            <div className="flex flex-wrap items-end gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge-godrej text-[10px] font-bold ${
                    project.status === 'pre-launch' ? 'bg-amber-500 text-white' : 'bg-[#2D6A4F] text-white'
                  }`}>
                    {project.status === 'pre-launch' ? '🔴 Pre-Launch' : '🟢 Under Construction'}
                  </span>
                  <span className="text-white/50 text-[10px]">RERA: {project.reraNumber}</span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-semibold text-white">{project.name}</h1>
                <p className="flex items-center gap-1.5 text-white/70 text-sm mt-2">
                  <MapPin className="w-4 h-4" /> {project.location}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="font-display text-3xl font-semibold text-[#D4AF37]">{project.priceRange}</p>
                <p className="text-white/60 text-xs mt-1">Possession: {project.possession}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <section className="bg-[#F8FBF9] py-10">
        <div className="container-godrej">
          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* Left — Content */}
            <div>
              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { icon: Building2, label: 'Towers', value: `${project.towers} Towers` },
                  { icon: Layers, label: 'Floors', value: `${project.floors} Floors` },
                  { icon: Users, label: 'Units', value: `${project.totalUnits} Units` },
                  { icon: Trees, label: 'Land', value: `${project.landAcres} Acres` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white rounded-xl p-4 shadow-sm text-center">
                    <Icon className="w-5 h-5 text-[#2D6A4F] mx-auto mb-2" />
                    <p className="font-sans font-bold text-[#1A2E25] text-sm">{value}</p>
                    <p className="text-[10px] text-[#4A7260]">{label}</p>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-6 overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-max text-xs font-semibold px-4 py-2.5 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-[#2D6A4F] text-white shadow-sm'
                        : 'text-[#4A7260] hover:bg-[#F8FBF9]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-sans font-bold text-[#1A2E25] text-sm mb-3">Configurations & Pricing</h3>
                      <div className="space-y-3">
                        {project.configs.map((c) => (
                          <div key={c.type} className="flex items-center justify-between p-4 bg-[#F8FBF9] rounded-xl border border-[#2D6A4F]/8">
                            <div>
                              <p className="font-sans font-bold text-[#1A2E25] text-sm">{c.type}</p>
                              <p className="text-[11px] text-[#4A7260] mt-0.5">{c.area}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-display font-semibold text-[#2D6A4F] text-lg">{c.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-sans font-bold text-[#1A2E25] text-sm mb-3">Key Highlights</h3>
                      <div className="space-y-2">
                        {project.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <CheckCircle className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
                            <span className="text-sm text-[#4A7260]">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-sans font-bold text-[#1A2E25] text-sm mb-3">Location & Connectivity</h3>
                      <div className="space-y-2">
                        {project.nearbyLandmarks.map((l, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                            <span className="text-sm text-[#4A7260]">{l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div>
                    <h3 className="font-sans font-bold text-[#1A2E25] text-sm mb-4">
                      {project.amenities.length} World-Class Amenities
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {project.amenities.map((a, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-3 bg-[#F8FBF9] rounded-xl">
                          <div className="w-6 h-6 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-3.5 h-3.5 text-[#2D6A4F]" />
                          </div>
                          <span className="text-xs text-[#4A7260] leading-relaxed">{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'floor-plans' && (
                  <div>
                    <h3 className="font-sans font-bold text-[#1A2E25] text-sm mb-4">Floor Plans</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {project.floorPlans.map((fp, i) => (
                        <div key={i} className="border border-[#2D6A4F]/12 rounded-xl overflow-hidden">
                          <div className="relative h-40 bg-[#F8FBF9]">
                            <img src={fp.image} alt={fp.label} className="w-full h-full object-contain p-4" />
                          </div>
                          <div className="p-3 flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#1A2E25]">{fp.label}</span>
                            <button className="flex items-center gap-1 text-[10px] text-[#2D6A4F] font-semibold hover:underline">
                              <Download className="w-3 h-3" /> Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-[#4A7260] mt-4 text-center">
                      Full floor plans with dimensions sent on WhatsApp after enquiry.
                    </p>
                  </div>
                )}

                {activeTab === 'payment' && (
                  <div>
                    <h3 className="font-sans font-bold text-[#1A2E25] text-sm mb-4">Payment Plans</h3>
                    <div className="space-y-4">
                      {project.paymentPlan.map((pp, i) => (
                        <div key={i} className="p-4 bg-[#F8FBF9] rounded-xl border-l-4 border-[#2D6A4F]">
                          <p className="font-sans font-bold text-[#1A2E25] text-sm">{pp.option}</p>
                          <p className="text-xs text-[#4A7260] mt-1 leading-relaxed">{pp.details}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-[#4A7260] mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                      💡 Payment plan availability varies by unit. Contact us for current options specific to your chosen floor and configuration.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right — Sticky Lead Form */}
            <div>
              <div className="sticky top-20 space-y-4">
                <MicrositeLeadForm
                  projectName={project.name}
                  projectSlug={project.slug}
                  source={`${project.slug}-detail`}
                  variant="sidebar"
                />

                {/* Quick actions */}
                <div className="bg-white rounded-2xl shadow-sm p-4 border border-[#2D6A4F]/8 space-y-2">
                  <a
                    href={`tel:${GODREJ_BRAND.contact.phone}`}
                    className="flex items-center gap-2.5 p-3 bg-[#F8FBF9] rounded-xl text-sm font-semibold text-[#1A2E25] hover:bg-[#EBF5EF] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-[#2D6A4F]" />
                    </div>
                    Call Expert
                  </a>
                  <a
                    href={`https://wa.me/${GODREJ_BRAND.contact.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in ${project.name}, ${project.location}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 bg-[#25D366]/10 rounded-xl text-sm font-semibold text-[#1A2E25] hover:bg-[#25D366]/20 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    </div>
                    WhatsApp
                  </a>
                  <a
                    href={project.brochureUrl}
                    target="_blank"
                    className="flex items-center gap-2.5 p-3 bg-[#F8FBF9] rounded-xl text-sm font-semibold text-[#1A2E25] hover:bg-[#EBF5EF] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                      <Download className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    Download Brochure
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX ───────────────────────────────────────── */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={() => setGalleryIndex((i) => (i - 1 + project.images.length) % project.images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <img
            src={project.images[galleryIndex].url}
            alt={project.images[galleryIndex].alt}
            className="max-w-4xl w-full max-h-[85vh] object-contain rounded-xl"
          />
          <button
            onClick={() => setGalleryIndex((i) => (i + 1) % project.images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {project.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setGalleryIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === galleryIndex ? 'bg-[#D4AF37] w-6' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      )}

      <GodrejFooter />
    </>
  )
}
