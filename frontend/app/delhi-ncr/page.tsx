import type { Metadata } from 'next'
import SiteLayout from '@/components/layout/SiteLayout'
import Link from 'next/link'
import { MapPin, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Delhi NCR Properties | Buy Apartments in Gurugram, Noida, Faridabad',
  description: 'Explore premium and affordable properties across Delhi NCR — Gurugram, Noida, Greater Noida, Faridabad. Compare locations, prices, connectivity, and top developers.',
}

const NCR_LOCATIONS = [
  { name: 'Gurugram', slug: '/gurugram', tagline: "NCR's Premium Hub", priceRange: '₹50L – ₹30 Cr+', growth: '+18% YoY', highlights: ['250+ Fortune 500 companies', 'Golf Course Road, DLF5 luxury zone', 'Dwarka Expressway value corridor'], image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80', imageAlt: 'Gurugram city luxury apartments real estate' },
  { name: 'Noida', slug: '/noida', tagline: 'Tech & IT Hub', priceRange: '₹40L – ₹5 Cr', growth: '+14% YoY', highlights: ['Sectors 135-150 expressway corridor', 'Jewar Airport upcoming boost', 'Major IT/ITeS presence'], image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80', imageAlt: 'Noida apartments real estate investment' },
  { name: 'Greater Noida', slug: '/properties?city=Greater+Noida', tagline: 'Integrated Townships', priceRange: '₹30L – ₹2 Cr', growth: '+12% YoY', highlights: ['Yamuna Expressway Authority plots', 'Large integrated townships', 'Excellent infrastructure'], image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80', imageAlt: 'Greater Noida township apartments investment' },
  { name: 'Faridabad', slug: '/properties?city=Faridabad', tagline: 'Emerging Value Zone', priceRange: '₹20L – ₹1 Cr', growth: '+10% YoY', highlights: ['Delhi Metro connectivity', 'Industrial employment hub', 'Best value for money in NCR'], image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&q=80', imageAlt: 'Faridabad apartments affordable homes Delhi NCR' },
]

const CONNECTIVITY_HIGHLIGHTS = [
  'Delhi Metro Yellow Line connects Gurugram to Kashmere Gate in 45 min',
  'Dwarka Expressway reduces Delhi-Gurugram travel time significantly',
  'NH-48 (Delhi-Jaipur Highway) passes through prime Gurugram sectors',
  'Rapid Metro connects Golf Course Road to MG Road metro station',
  'Jewar International Airport (under construction) to boost eastern NCR',
  'KMP Expressway links western NCR cities effectively',
]

export default function DelhiNCRPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1400&q=80" alt="Delhi NCR skyline real estate properties 2026" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/75 to-navy/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container-site">
            <nav className="text-white/40 text-xs font-syne mb-3 flex items-center gap-2">
              <Link href="/" className="hover:text-white/70">Home</Link>
              <span>/</span>
              <span className="text-gold">Delhi NCR</span>
            </nav>
            <p className="section-label mb-2">India's Largest Real Estate Market</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-3">Delhi NCR Properties</h1>
            <p className="text-white/55 text-base max-w-xl">
              From affordable homes in Faridabad to ultra-luxury on Golf Course Road — explore every segment of India's largest property market.
            </p>
          </div>
        </div>
      </section>

      {/* NCR Locations */}
      <section className="section bg-warm-white">
        <div className="container-site">
          <div className="text-center mb-10">
            <p className="section-label mb-2">Choose Your Location</p>
            <h2 className="section-title">Find the Right NCR City for You</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {NCR_LOCATIONS.map((loc, i) => (
              <Link key={loc.name} href={loc.slug}>
                <div className="card-hover group overflow-hidden h-full">
                  <div className="relative h-44 overflow-hidden img-hover-zoom">
                    <img src={loc.image} alt={loc.imageAlt} className="img-luxury" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/85 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-display text-xl font-semibold text-white group-hover:text-gold transition-colors">{loc.name}</h3>
                      <p className="text-white/65 text-xs">{loc.tagline}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-dark-grey">{loc.priceRange}</span>
                      <span className="flex items-center gap-1 text-success text-xs font-semibold">
                        <TrendingUp className="w-3 h-3" />{loc.growth}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {loc.highlights.map(h => (
                        <li key={h} className="flex items-start gap-1.5 text-xs text-dark-grey">
                          <CheckCircle className="w-3 h-3 text-gold shrink-0 mt-0.5" />{h}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex items-center gap-1 text-xs text-gold font-syne font-semibold">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Connectivity */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="font-display text-2xl font-semibold text-navy mb-4">Why NCR Real Estate is a Smart Investment</h2>
              <p className="text-dark-grey leading-relaxed mb-4">
                Delhi NCR is home to over 30 million people and is the administrative, commercial, and cultural capital of India. With the world's largest metro network expansion underway, Jewar International Airport nearing completion, and sustained FDI inflows into Gurugram and Noida, NCR property values are underpinned by strong fundamentals.
              </p>
              <p className="text-dark-grey leading-relaxed">
                Whether you're a first-time buyer looking for an affordable 2BHK in Noida or an HNI investor eyeing ultra-luxury on Golf Course Road, DigiSoft Nexus provides expert guidance across the entire NCR spectrum.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="font-syne font-semibold text-sm text-navy mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" /> NCR Connectivity Highlights
              </h3>
              <ul className="space-y-3">
                {CONNECTIVITY_HIGHLIGHTS.map(h => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-dark-grey">
                    <CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />{h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 bg-navy rounded-xl4 p-8 text-center">
            <h3 className="font-display text-2xl text-white font-semibold mb-3">Not Sure Which NCR City to Choose?</h3>
            <p className="text-white/55 text-sm mb-6 max-w-md mx-auto">Our advisors compare locations based on your budget, commute needs, and investment goals — for free.</p>
            <Link href="/contact" className="btn btn-gold">Book a Free Location Consultation</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
