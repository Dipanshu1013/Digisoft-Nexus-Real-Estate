import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, TrendingUp, Building2, Train, School, ShoppingBag, ArrowRight, CheckCircle } from 'lucide-react'
import SiteLayout from '@/components/layout/SiteLayout'
import PropertyCard from '@/components/property/PropertyCard'
import LeadForm from '@/components/lead/LeadForm'
import { getPropertiesByCity } from '@/lib/mockData'

export const metadata: Metadata = {
  title: 'Real Estate in Gurugram 2026 | Buy Property | DigiSoft Nexus',
  description: 'Explore 300+ properties in Gurugram (Gurgaon) — luxury, premium, affordable. Best sectors, price trends, investment guide. Godrej, DLF, M3M listings. Free expert advisory.',
  keywords: 'real estate gurugram, gurgaon property, buy flat gurugram, gurugram apartments, gurgaon property price 2026',
  alternates: { canonical: 'https://digisoftnexus.com/gurugram' },
}

export const revalidate = 300

const SECTORS = [
  { sector: 'Sector 79–84', highlight: 'New Launch belt', avgPrice: '₹1.2–1.8 Cr', growth: '+22% YoY', projects: 'Godrej Emerald, M3M Capital' },
  { sector: 'Golf Course Road', highlight: 'Ultra-luxury corridor', avgPrice: '₹8–25 Cr', growth: '+18% YoY', projects: 'DLF Camellias, The Crest' },
  { sector: 'Sector 77–78', highlight: 'DLF township belt', avgPrice: '₹3–6 Cr', growth: '+28% YoY', projects: 'DLF Privana West' },
  { sector: 'Sector 106–109', highlight: 'Dwarka Expressway', avgPrice: '₹70L–1.5 Cr', growth: '+15% YoY', projects: 'Godrej Meridian, M3M Skywalk' },
  { sector: 'Sector 65–67', highlight: 'Golf Course Ext.', avgPrice: '₹2–5 Cr', growth: '+20% YoY', projects: 'M3M Altitude, Ireo' },
  { sector: 'Sohna Road', highlight: 'Mid-segment growth', avgPrice: '₹55L–1.2 Cr', growth: '+12% YoY', projects: 'Godrej Nature Plus, Emaar' },
]

const INFRASTRUCTURE = [
  { icon: Train, title: 'Metro Connectivity', desc: 'Yellow Line (HUDA City Centre), Rapid Metro, and upcoming Metro Phase 4 expansion by 2027.' },
  { icon: Building2, title: 'Employment Hub', desc: 'Cyber City, Udyog Vihar, IMT Manesar — 500,000+ professionals work within 10 km radius.' },
  { icon: School, title: 'Education', desc: 'GD Goenka, Delhi Public School, Heritage School, Amity University — top-tier institutions.' },
  { icon: ShoppingBag, title: 'Retail & Leisure', desc: 'DLF Mega Mall, Ambience, MGF Metropolitan — some of India\'s best malls.' },
]

export default function GurugramPage() {
  const properties = getPropertiesByCity('Gurugram')

  return (
    <SiteLayout>
      {/* Hero */}
      <section
        className="relative py-16 md:py-20 overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1559628129-67cf63b72248?w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/50" />
        <div className="container-site relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <nav className="flex items-center gap-2 text-white/40 text-xs font-syne mb-4">
                <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
                <span>/</span>
                <span className="text-gold">Gurugram</span>
              </nav>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-gold" />
                <span className="text-gold text-xs font-syne font-semibold uppercase tracking-wider">Gurugram, Haryana</span>
              </div>
              <h1 className="font-display text-hero-sm text-white mb-4">
                Real Estate in Gurugram
              </h1>
              <p className="text-white/70 text-base leading-relaxed mb-6 max-w-lg">
                India's Millennium City. Gurugram (Gurgaon) has transformed from a satellite town 
                into one of India's most dynamic real estate markets — fuelled by global MNCs, 
                excellent connectivity, and world-class social infrastructure.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                {[
                  { value: '300+', label: 'Active Projects' },
                  { value: '₹1.2 Cr', label: 'Avg. Price' },
                  { value: '+19%', label: 'YoY Growth' },
                ].map(s => (
                  <div key={s.label}>
                    <p className="font-display text-2xl font-semibold text-gold">{s.value}</p>
                    <p className="text-white/50 text-xs font-syne">{s.label}</p>
                  </div>
                ))}
              </div>
              <Link href="/properties?city=Gurugram" className="btn btn-primary btn-sm">
                Browse All Gurugram Properties <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <LeadForm propertyTitle="Gurugram Property" source="gurugram-page" className="shadow-popup" />
          </div>
        </div>
      </section>

      {/* Gurugram Detailed Guide */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-site">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-section text-navy mb-6">
              Why Invest in Gurugram Real Estate in 2026?
            </h2>
            
            <div className="prose text-dark-grey leading-relaxed space-y-4 text-sm md:text-base">
              <p>
                Gurugram (formerly known as Gurgaon) has established itself as the undisputed premium real estate 
                destination of Northern India. As home to over 500 Fortune 500 companies, the city continues to 
                attract a highly-paid professional workforce that drives consistent demand for quality residential 
                properties across all segments.
              </p>
              
              <p>
                The real estate market in Gurugram registered a remarkable 19% year-on-year price appreciation in 
                2025, outperforming most other Indian metros. The Dwarka Expressway micro-market — which saw its 
                physical infrastructure finally completed — has emerged as the fastest-growing corridor, with sectors 
                79 through 113 witnessing particularly strong demand from both end-users and investors.
              </p>

              <h3 className="font-syne font-bold text-navy text-lg mt-6 mb-3">
                Dwarka Expressway: The New Address of Choice
              </h3>
              <p>
                The completion of the 29-kilometre Dwarka Expressway (NH-248BB) has been transformative for 
                Gurugram's real estate landscape. Sectors 99–115 along this corridor offer a compelling combination: 
                competitive pricing (still 30–40% lower than Golf Course Road), excellent connectivity to Delhi's 
                Dwarka sub-city and IGI Airport, and an increasingly robust social infrastructure.
              </p>

              <h3 className="font-syne font-bold text-navy text-lg mt-6 mb-3">
                Golf Course Road: Gurugram's Luxury Address
              </h3>
              <p>
                Golf Course Road remains Gurugram's most prestigious address, and DLF's landmark projects —
                The Camellias, The Crest, One Midtown — have consistently delivered superior returns for investors.
                Properties here are primarily held by CXOs, NRIs, and HNIs, and the demand-supply dynamics 
                continue to favour buyers who purchased before 2022.
              </p>

              <h3 className="font-syne font-bold text-navy text-lg mt-6 mb-3">
                New Township Developments: Sector 77–78
              </h3>
              <p>
                DLF's Privana West in Sectors 76–77, adjacent to the Aravalli Biodiversity Park, represents 
                Gurugram's most significant new township development. With 116 acres being developed 
                comprehensively — including Club Privana (75,000 sq ft clubhouse), retail, and commercial spaces —
                this micro-market is forecast to appreciate significantly upon possession.
              </p>

              <h3 className="font-syne font-bold text-navy text-lg mt-6 mb-3">
                Rental Yields: Better Than Mumbai and Delhi
              </h3>
              <p>
                Gurugram consistently delivers rental yields of 3.5–5% annually — among the best in India's 
                premium residential markets. Sectors close to Cyber City and MG Road command the highest rents, 
                with 2BHK apartments in sectors 40–55 achieving ₹35,000–₹65,000 per month. The city's massive 
                professional workforce ensures near-zero vacancy for well-located quality properties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sector Guide */}
      <section className="py-12 bg-cream">
        <div className="container-site">
          <div className="mb-8">
            <p className="text-gold text-xs font-syne font-semibold uppercase tracking-widest mb-1">Hyperlocal Guide</p>
            <h2 className="font-display text-section text-navy">Top Sectors in Gurugram</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SECTORS.map((s, i) => (
              <div key={s.sector} className="bg-white rounded-xl2 p-5 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-syne font-bold text-navy text-sm">{s.sector}</h3>
                  <span className="text-[10px] font-syne font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
                    {s.growth}
                  </span>
                </div>
                <p className="text-xs text-gold font-semibold mb-1">{s.highlight}</p>
                <p className="text-xs text-dark-grey mb-2">Avg: {s.avgPrice}</p>
                <p className="text-[11px] text-mid-grey">{s.projects}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-12 bg-white">
        <div className="container-site">
          <h2 className="font-display text-section text-navy text-center mb-8">
            World-Class Infrastructure
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INFRASTRUCTURE.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 rounded-xl2 bg-gold/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-syne font-semibold text-navy text-sm mb-2">{title}</h3>
                <p className="text-dark-grey text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-12 bg-cream">
        <div className="container-site">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-gold text-xs font-syne font-semibold uppercase tracking-widest mb-1">Featured</p>
              <h2 className="font-display text-section text-navy">Properties in Gurugram</h2>
            </div>
            <Link href="/properties?city=Gurugram" className="text-sm text-gold font-syne font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.slice(0, 6).map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
