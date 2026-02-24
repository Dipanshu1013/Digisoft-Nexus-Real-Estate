import type { Metadata } from 'next'
import SiteLayout from '@/components/layout/SiteLayout'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Rent Property in Gurugram & NCR | 2BHK 3BHK Flats for Rent',
  description: 'Find rental apartments in Gurugram, Noida, and Delhi NCR. Furnished and unfurnished 1-4 BHK flats for rent near DLF Cyber City, Sector 62, and more.',
}

const RENT_AREAS = [
  { area: 'DLF Cyber City', rent: '₹25,000 – ₹80,000/mo', type: '2-3 BHK', demand: 'Very High' },
  { area: 'Golf Course Road', rent: '₹50,000 – ₹2.5L/mo', type: '3-5 BHK', demand: 'High' },
  { area: 'Sohna Road', rent: '₹15,000 – ₹45,000/mo', type: '2-3 BHK', demand: 'High' },
  { area: 'Sector 62, Noida', rent: '₹20,000 – ₹55,000/mo', type: '2-3 BHK', demand: 'High' },
]

export default function RentPage() {
  return (
    <SiteLayout>
      <section className="bg-navy py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-40" />
        <div className="container-site relative z-10">
          <p className="section-label mb-3">Rental Properties</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">Rent in Gurugram & NCR</h1>
          <p className="text-white/55 max-w-xl">Premium rental apartments near major employment hubs — furnished, semi-furnished, and unfurnished options available.</p>
        </div>
      </section>
      <section className="section bg-warm-white">
        <div className="container-site max-w-3xl">
          <div className="text-center mb-8">
            <p className="section-label mb-2">Popular Areas</p>
            <h2 className="section-title">Rental Rates Across NCR</h2>
          </div>
          <div className="space-y-3 mb-10">
            {RENT_AREAS.map(a => (
              <div key={a.area} className="card p-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-syne font-semibold text-sm text-navy">{a.area}</h3>
                  <p className="text-xs text-dark-grey">{a.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-navy text-sm">{a.rent}</p>
                  <span className="badge badge-gold text-[10px]">Demand: {a.demand}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-navy rounded-xl3 p-7 text-center">
            <h3 className="font-display text-xl text-white font-semibold mb-3">Looking for a Rental Home?</h3>
            <p className="text-white/55 text-sm mb-5">Our rental division helps you find, negotiate, and move into your perfect rental — at no charge to tenants.</p>
            <Link href="/contact" className="btn btn-gold gap-2">Find Rental Homes <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
