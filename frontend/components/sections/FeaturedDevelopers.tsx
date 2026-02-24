'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'

const developers = [
  {
    slug: 'godrej-properties',
    name: 'Godrej Properties',
    tagline: 'Excellence. Trust. Innovation.',
    description: 'Award-winning developer with pan-India presence. Known for quality construction and timely delivery.',
    projectCount: 12,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    highlights: ['RERA Compliant', 'On-Time Delivery', 'World-Class Amenities'],
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accentColor: 'from-emerald-600 to-teal-700',
  },
  {
    slug: 'dlf',
    name: 'DLF Limited',
    tagline: "India's Largest Real Estate Company",
    description: 'India\'s premier real estate developer with 70+ years of trust. Luxury and ultra-luxury residential spaces.',
    projectCount: 8,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    highlights: ['70+ Years Legacy', 'Premium Locations', 'Smart Home Tech'],
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    accentColor: 'from-blue-700 to-indigo-800',
  },
  {
    slug: 'm3m',
    name: 'M3M India',
    tagline: 'Magnificence. Magnanimity. Mastery.',
    description: 'Fast-growing luxury developer redefining modern living in Gurugram with ultra-premium integrated townships.',
    projectCount: 10,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    highlights: ['Luxury Lifestyle', 'Integrated Townships', 'High ROI Potential'],
    badgeColor: 'bg-gold/10 text-gold-700 border-gold/30',
    accentColor: 'from-amber-600 to-orange-700',
  },
]

export default function FeaturedDevelopers() {
  return (
    <section className="section bg-warm-white">
      <div className="container-site">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-label mb-3">Trusted Partners</p>
          <h2 className="section-title mb-4">
            India's Most Trusted Developers
          </h2>
          <p className="section-subtitle mx-auto text-center">
            We are the authorised channel partner for these premium brands — 
            offering you exclusive pricing, first access to launches, and dedicated support.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {developers.map((dev, i) => (
            <motion.div
              key={dev.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <Link href={`/projects/${dev.slug}`}>
                <div className="card-hover group h-full overflow-hidden">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden img-hover-zoom">
                    <img
                      src={dev.image}
                      alt={`${dev.name} premium properties in Gurugram`}
                      className="img-luxury"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${dev.accentColor} opacity-50`} />
                    <div className="absolute bottom-4 left-4">
                      <span className={`badge text-xs border ${dev.badgeColor}`}>
                        {dev.projectCount} Active Projects
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="font-syne text-[10px] font-semibold uppercase tracking-widest text-gold mb-1">
                      {dev.tagline}
                    </p>
                    <h3 className="font-display text-xl font-semibold text-navy mb-2">
                      {dev.name}
                    </h3>
                    <p className="text-sm text-dark-grey leading-relaxed mb-4">
                      {dev.description}
                    </p>

                    {/* Highlights */}
                    <ul className="space-y-1.5 mb-5">
                      {dev.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2 text-xs text-dark-grey">
                          <CheckCircle className="w-3.5 h-3.5 text-gold shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center gap-1 text-sm font-syne font-semibold text-navy group-hover:text-gold transition-colors">
                      Explore Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View all CTA */}
        <div className="text-center mt-10">
          <Link href="/properties" className="btn btn-outline">
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  )
}
