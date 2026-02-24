'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Bed, Maximize2, Building2, Calendar, Shield, Star,
  Phone, MessageCircle, Download, ChevronLeft, ChevronRight,
  CheckCircle, X, PlayCircle, Share2, Heart, ArrowRight,
} from 'lucide-react'
import type { Property } from '@/lib/mockData'
import LeadForm from '@/components/lead/LeadForm'
import StickyLeadBar from '@/components/lead/StickyLeadBar'
import PropertyCard from '@/components/property/PropertyCard'
import { getPossessionLabel } from '@/lib/utils'

interface PropertyDetailClientProps {
  property: Property
  relatedProperties: Property[]
}

const TABS = ['Overview', 'Amenities', 'Floor Plans', 'FAQs'] as const
type Tab = typeof TABS[number]

const FAQ_DATA = [
  { q: 'What documents are required for booking?', a: 'You need Aadhar card, PAN card, recent ITR (2 years), bank statements (6 months), and passport-size photos. NRI buyers need OCI/PIO card and overseas address proof.' },
  { q: 'Is home loan available for this project?', a: 'Yes, home loans are available from all major banks including SBI, HDFC, ICICI, and Axis at competitive rates. Our finance team can help you get pre-approval.' },
  { q: 'What is the booking amount?', a: 'Typically 10% of the total unit cost is required at booking. This may vary; contact our team for current booking details and payment plan.' },
  { q: 'Are there any GST charges?', a: 'GST is applicable as per government norms — 5% for under-construction and 1% for affordable housing. Ready-to-move properties with OC do not attract GST.' },
  { q: 'Can NRIs invest in this property?', a: 'Yes, NRIs can purchase this property under FEMA regulations. Digisoft Nexus has dedicated NRI support with paperwork assistance and virtual tour facility.' },
]

export default function PropertyDetailClient({ property, relatedProperties }: PropertyDetailClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)

  const images = property.images?.length ? property.images : [property.primaryImage]

  const nextImage = () => setGalleryIndex(i => (i + 1) % images.length)
  const prevImage = () => setGalleryIndex(i => (i - 1 + images.length) % images.length)

  const possessionColors: Record<string, string> = {
    'ready-to-move': 'bg-success/10 text-success',
    'under-construction': 'bg-amber-50 text-amber-700',
    'new-launch': 'bg-navy/10 text-navy',
    'pre-launch': 'bg-gold/10 text-gold-600',
  }

  return (
    <>
      <div className="bg-cream min-h-screen pb-24 md:pb-0">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-navy/6">
          <div className="container-site py-3">
            <nav className="text-xs font-syne flex items-center gap-2 text-dark-grey">
              <Link href="/" className="hover:text-gold transition-colors">Home</Link>
              <span>/</span>
              <Link href="/properties" className="hover:text-gold transition-colors">Properties</Link>
              <span>/</span>
              <span className="text-navy font-medium">{property.title}</span>
            </nav>
          </div>
        </div>

        <div className="container-site py-6 md:py-10">
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 xl:gap-12">
            {/* Left Column — Main Content */}
            <div>
              {/* Gallery */}
              <div className="relative rounded-xl3 overflow-hidden shadow-luxury-md mb-6 bg-navy">
                <div className="relative h-72 md:h-[420px]">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={galleryIndex}
                      src={images[galleryIndex].url}
                      alt={images[galleryIndex].alt}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {/* Gallery Controls */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Image count */}
                  <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-syne px-3 py-1 rounded-full">
                    {galleryIndex + 1} / {images.length}
                  </div>

                  {/* Tag */}
                  <span className={`absolute top-3 left-3 badge text-[10px] ${property.tagColor}`}>
                    {property.tag}
                  </span>

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => setSaved(!saved)}
                      className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${saved ? 'fill-red-500 text-red-500' : 'text-dark-grey'}`} />
                    </button>
                    <button
                      onClick={() => navigator.share?.({ title: property.title, url: window.location.href })}
                      className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Share2 className="w-4 h-4 text-dark-grey" />
                    </button>
                  </div>
                </div>

                {/* Thumbnail strip */}
                {images.length > 1 && (
                  <div className="flex gap-2 p-3 bg-navy/5 overflow-x-auto">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setGalleryIndex(i)}
                        className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all ${
                          i === galleryIndex ? 'ring-2 ring-gold' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Header */}
              <div className="bg-white rounded-xl2 p-6 shadow-card mb-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="font-syne text-xs font-semibold text-gold uppercase tracking-wider mb-1">
                      {property.developer}
                    </p>
                    <h1 className="font-display text-display font-semibold text-navy">
                      {property.title}
                    </h1>
                    <p className="flex items-center gap-1.5 text-sm text-dark-grey mt-1">
                      <MapPin className="w-4 h-4 text-gold shrink-0" />
                      {property.location}, {property.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-semibold text-navy">{property.priceDisplay}</p>
                    <p className="text-xs text-dark-grey mt-0.5">All-inclusive price</p>
                  </div>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-navy/6">
                  {[
                    { icon: Bed, label: 'Configuration', value: property.bhkOptions.join(', ') },
                    { icon: Maximize2, label: 'Area', value: `${property.areaMin}–${property.areaMax} sq ft` },
                    { icon: Building2, label: 'Type', value: property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) },
                    { icon: Calendar, label: 'Possession', value: property.possessionDate || 'TBD' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="text-center">
                      <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center mx-auto mb-1.5">
                        <Icon className="w-4 h-4 text-gold" />
                      </div>
                      <p className="text-[10px] font-syne text-mid-grey uppercase tracking-wider">{label}</p>
                      <p className="font-syne font-semibold text-xs text-navy mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & RERA */}
              <div className="flex flex-wrap gap-3 mb-5">
                <span className={`flex items-center gap-1.5 text-xs font-syne font-semibold px-3 py-1.5 rounded-full ${possessionColors[property.possessionStatus] || 'bg-navy/10 text-navy'}`}>
                  <CheckCircle className="w-3.5 h-3.5" />
                  {getPossessionLabel(property.possessionStatus)}
                </span>
                {property.reraId && (
                  <span className="flex items-center gap-1.5 text-xs font-syne font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700">
                    <Shield className="w-3.5 h-3.5" />
                    RERA: {property.reraId}
                  </span>
                )}
                {property.totalUnits && (
                  <span className="flex items-center gap-1.5 text-xs font-syne font-semibold px-3 py-1.5 rounded-full bg-navy/8 text-navy">
                    <Building2 className="w-3.5 h-3.5" />
                    {property.totalUnits} Units · {property.totalTowers} Towers
                  </span>
                )}
              </div>

              {/* Tab Navigation */}
              <div className="bg-white rounded-xl2 shadow-card overflow-hidden">
                <div className="flex border-b border-navy/8 overflow-x-auto scrollbar-hide">
                  {TABS.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-3.5 font-syne font-semibold text-sm whitespace-nowrap transition-all flex-shrink-0 border-b-2 ${
                        activeTab === tab
                          ? 'border-gold text-navy'
                          : 'border-transparent text-dark-grey hover:text-navy'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Overview Tab */}
                      {activeTab === 'Overview' && (
                        <div>
                          <h2 className="font-syne font-bold text-base text-navy mb-3">About {property.title}</h2>
                          <p className="text-dark-grey text-sm leading-relaxed mb-6">{property.description}</p>

                          {property.highlights && (
                            <>
                              <h3 className="font-syne font-semibold text-sm text-navy mb-3">Project Highlights</h3>
                              <ul className="grid sm:grid-cols-2 gap-2.5">
                                {property.highlights.map(h => (
                                  <li key={h} className="flex items-start gap-2 text-sm text-dark-grey">
                                    <CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                                    {h}
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      )}

                      {/* Amenities Tab */}
                      {activeTab === 'Amenities' && (
                        <div>
                          <h2 className="font-syne font-bold text-base text-navy mb-4">
                            World-Class Amenities
                          </h2>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {property.amenities.map(amenity => (
                              <div
                                key={amenity}
                                className="flex items-center gap-2 bg-cream rounded-xl px-3 py-2.5"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                                <span className="text-xs font-syne text-dark-grey">{amenity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Floor Plans Tab */}
                      {activeTab === 'Floor Plans' && (
                        <div>
                          <h2 className="font-syne font-bold text-base text-navy mb-4">Floor Plan Configurations</h2>
                          <div className="grid sm:grid-cols-2 gap-4 mb-6">
                            {property.bhkOptions.map(bhk => (
                              <div key={bhk} className="bg-cream rounded-xl p-4 border border-navy/8">
                                <h4 className="font-syne font-bold text-navy text-sm mb-1">{bhk} Configuration</h4>
                                <p className="text-xs text-dark-grey">
                                  Area: ~{bhk.includes('2') ? property.areaMin : property.areaMax} sq ft
                                </p>
                                <p className="text-xs text-gold font-semibold mt-0.5">{property.priceDisplay}</p>
                              </div>
                            ))}
                          </div>
                          <div className="bg-navy/4 rounded-xl2 p-5 text-center">
                            <Download className="w-8 h-8 text-gold mx-auto mb-2" />
                            <h3 className="font-syne font-semibold text-navy text-sm mb-1">Get Detailed Floor Plans</h3>
                            <p className="text-xs text-dark-grey mb-3">Complete floor plan with dimensions — free download</p>
                            <button className="btn btn-primary btn-sm">
                              <Download className="w-3.5 h-3.5" />
                              Download Floor Plans
                            </button>
                          </div>
                        </div>
                      )}

                      {/* FAQs Tab */}
                      {activeTab === 'FAQs' && (
                        <div>
                          <h2 className="font-syne font-bold text-base text-navy mb-4">
                            Frequently Asked Questions
                          </h2>
                          <div className="space-y-2">
                            {FAQ_DATA.map((faq, i) => (
                              <div key={i} className="border border-navy/8 rounded-xl overflow-hidden">
                                <button
                                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                                  className="w-full flex items-start justify-between p-4 text-left hover:bg-cream transition-colors"
                                >
                                  <span className="font-syne font-semibold text-sm text-navy pr-4">
                                    {faq.q}
                                  </span>
                                  <span className="shrink-0 mt-0.5 text-gold text-lg font-light">
                                    {openFAQ === i ? '−' : '+'}
                                  </span>
                                </button>
                                <AnimatePresence>
                                  {openFAQ === i && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <p className="px-4 pb-4 text-sm text-dark-grey leading-relaxed">{faq.a}</p>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Related Properties */}
              {relatedProperties.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-syne font-bold text-lg text-navy">Similar Properties</h2>
                    <Link href="/properties" className="text-xs text-gold font-syne font-semibold hover:underline flex items-center gap-1">
                      View All <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {relatedProperties.map((p, i) => (
                      <PropertyCard key={p.id} property={p} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column — Sticky Lead Form (desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                {/* Quick Actions */}
                <div className="flex gap-2">
                  <a
                    href="tel:+919999999999"
                    className="flex-1 btn btn-outline btn-sm justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call
                  </a>
                  <a
                    href={`https://wa.me/919999999999?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(property.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 btn btn-sm justify-center gap-1.5 bg-[#25D366] text-white border-0 hover:bg-[#1eb356]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                </div>

                <LeadForm
                  propertyTitle={property.title}
                  source="property-detail-sidebar"
                />

                {/* Key Info Card */}
                <div className="bg-white rounded-xl2 p-4 shadow-card">
                  <h4 className="font-syne font-semibold text-xs text-navy mb-3 uppercase tracking-wider">
                    Project Summary
                  </h4>
                  <dl className="space-y-2">
                    {[
                      ['Developer', property.developer],
                      ['Location', property.location],
                      ['Price', property.priceDisplay],
                      ['Configuration', property.bhkOptions.join(', ')],
                      ['Area', `${property.areaMin}–${property.areaMax} sq ft`],
                      ...(property.reraId ? [['RERA', property.reraId]] : []),
                      ...(property.possessionDate ? [['Possession', property.possessionDate]] : []),
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2">
                        <dt className="text-xs text-mid-grey font-syne shrink-0">{k}</dt>
                        <dd className="text-xs text-navy font-semibold text-right">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <StickyLeadBar propertyTitle={property.title} />
    </>
  )
}
