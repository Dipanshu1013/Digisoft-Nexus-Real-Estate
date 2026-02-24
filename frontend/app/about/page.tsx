import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Award, Users, TrendingUp, Phone, Star, ArrowRight } from 'lucide-react'
import SiteLayout from '@/components/layout/SiteLayout'
import { TESTIMONIALS } from '@/lib/mockData'

export const metadata: Metadata = {
  title: 'About DigiSoft Nexus | Premier Real Estate Advisory Gurugram',
  description: 'Digisoft Nexus is a premier real estate advisory platform in Gurugram & NCR. Authorised partner for Godrej, DLF, M3M. 10+ years, 1200+ families, ₹500Cr+ deals.',
  alternates: { canonical: 'https://digisoftnexus.com/about' },
}

// LocalBusiness Schema
const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'DigiSoft Nexus',
  description: 'Premier real estate advisory platform in Gurugram specialising in Godrej, DLF, and M3M projects.',
  url: 'https://digisoftnexus.com',
  telephone: '+919999999999',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Golf Course Road',
    addressLocality: 'Gurugram',
    addressRegion: 'Haryana',
    postalCode: '122002',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 28.4595, longitude: 77.0266 },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '312' },
  sameAs: ['https://www.linkedin.com/company/digisoftnexus'],
}

export default function AboutPage() {
  const featured = TESTIMONIALS.slice(0, 3)

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />

      {/* Hero */}
      <section className="bg-navy py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="container-site relative z-10">
          <nav className="text-white/40 text-xs font-syne mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-white/70">Home</Link>
            <span>/</span>
            <span className="text-gold">About Us</span>
          </nav>
          <div className="max-w-2xl">
            <h1 className="font-display text-hero-sm text-white mb-4">
              Gurugram's Most Trusted Real Estate Advisory
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              Since 2014, Digisoft Nexus has helped over 1,200 families and investors 
              find their perfect property in Gurugram and Delhi NCR. We are an authorised 
              channel partner for India's top developers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="btn btn-primary btn-sm">
                Get Free Consultation <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/testimonials" className="btn btn-outline-gold btn-sm">
                Client Stories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-white border-b border-navy/6">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '10+', label: 'Years Experience', icon: Award },
              { value: '1,200+', label: 'Families Helped', icon: Users },
              { value: '₹500Cr+', label: 'Deals Closed', icon: TrendingUp },
              { value: '4.8★', label: 'Average Rating', icon: Star },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <p className="font-display text-2xl font-semibold text-navy">{value}</p>
                <p className="text-xs font-syne text-dark-grey mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-12 md:py-16 bg-cream">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gold text-xs font-syne font-semibold uppercase tracking-widest mb-2">Our Story</p>
              <h2 className="font-display text-section text-navy mb-4">
                Built on Trust, Powered by Expertise
              </h2>
              <div className="space-y-3 text-dark-grey text-sm leading-relaxed">
                <p>
                  Digisoft Nexus was founded in 2014 by a team of real estate professionals and technology 
                  entrepreneurs who saw a fundamental problem: buyers in Gurugram were making the most 
                  important financial decisions of their lives with incomplete, biased information.
                </p>
                <p>
                  We built a platform that combines the reach of technology with the nuance of expert 
                  human advisory. Our proprietary data on micro-market trends, developer reliability scores, 
                  and hyperlocal pricing empowers buyers to make decisions they won't regret.
                </p>
                <p>
                  Today, we are the authorised channel partner for Godrej Properties, DLF, and M3M — 
                  three of India's most respected developers — and have closed over ₹500 Crore in 
                  transactions across 1,200+ families.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"
                alt="Digisoft Nexus team at property site visit Gurugram"
                className="rounded-xl2 h-44 w-full object-cover shadow-luxury"
              />
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"
                alt="Premium luxury property Gurugram Digisoft Nexus listing"
                className="rounded-xl2 h-44 w-full object-cover shadow-luxury mt-6"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section className="py-12 bg-white">
        <div className="container-site">
          <h2 className="font-display text-section text-navy text-center mb-8">Our Commitments</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'Zero Conflict of Interest', desc: 'Our advisors are incentivised to find you the RIGHT property, not the most expensive one.' },
              { title: 'Transparency First', desc: 'Complete pricing disclosure, including all government charges, before any commitment.' },
              { title: 'RERA Compliance', desc: 'We only recommend RERA-registered projects. Period.' },
              { title: '30-Minute Response', desc: 'Every lead receives a human call within 30 minutes during business hours.' },
              { title: 'End-to-End Support', desc: 'From property search to registration to possession — we\'re with you.' },
              { title: 'Data-Driven Advisory', desc: 'Every recommendation is backed by transaction data, not guesswork.' },
            ].map(c => (
              <div key={c.title} className="bg-cream rounded-xl2 p-5">
                <CheckCircle className="w-5 h-5 text-gold mb-3" />
                <h3 className="font-syne font-semibold text-navy text-sm mb-1">{c.title}</h3>
                <p className="text-dark-grey text-xs">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client testimonials */}
      <section className="py-12 bg-cream">
        <div className="container-site">
          <h2 className="font-display text-section text-navy text-center mb-8">What Our Clients Say</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {featured.map(t => (
              <div key={t.id} className="bg-white rounded-xl2 p-5 shadow-card">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-dark-grey text-xs leading-relaxed mb-4 italic">"{t.text.slice(0, 120)}..."</p>
                <div className="flex items-center gap-2.5">
                  <img src={t.image} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="font-syne font-semibold text-navy text-xs">{t.name}</p>
                    <p className="text-[10px] text-mid-grey">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/testimonials" className="btn btn-outline btn-sm">
              Read All Testimonials <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-navy">
        <div className="container-site text-center">
          <h2 className="font-display text-section text-white mb-4">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-white/60 text-sm mb-6 max-w-lg mx-auto">
            Speak to one of our expert advisors — no cost, no pressure, 
            just honest guidance based on your unique needs.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:+919999999999" className="btn btn-primary btn-sm gap-2">
              <Phone className="w-4 h-4" /> Call: +91 99999 99999
            </a>
            <Link href="/contact" className="btn btn-outline-gold btn-sm">
              Send Us a Message
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
