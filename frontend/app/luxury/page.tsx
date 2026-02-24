import type { Metadata } from 'next'
import SiteLayout from '@/components/layout/SiteLayout'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Bed, Maximize2, ArrowRight, CheckCircle, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Luxury Properties in Gurugram | Ultra-Premium Apartments & Villas',
  description: 'Explore ultra-luxury residences in Gurugram — DLF The Camellias, M3M Altitude, Godrej Meridian and more. Premium 3-5 BHK apartments from ₹2.8 Cr.',
}

const LUXURY_PROPERTIES = [
  { id:'2', slug:'dlf-the-camellias', title:'DLF The Camellias', developer:'DLF Limited', location:'Golf Course Road, Gurugram', priceDisplay:'₹12 Cr+', bhkOptions:['4BHK','5BHK'], areaMin:5800, tag:'Ultra Luxury', image:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', imageAlt:'DLF The Camellias ultra-luxury apartment Golf Course Road Gurugram exterior', perks:['Private Plunge Pool', 'Butler Service', 'Concierge 24/7'] },
  { id:'3', slug:'m3m-altitude-sector-65', title:'M3M Altitude', developer:'M3M India', location:'Sector 65, Gurugram', priceDisplay:'₹2.8 Cr+', bhkOptions:['3BHK','4BHK'], areaMin:2100, tag:'Premium Luxury', image:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80', imageAlt:'M3M Altitude luxury high-rise apartment Sector 65 Gurugram sky club', perks:['Sky Club 40th Floor', 'Rooftop Pool', 'IGBC Gold'] },
  { id:'6', slug:'dlf-privana-sector-77', title:'DLF Privana', developer:'DLF Limited', location:'Sector 77, Gurugram', priceDisplay:'₹3.5 Cr+', bhkOptions:['3BHK','4BHK'], areaMin:2500, tag:'Signature Luxury', image:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', imageAlt:'DLF Privana luxury 3BHK apartment Sector 77 Gurugram new launch', perks:['Forest-facing Units', 'Green Podium', 'Smart Community'] },
]

const LUXURY_USPs = [
  'Residences starting from 2,100 sq ft — true spacious luxury',
  'World-class amenities: private pools, spas, cigar lounges',
  'High-quality imported fittings — Villeroy & Boch, Gaggenau, Kohler',
  'Smart home automation as standard',
  'Dedicated concierge and facility management',
  '15-25% higher capital appreciation vs mid-segment properties',
]

export default function LuxuryPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative h-80 md:h-[450px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80" alt="Luxury apartments Gurugram premium residences interior" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/75 to-navy/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="container-site">
            <p className="section-label mb-3">Premium Collection</p>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-white mb-4 leading-tight">
              Luxury Residences
            </h1>
            <p className="text-white/55 text-lg max-w-lg mb-6">
              Curated collection of ultra-premium homes — where exceptional design meets world-class living.
            </p>
            <Link href="/contact" className="btn btn-gold gap-2">
              Request Private Tour <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Properties */}
      <section className="section bg-warm-white">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="section-label mb-2">Exclusive Selection</p>
            <h2 className="section-title">Gurugram's Finest Addresses</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LUXURY_PROPERTIES.map((p, i) => (
              <Link key={p.id} href={`/properties/${p.slug}`}>
                <div className="card-hover group overflow-hidden h-full">
                  <div className="relative h-64 overflow-hidden img-hover-zoom">
                    <img src={p.image} alt={p.imageAlt} className="img-luxury" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 badge bg-gold text-navy text-[10px]">{p.tag}</span>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="font-display text-xl text-white font-semibold">{p.priceDisplay}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="section-label mb-1">{p.developer}</p>
                    <h3 className="font-display text-xl font-semibold text-navy mb-2 group-hover:text-gold transition-colors">{p.title}</h3>
                    <p className="flex items-center gap-1 text-xs text-dark-grey mb-3"><MapPin className="w-3.5 h-3.5 text-gold" />{p.location}</p>
                    <div className="flex gap-3 text-xs text-dark-grey mb-4">
                      <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{p.bhkOptions.join(', ')}</span>
                      <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" />From {p.areaMin} sq ft</span>
                    </div>
                    <div className="space-y-1.5">
                      {p.perks.map(perk => (
                        <p key={perk} className="flex items-center gap-1.5 text-xs text-dark-grey">
                          <Star className="w-3 h-3 text-gold fill-gold" />{perk}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Luxury */}
      <section className="section bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-40" />
        <div className="container-site relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-label mb-3">Investment Intelligence</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-5">
                Why Gurugram Luxury Properties Are the Smartest Investment
              </h2>
              <ul className="space-y-3">
                {LUXURY_USPs.map(u => (
                  <li key={u} className="flex items-start gap-2.5 text-sm text-white/65">
                    <CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />{u}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl4 p-8 text-center">
              <p className="text-white/50 text-xs font-syne uppercase tracking-wider mb-4">Exclusive Service</p>
              <h3 className="font-display text-2xl text-white font-semibold mb-3">Private Property Viewing</h3>
              <p className="text-white/55 text-sm mb-6 leading-relaxed">Our luxury advisors arrange exclusive, private viewings at your convenience. No rush, full attention.</p>
              <Link href="/contact" className="btn btn-gold w-full justify-center">Request Private Viewing</Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
