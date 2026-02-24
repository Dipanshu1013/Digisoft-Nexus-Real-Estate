import type { Metadata } from 'next'
import SiteLayout from '@/components/layout/SiteLayout'
import Link from 'next/link'
import { CheckCircle, TrendingUp, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Properties in Noida | Apartments on Expressway 2026 | DigiSoft',
  description: 'Buy apartments in Noida — Sectors 135-150 expressway corridor, Greater Noida West. Best deals on 2-4 BHK from ₹40 Lakh. Jewar Airport appreciation zone.',
}

const NOIDA_SECTORS = [
  { sector: 'Noida Expressway (135-150)', priceRange: '₹80L – ₹4 Cr', type: 'Premium', why: 'Best commercial zone, IT parks, airport proximity' },
  { sector: 'Greater Noida West', priceRange: '₹35L – ₹1.2 Cr', type: 'Affordable', why: 'Fastest growing micro-market, excellent connectivity' },
  { sector: 'Yamuna Expressway', priceRange: '₹30L – ₹2 Cr', type: 'Growth', why: 'Jewar Airport upcoming, huge long-term appreciation' },
  { sector: 'Sector 62-63 (Noida City)', priceRange: '₹60L – ₹2.5 Cr', type: 'Established', why: 'Metro connected, established IT hub, ready inventory' },
]

export default function NoidaPage() {
  return (
    <SiteLayout>
      <section className="relative h-72 md:h-96 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80" alt="Noida expressway apartments real estate investment 2026" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/75 to-navy/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container-site">
            <nav className="text-white/40 text-xs font-syne mb-3 flex items-center gap-2">
              <Link href="/">Home</Link><span>/</span>
              <Link href="/delhi-ncr">Delhi NCR</Link><span>/</span>
              <span className="text-gold">Noida</span>
            </nav>
            <p className="section-label mb-2">Noida — UP's Premium Real Estate Destination</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-3">Properties in Noida</h1>
            <p className="text-white/55 max-w-xl">From affordable flats in Greater Noida West to premium expressway apartments — explore Noida's complete property market.</p>
          </div>
        </div>
      </section>

      <section className="section bg-warm-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 prose-luxury">
              <h2 className="font-display text-3xl font-semibold text-navy mb-4">Why Invest in Noida in 2026?</h2>
              <p>Noida (New Okhla Industrial Development Authority) has rapidly transformed from an industrial satellite town to one of NCR's most dynamic real estate markets. With Jewar International Airport set to open in 2025-26, the Noida-Greater Noida expressway corridor is seeing unprecedented investor interest.</p>
              <p>Stamp duty in Uttar Pradesh (Noida's state) is 7% — slightly higher than Haryana, but female buyers can register jointly to access concession schemes. The ready-to-move segment in established sectors (62-65) offers excellent rental yields of 3-4% per annum.</p>
              <h3 className="font-syne font-semibold text-base text-navy mt-6 mb-3">Key Locations in Noida</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose">
                {NOIDA_SECTORS.map(s => (
                  <div key={s.sector} className="card p-4">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h4 className="font-syne font-semibold text-xs text-navy leading-snug">{s.sector}</h4>
                      <span className="badge badge-navy text-[9px] shrink-0">{s.type}</span>
                    </div>
                    <p className="text-xs text-dark-grey mb-1.5">{s.priceRange}</p>
                    <p className="text-xs text-mid-grey">{s.why}</p>
                  </div>
                ))}
              </div>
              <h3 className="font-syne font-semibold text-base text-navy mt-6 mb-3">Jewar Airport — The Game Changer</h3>
              <p>Noida International Airport at Jewar (also called Jewar Airport) is Asia's largest upcoming airport project. Once operational, it is expected to drive 15-20% appreciation in property values along the Yamuna Expressway corridor — making plots and apartments in this zone a high-conviction long-term investment.</p>
            </div>

            <div className="space-y-5">
              <div className="card p-5">
                <h3 className="font-syne font-semibold text-sm text-navy mb-4">Quick Stats: Noida 2026</h3>
                {[
                  { label: 'Average Price (Expressway)', val: '₹8,500/sq ft' },
                  { label: 'Average Price (Greater Noida W)', val: '₹4,200/sq ft' },
                  { label: 'YoY Appreciation', val: '+14%' },
                  { label: 'Rental Yield', val: '3–4% pa' },
                  { label: 'Stamp Duty (Male)', val: '7%' },
                  { label: 'Metro Connectivity', val: 'Aqua + Blue Lines' },
                ].map(s => (
                  <div key={s.label} className="flex justify-between py-2.5 border-b border-navy/6 last:border-0 text-sm">
                    <span className="text-dark-grey">{s.label}</span>
                    <span className="font-semibold text-navy">{s.val}</span>
                  </div>
                ))}
              </div>
              <div className="bg-navy rounded-xl3 p-6 text-center">
                <h3 className="font-display text-xl text-white font-semibold mb-3">Explore Noida Properties</h3>
                <Link href="/properties?city=Noida" className="btn btn-gold w-full justify-center mb-3">Browse All Properties</Link>
                <Link href="/contact" className="btn btn-outline-gold w-full justify-center text-sm">Free Expert Consultation</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
