import type { Metadata } from 'next'
import SiteLayout from '@/components/layout/SiteLayout'
import Link from 'next/link'
import { ArrowRight, Building2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Commercial Properties in Gurugram | Office & Retail Spaces | DigiSoft',
  description: 'Buy or lease commercial spaces in Gurugram — office units in Cyber City, DLF Cyber Park, M3M commercial towers. High rental yield 6-9% p.a.',
}

const COMMERCIAL_TYPES = [
  { type:'Office Units', icon:'🏢', range:'₹80L – ₹5 Cr', yield:'5–7% p.a.', desc:'Pre-leased and vacant office units in Gurugram\'s prime commercial zones.' },
  { type:'Retail Shops', icon:'🛍️', range:'₹40L – ₹3 Cr', yield:'6–9% p.a.', desc:'Ground floor retail in high-footfall mixed-use developments with long-term tenant potential.' },
  { type:'SCO Plots', icon:'📐', range:'₹1.5 Cr – ₹8 Cr', yield:'Capital + Rental', desc:'Shop-cum-office plots in premium sectors — build and lease for maximum returns.' },
  { type:'Co-working Floors', icon:'💼', range:'₹2 Cr – ₹15 Cr', yield:'7–10% p.a.', desc:'Enterprise co-working floors in IGBC-rated buildings — ideal for HNI investors.' },
]

export default function CommercialPage() {
  return (
    <SiteLayout>
      <section className="bg-navy py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-40" />
        <div className="container-site relative z-10">
          <p className="section-label mb-3">Commercial Real Estate</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">Commercial Properties in Gurugram</h1>
          <p className="text-white/55 max-w-xl">High-yield commercial investments — offices, retail, SCO plots in Gurugram's prime business districts.</p>
        </div>
      </section>
      <section className="section bg-warm-white">
        <div className="container-site">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {COMMERCIAL_TYPES.map(c => (
              <div key={c.type} className="card p-6">
                <p className="text-3xl mb-3">{c.icon}</p>
                <h3 className="font-syne font-semibold text-sm text-navy mb-1">{c.type}</h3>
                <div className="flex gap-2 mb-3">
                  <span className="badge badge-navy text-[10px]">{c.range}</span>
                  <span className="badge badge-gold text-[10px]">{c.yield}</span>
                </div>
                <p className="text-sm text-dark-grey">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/contact" className="btn btn-gold gap-2">Enquire About Commercial Units <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
