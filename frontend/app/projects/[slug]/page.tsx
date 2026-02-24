import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SiteLayout from '@/components/layout/SiteLayout'
import Link from 'next/link'
import { CheckCircle, ArrowRight, MapPin, Bed, Maximize2, Phone } from 'lucide-react'

const DEVELOPER_DATA: Record<string, any> = {
  'godrej-properties': {
    name: 'Godrej Properties',
    tagline: 'Excellence. Trust. Innovation.',
    heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=80',
    heroImageAlt: 'Godrej Properties premium apartments Gurugram Delhi NCR',
    established: 1990,
    totalProjects: 150,
    citiesPresent: ['Gurugram', 'Mumbai', 'Pune', 'Bangalore', 'Delhi NCR', 'Noida'],
    reraId: 'Godrej Properties Ltd.',
    description: 'Godrej Properties brings the Godrej Group\'s 125+ years of trust and excellence to the real estate industry. Every project combines contemporary design, high construction quality, and world-class amenities — delivering homes that are as safe as they are beautiful.',
    whyChoose: [
      'Godrej Group\'s 125+ years of brand trust',
      'Award-winning architecture and design',
      'Consistent on-time delivery track record',
      'Green building practices — IGBC certified',
      'Post-possession customer support',
    ],
    accentColor: '#16A34A',
    metaTitle: 'Godrej Properties Projects in Gurugram & NCR | DigiSoft Nexus',
    metaDescription: 'Explore all Godrej Properties projects in Gurugram, Delhi NCR. 2 & 3 BHK apartments, luxury residences. Best prices, exclusive offers from authorised partner.',
  },
  'dlf': {
    name: 'DLF Limited',
    tagline: "India's Largest Real Estate Company",
    heroImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80',
    heroImageAlt: 'DLF luxury apartments Golf Course Road Gurugram Delhi NCR',
    established: 1946,
    totalProjects: 180,
    citiesPresent: ['Gurugram', 'Delhi', 'Chennai', 'Kolkata', 'Chandigarh'],
    reraId: 'DLF Limited',
    description: "DLF Limited, India's largest real estate company, has been shaping the country's skyline since 1946. With 70+ years of excellence and a legacy of delivering iconic properties, DLF has become synonymous with luxury and ultra-premium living.",
    whyChoose: [
      '70+ years of real estate excellence',
      'Iconic luxury developments across India',
      'Ultra-premium locations — Golf Course Road, DLF5',
      'World-class construction standards',
      'Exclusive concierge and lifestyle services',
    ],
    accentColor: '#2563EB',
    metaTitle: 'DLF Properties in Gurugram | Luxury Apartments & Villas | DigiSoft',
    metaDescription: 'Discover DLF luxury properties in Gurugram — The Camellias, Privana, and more. Ultra-premium 3-5 BHK apartments from ₹3.5 Cr. Authorised channel partner.',
  },
  'm3m': {
    name: 'M3M India',
    tagline: 'Magnificence. Magnanimity. Mastery.',
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80',
    heroImageAlt: 'M3M India luxury integrated township Gurugram',
    established: 2010,
    totalProjects: 65,
    citiesPresent: ['Gurugram', 'Noida', 'Panipat'],
    reraId: 'M3M India Pvt. Ltd.',
    description: 'M3M India has rapidly emerged as one of Gurugram\'s most prestigious developers, known for creating world-class integrated townships that blend residences, retail, offices, and hospitality into single-destination communities.',
    whyChoose: [
      'Integrated township concepts — live-work-play',
      'Premium locations on Golf Course Extension Road',
      'High investment appreciation potential',
      'Modern smart home technology',
      'IGBC Gold rated green buildings',
    ],
    accentColor: '#D4AF37',
    metaTitle: 'M3M Projects in Gurugram | Luxury Apartments & Townships | DigiSoft',
    metaDescription: 'Browse M3M India projects in Gurugram — M3M Altitude, Capital Walk, Golf Estate. Luxury 2-4 BHK from ₹1.8 Cr. Exclusive pre-launch access.',
  },
}

const DEVELOPER_PROPERTIES: Record<string, any[]> = {
  'godrej-properties': [
    { id:'1', slug:'godrej-emerald-sector-89', title:'Godrej Emerald', location:'Sector 89, Gurugram', priceDisplay:'₹1.25 Cr onwards', bhkOptions:['2BHK','3BHK'], areaMin:1150, possessionStatus:'new-launch', image:'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80', imageAlt:'Godrej Emerald 3BHK Sector 89 Gurugram exterior' },
    { id:'4', slug:'godrej-meridian-sector-106', title:'Godrej Meridian', location:'Sector 106, Gurugram', priceDisplay:'₹78 L onwards', bhkOptions:['2BHK','3BHK'], areaMin:850, possessionStatus:'ready-to-move', image:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', imageAlt:'Godrej Meridian 2BHK Sector 106 Gurugram ready to move' },
  ],
  'dlf': [
    { id:'2', slug:'dlf-the-camellias', title:'DLF The Camellias', location:'Golf Course Road, Gurugram', priceDisplay:'₹12 Cr onwards', bhkOptions:['4BHK','5BHK'], areaMin:5800, possessionStatus:'ready-to-move', image:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', imageAlt:'DLF Camellias ultra-luxury Golf Course Road Gurugram' },
    { id:'6', slug:'dlf-privana-sector-77', title:'DLF Privana', location:'Sector 77, Gurugram', priceDisplay:'₹3.5 Cr onwards', bhkOptions:['3BHK','4BHK'], areaMin:2500, possessionStatus:'new-launch', image:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', imageAlt:'DLF Privana luxury 3BHK Sector 77 Gurugram new launch' },
  ],
  'm3m': [
    { id:'3', slug:'m3m-altitude-sector-65', title:'M3M Altitude', location:'Sector 65, Gurugram', priceDisplay:'₹2.8 Cr onwards', bhkOptions:['3BHK','4BHK'], areaMin:2100, possessionStatus:'under-construction', image:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80', imageAlt:'M3M Altitude luxury 3BHK Sector 65 Gurugram high-rise' },
    { id:'5', slug:'m3m-capital-sector-113', title:'M3M Capital Walk', location:'Sector 113, Gurugram', priceDisplay:'₹1.8 Cr onwards', bhkOptions:['2BHK','3BHK'], areaMin:1400, possessionStatus:'pre-launch', image:'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80', imageAlt:'M3M Capital Walk 2BHK Sector 113 Gurugram pre-launch' },
  ],
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const dev = DEVELOPER_DATA[params.slug]
  if (!dev) return { title: 'Developer Not Found' }
  return { title: dev.metaTitle, description: dev.metaDescription }
}

const possessionTag: Record<string, { label: string; color: string }> = {
  'ready-to-move':      { label: 'Ready to Move', color: 'bg-success/90 text-white' },
  'new-launch':         { label: 'New Launch', color: 'bg-navy text-gold' },
  'pre-launch':         { label: 'Pre-Launch', color: 'bg-amber-500 text-white' },
  'under-construction': { label: 'Under Construction', color: 'bg-dark-grey/80 text-white' },
}

export default function ProjectHubPage({ params }: { params: { slug: string } }) {
  const dev = DEVELOPER_DATA[params.slug]
  if (!dev) notFound()

  const properties = DEVELOPER_PROPERTIES[params.slug] || []

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <img src={dev.heroImage} alt={dev.heroImageAlt} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-navy/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container-site">
            <nav className="text-white/40 text-xs font-syne mb-3 flex items-center gap-2">
              <Link href="/" className="hover:text-white/70">Home</Link>
              <span>/</span>
              <Link href="/properties" className="hover:text-white/70">Properties</Link>
              <span>/</span>
              <span className="text-gold">{dev.name}</span>
            </nav>
            <p className="section-label mb-2">{dev.tagline}</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-3">
              {dev.name}
            </h1>
            <p className="text-white/55 text-sm">
              Est. {dev.established} · {dev.totalProjects}+ Projects · {dev.citiesPresent.slice(0, 3).join(', ')} & more
            </p>
          </div>
        </div>
      </section>

      {/* Developer info + properties */}
      <section className="section bg-warm-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: About */}
            <div className="lg:col-span-1">
              <div className="card p-6 mb-5">
                <h2 className="font-syne font-semibold text-base text-navy mb-3">About {dev.name}</h2>
                <p className="text-sm text-dark-grey leading-relaxed mb-5">{dev.description}</p>
                <h3 className="font-syne font-semibold text-xs uppercase tracking-wider text-gold mb-3">Why Choose {dev.name.split(' ')[0]}?</h3>
                <ul className="space-y-2">
                  {dev.whyChoose.map((w: string) => (
                    <li key={w} className="flex items-start gap-2 text-sm text-dark-grey">
                      <CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Enquiry CTA */}
              <div className="bg-navy rounded-xl3 p-6 text-center">
                <p className="text-white/60 text-xs font-syne uppercase tracking-wider mb-2">Exclusive Access</p>
                <h3 className="font-display text-xl text-white font-semibold mb-3">
                  Get Pre-Launch Pricing from {dev.name.split(' ')[0]}
                </h3>
                <Link href="/contact" className="btn btn-gold w-full justify-center mb-3">
                  Book Free Consultation
                </Link>
                <a
                  href="https://wa.me/919910000000"
                  className="flex items-center justify-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" /> WhatsApp Now
                </a>
              </div>
            </div>

            {/* Right: Properties grid */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-title text-2xl">
                  {dev.name.split(' ')[0]} Projects in Gurugram
                </h2>
                <span className="badge badge-navy">{properties.length} Active</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {properties.map((p, i) => {
                  const tag = possessionTag[p.possessionStatus]
                  return (
                    <Link key={p.id} href={`/properties/${p.slug}`}>
                      <div className="card-hover group overflow-hidden h-full">
                        <div className="relative h-48 overflow-hidden img-hover-zoom">
                          <img src={p.image} alt={p.imageAlt} className="img-luxury" />
                          {tag && (
                            <span className={`absolute top-3 left-3 badge text-[10px] ${tag.color}`}>{tag.label}</span>
                          )}
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy/80 to-transparent p-3">
                            <p className="text-gold font-display text-base font-semibold">{p.priceDisplay}</p>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-display text-lg font-semibold text-navy mb-1 group-hover:text-gold transition-colors">
                            {p.title}
                          </h3>
                          <p className="flex items-center gap-1 text-xs text-dark-grey mb-3">
                            <MapPin className="w-3.5 h-3.5 text-gold" />{p.location}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-dark-grey border-t border-navy/5 pt-3">
                            <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{p.bhkOptions.join(', ')}</span>
                            <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" />From {p.areaMin} sq ft</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              <div className="text-center mt-8">
                <Link href="/properties" className="btn btn-outline gap-2">
                  View All Properties <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
