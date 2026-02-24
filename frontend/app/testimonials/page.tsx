import type { Metadata } from 'next'
import Link from 'next/link'
import { Star, ArrowRight, Quote, CheckCircle } from 'lucide-react'
import SiteLayout from '@/components/layout/SiteLayout'
import { TESTIMONIALS } from '@/lib/mockData'

export const metadata: Metadata = {
  title: 'Client Testimonials | Real Estate Reviews Gurugram | DigiSoft Nexus',
  description: 'Read 300+ verified client testimonials. Real families who bought their dream home in Gurugram with Digisoft Nexus. 4.8★ average rating.',
  alternates: { canonical: 'https://digisoftnexus.com/testimonials' },
}

// Review Schema
const reviewSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: TESTIMONIALS.map((t, i) => ({
    '@type': 'Review',
    position: i + 1,
    author: { '@type': 'Person', name: t.name },
    reviewRating: { '@type': 'Rating', ratingValue: t.rating, bestRating: 5 },
    reviewBody: t.text,
    itemReviewed: { '@type': 'RealEstateAgent', name: 'DigiSoft Nexus' },
  })),
}

export default function TestimonialsPage() {
  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      
      {/* Header */}
      <section className="bg-navy py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="container-site relative z-10 text-center">
          <h1 className="font-display text-hero-sm text-white mb-3">Real Stories. Real Families.</h1>
          <p className="text-white/60 text-base max-w-xl mx-auto mb-6">
            Over 1,200 families have trusted Digisoft Nexus for the most important purchase of their lives.
          </p>
          <div className="inline-flex items-center gap-3 bg-white/10 rounded-full px-6 py-3">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-white font-syne font-bold text-sm">4.8</span>
            <span className="text-white/50 text-xs">from 312 verified reviews</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-cream py-8 border-b border-navy/6">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
            {[
              { value: '1,200+', label: 'Families Served' },
              { value: '4.8★', label: 'Avg. Rating' },
              { value: '98%', label: 'Recommend Us' },
              { value: '₹500Cr+', label: 'Deals Closed' },
            ].map(s => (
              <div key={s.label}>
                <p className="font-display text-2xl font-semibold text-navy">{s.value}</p>
                <p className="text-xs font-syne text-dark-grey mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-12 bg-white">
        <div className="container-site">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.id} className="bg-cream rounded-xl2 p-6 border border-navy/6 hover:shadow-luxury transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-gold/30 mb-3" />
                <p className="text-dark-grey text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-navy/6">
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-syne font-semibold text-navy text-sm">{t.name}</p>
                    <p className="text-[11px] text-mid-grey">{t.title}</p>
                    <p className="text-[10px] text-gold font-semibold mt-0.5">{t.property}</p>
                  </div>
                  <div className="ml-auto">
                    <CheckCircle className="w-4 h-4 text-success" title="Verified buyer" />
                  </div>
                </div>
                <p className="text-[10px] text-mid-grey mt-3">{t.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-navy text-center">
        <div className="container-site">
          <h2 className="font-display text-section text-white mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-white/60 text-sm mb-6">Join 1,200+ families who found their perfect home with us.</p>
          <Link href="/contact" className="btn btn-primary">
            Get Free Consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  )
}
