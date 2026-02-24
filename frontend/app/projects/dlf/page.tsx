import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Phone, Shield, Star } from 'lucide-react'
import SiteLayout from '@/components/layout/SiteLayout'
import PropertyCard from '@/components/property/PropertyCard'
import LeadForm from '@/components/lead/LeadForm'
import { getPropertiesByDeveloper, DEVELOPERS } from '@/lib/mockData'

export const metadata: Metadata = {
  title: 'DLF Properties Gurugram | The Camellias, Privana, Crest | DigiSoft Nexus',
  description: "Explore DLF's premium properties in Gurugram — DLF The Camellias, Privana West, The Crest and more. India's largest developer. Expert advisory from authorised partner.",
  keywords: 'dlf properties gurugram, dlf the camellias, dlf privana, dlf apartments golf course road, dlf gurugram',
  alternates: { canonical: 'https://digisoftnexus.com/projects/dlf' },
}

export const revalidate = 300

export default function DLFHubPage() {
  const dev = DEVELOPERS['dlf']
  const properties = getPropertiesByDeveloper('dlf')

  return (
    <SiteLayout>
      {/* Hero */}
      <section
        className="relative py-20 md:py-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1C3D6B 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="container-site relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="bg-gold/20 text-gold text-[10px] font-syne font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-gold/30">
                  Authorised Channel Partner
                </span>
              </div>
              <h1 className="font-display text-hero-sm text-white mb-4">
                DLF Properties<br />Gurugram & NCR
              </h1>
              <p className="text-white/70 text-base leading-relaxed mb-6 max-w-lg">
                {dev.description}
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {dev.highlights.map(h => (
                  <div key={h} className="flex items-start gap-1.5 text-xs text-white/70">
                    <CheckCircle className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                    {h}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link href="/campaigns/dlf-privana-google-luxury" className="btn btn-primary btn-sm">
                  DLF Privana — New Launch <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="tel:+919999999999" className="btn btn-outline-gold btn-sm gap-2">
                  <Phone className="w-4 h-4" /> Speak to Expert
                </a>
              </div>
            </div>
            <LeadForm propertyTitle="DLF Properties Enquiry" source="dlf-hub" className="shadow-popup" />
          </div>
        </div>
      </section>

      {/* Properties */}
      <section className="py-12 md:py-16 bg-cream">
        <div className="container-site">
          <div className="mb-8">
            <p className="text-gold text-xs font-syne font-semibold uppercase tracking-widest mb-1">DLF Listings</p>
            <h2 className="font-display text-section text-navy">All DLF Projects</h2>
            <p className="text-dark-grey text-sm mt-1">From ultra-luxury penthouses to premium family residences</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* DLF Legacy */}
      <section className="py-12 bg-white">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <img
                src={dev.featuredImage}
                alt="DLF landmark project Gurugram skyline"
                className="rounded-xl3 shadow-luxury-md w-full h-64 object-cover"
              />
            </div>
            <div>
              <p className="text-gold text-xs font-syne font-semibold uppercase tracking-widest mb-2">75+ Years of Excellence</p>
              <h2 className="font-display text-section text-navy mb-4">India's Largest Real Estate Developer</h2>
              <p className="text-dark-grey text-sm leading-relaxed mb-5">
                DLF has been shaping India's built environment since 1946. From Golf Course Road to Cyber City,
                DLF has defined Gurugram's skyline. Their projects consistently outperform the market in 
                appreciation, rental yield, and resale value.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: '340M+', label: 'sq ft Delivered' },
                  { value: '75+', label: 'Years Legacy' },
                  { value: '15+', label: 'States' },
                ].map(s => (
                  <div key={s.label} className="text-center bg-cream rounded-xl p-3">
                    <p className="font-display text-xl font-semibold text-navy">{s.value}</p>
                    <p className="text-xs font-syne text-dark-grey mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
