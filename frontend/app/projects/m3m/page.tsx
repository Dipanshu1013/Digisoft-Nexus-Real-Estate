import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Phone } from 'lucide-react'
import SiteLayout from '@/components/layout/SiteLayout'
import PropertyCard from '@/components/property/PropertyCard'
import LeadForm from '@/components/lead/LeadForm'
import { getPropertiesByDeveloper, DEVELOPERS } from '@/lib/mockData'

export const metadata: Metadata = {
  title: 'M3M India Properties Gurugram | Golf Estate, Altitude, Capital Walk | DigiSoft Nexus',
  description: 'Explore M3M India properties in Gurugram — M3M Altitude, Golf Estate, Capital Walk. Fast-growing luxury developer NCR. Expert advisory from authorised partner.',
  alternates: { canonical: 'https://digisoftnexus.com/projects/m3m' },
}

export const revalidate = 300

export default function M3MHubPage() {
  const dev = DEVELOPERS['m3m']
  const properties = getPropertiesByDeveloper('m3m')

  return (
    <SiteLayout>
      <section className="bg-navy py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="container-site relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-5">
                <span className="text-gold text-xs font-syne font-bold uppercase tracking-wider">
                  Authorised Partner — M3M India
                </span>
              </div>
              <h1 className="font-display text-hero-sm text-white mb-4">
                M3M India Projects in Gurugram
              </h1>
              <p className="text-white/70 text-base leading-relaxed mb-6 max-w-lg">{dev.description}</p>
              <div className="space-y-2 mb-6">
                {dev.highlights.map(h => (
                  <div key={h} className="flex items-center gap-2 text-sm text-white/70">
                    <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                    {h}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link href="/campaigns/m3m-capital-pre-launch" className="btn btn-primary btn-sm">
                  M3M Capital — Pre-Launch <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="tel:+919999999999" className="btn btn-outline-gold btn-sm gap-2">
                  <Phone className="w-4 h-4" /> Call Expert
                </a>
              </div>
            </div>
            <LeadForm propertyTitle="M3M India Enquiry" source="m3m-hub" className="shadow-popup" />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-cream">
        <div className="container-site">
          <div className="mb-8">
            <p className="text-gold text-xs font-syne font-semibold uppercase tracking-widest mb-1">All M3M Projects</p>
            <h2 className="font-display text-section text-navy">M3M India Listings</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
