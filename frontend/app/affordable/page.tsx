import type { Metadata } from 'next'
import SiteLayout from '@/components/layout/SiteLayout'
import Link from 'next/link'
import { CheckCircle, MapPin, Bed, Maximize2, ArrowRight, Home } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Affordable Homes in Gurugram | 2BHK Under ₹80 Lakh | DigiSoft',
  description: 'Find affordable 2BHK and 3BHK apartments in Gurugram under ₹80 Lakh. Best budget housing near Dwarka Expressway, New Gurugram from Godrej, M3M.',
}

const AFFORDABLE_PROPERTIES = [
  { id:'4', slug:'godrej-meridian-sector-106', title:'Godrej Meridian', developer:'Godrej Properties', location:'Sector 106, Gurugram', priceDisplay:'₹78 L onwards', bhkOptions:['2BHK','3BHK'], areaMin:850, possessionStatus:'Ready to Move', image:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80', imageAlt:'Godrej Meridian affordable 2BHK apartments Sector 106 Gurugram ready to move', emi:'₹60,000/mo*', tag:'Best Value', tagColor:'bg-success/90 text-white' },
  { id:'5', slug:'m3m-capital-sector-113', title:'M3M Capital Walk', developer:'M3M India', location:'Sector 113, Gurugram', priceDisplay:'₹1.8 Cr onwards', bhkOptions:['2BHK','3BHK'], areaMin:1400, possessionStatus:'New Launch', image:'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=700&q=80', imageAlt:'M3M Capital Walk affordable 2BHK apartments Sector 113 Dwarka Expressway Gurugram', emi:'₹1.35 L/mo*', tag:'New Launch', tagColor:'bg-navy text-gold' },
]

const FIRST_BUYER_TIPS = [
  { title: 'Check RERA Registration', desc: 'Always verify RERA number before booking. All our listed projects are RERA registered.' },
  { title: 'Budget for Hidden Costs', desc: 'Add 10-12% for stamp duty, registration, GST on under-construction properties, and interiors.' },
  { title: 'Compare Carpet vs. Super Area', desc: 'Always negotiate on carpet area, not super built-up. Carpet area is what you actually live in.' },
  { title: 'Get Home Loan Pre-Approval', desc: 'Get pre-approved before finalizing — it gives you negotiating power and speeds up the process.' },
  { title: 'Inspect Before Payment', desc: 'For ready-to-move properties, insist on a physical inspection before making any payments.' },
]

export default function AffordablePage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-navy py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-40" />
        <div className="container-site relative z-10">
          <p className="section-label mb-3">Budget-Friendly Homes</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
            Affordable Homes in Gurugram
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Quality homes under ₹1 Crore — carefully selected projects that don't compromise on construction quality, location, or amenities.
          </p>
        </div>
      </section>

      {/* Listings */}
      <section className="section bg-warm-white">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {AFFORDABLE_PROPERTIES.map(p => (
              <Link key={p.id} href={`/properties/${p.slug}`}>
                <div className="card-hover group overflow-hidden h-full">
                  <div className="relative h-52 overflow-hidden img-hover-zoom">
                    <img src={p.image} alt={p.imageAlt} className="img-luxury" />
                    <span className={`absolute top-3 left-3 badge text-[10px] ${p.tagColor}`}>{p.tag}</span>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy/80 to-transparent p-4">
                      <p className="text-gold font-display text-lg font-semibold">{p.priceDisplay}</p>
                      <p className="text-white/70 text-xs">EMI from {p.emi}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="section-label mb-1">{p.developer}</p>
                    <h3 className="font-display text-xl font-semibold text-navy mb-2 group-hover:text-gold transition-colors">{p.title}</h3>
                    <p className="flex items-center gap-1 text-xs text-dark-grey mb-3"><MapPin className="w-3.5 h-3.5 text-gold" />{p.location}</p>
                    <div className="flex gap-4 text-xs text-dark-grey border-t border-navy/6 pt-3">
                      <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{p.bhkOptions.join(', ')}</span>
                      <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" />From {p.areaMin} sq ft</span>
                      <span className="text-success font-medium">{p.possessionStatus}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* First-time buyer guide */}
          <div className="bg-cream rounded-xl4 p-8">
            <div className="text-center mb-8">
              <p className="section-label mb-2">First-Time Buyer Guide</p>
              <h2 className="section-title">5 Things to Know Before Buying Your First Home</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FIRST_BUYER_TIPS.slice(0, 3).map((tip, i) => (
                <div key={tip.title} className="bg-white rounded-xl3 p-5 shadow-card">
                  <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center mb-3">
                    <span className="font-syne font-bold text-sm text-gold">{i + 1}</span>
                  </div>
                  <h4 className="font-syne font-semibold text-sm text-navy mb-2">{tip.title}</h4>
                  <p className="text-xs text-dark-grey leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {FIRST_BUYER_TIPS.slice(3).map((tip, i) => (
                <div key={tip.title} className="bg-white rounded-xl3 p-5 shadow-card">
                  <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center mb-3">
                    <span className="font-syne font-bold text-sm text-gold">{i + 4}</span>
                  </div>
                  <h4 className="font-syne font-semibold text-sm text-navy mb-2">{tip.title}</h4>
                  <p className="text-xs text-dark-grey leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tools CTA */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/calculator/emi" className="card p-5 text-center hover:shadow-luxury-md transition-shadow">
              <p className="text-2xl mb-2">📊</p>
              <p className="font-syne font-semibold text-sm text-navy">EMI Calculator</p>
              <p className="text-xs text-dark-grey mt-1">Know your monthly outflow</p>
            </Link>
            <Link href="/calculator/stamp-duty" className="card p-5 text-center hover:shadow-luxury-md transition-shadow">
              <p className="text-2xl mb-2">📋</p>
              <p className="font-syne font-semibold text-sm text-navy">Stamp Duty Calculator</p>
              <p className="text-xs text-dark-grey mt-1">Total cost including taxes</p>
            </Link>
            <Link href="/contact" className="card p-5 text-center hover:shadow-luxury-md transition-shadow">
              <p className="text-2xl mb-2">🤝</p>
              <p className="font-syne font-semibold text-sm text-navy">Free Consultation</p>
              <p className="text-xs text-dark-grey mt-1">Talk to our home loan expert</p>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
