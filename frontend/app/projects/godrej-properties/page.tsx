import type { Metadata } from 'next'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Star, Phone, Shield } from 'lucide-react'
import SiteLayout from '@/components/layout/SiteLayout'
import PropertyCard from '@/components/property/PropertyCard'
import LeadForm from '@/components/lead/LeadForm'
import { getPropertiesByDeveloper, DEVELOPERS } from '@/lib/mockData'

export const metadata: Metadata = {
  title: 'Godrej Properties Gurugram & NCR | All Projects 2026 | DigiSoft Nexus',
  description: 'Explore all Godrej Properties projects in Gurugram, Delhi NCR & Noida. Godrej Emerald, Meridian, Nature Plus and more. Expert advisory, exclusive pre-launch access.',
  keywords: 'godrej properties gurugram, godrej emerald, godrej meridian, godrej properties noida, godrej apartments',
  alternates: { canonical: 'https://digisoftnexus.com/projects/godrej-properties' },
}

export const revalidate = 300

export default function GodrejHubPage() {
  const dev = DEVELOPERS['godrej-properties']
  const properties = getPropertiesByDeveloper('godrej-properties')

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-navy py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="container-site relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-white rounded-xl p-3 shadow-luxury w-16 h-16 flex items-center justify-center">
                  <span className="font-display font-bold text-navy text-sm text-center leading-tight">GODREJ</span>
                </div>
                <div>
                  <p className="text-gold text-xs font-syne font-semibold uppercase tracking-widest">
                    Authorised Channel Partner
                  </p>
                  <p className="text-white/60 text-xs">Est. {dev.established} · {dev.totalProjects}+ Projects</p>
                </div>
              </div>
              <h1 className="font-display text-hero-sm text-white mb-4">
                Godrej Properties in Gurugram & NCR
              </h1>
              <p className="text-white/70 text-base leading-relaxed mb-6 max-w-lg">
                {dev.description}
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                {dev.highlights.slice(0, 3).map(h => (
                  <div key={h} className="flex items-center gap-1.5 text-xs text-white/70">
                    <CheckCircle className="w-3.5 h-3.5 text-gold" />
                    {h}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link href="/campaigns/godrej-emerald-facebook-may2026" className="btn btn-primary btn-sm">
                  View Pre-Launch Projects <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="tel:+919999999999" className="btn btn-outline-gold btn-sm gap-2">
                  <Phone className="w-4 h-4" /> Call Expert
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <LeadForm
                propertyTitle="Godrej Properties Enquiry"
                source="godrej-hub"
                className="shadow-popup"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-cream py-8 border-b border-navy/6">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { value: `${dev.established}`, label: 'Established' },
              { value: `${dev.totalProjects}+`, label: 'Total Projects' },
              { value: `${(dev.totalUnitsDelivered / 1000).toFixed(0)}K+`, label: 'Units Delivered' },
              { value: `${dev.rating}★`, label: 'Avg. Rating' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="font-display text-2xl font-semibold text-navy">{s.value}</p>
                <p className="text-xs font-syne text-dark-grey mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties */}
      <section className="py-12 md:py-16">
        <div className="container-site">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-gold text-xs font-syne font-semibold uppercase tracking-widest mb-1">All Projects</p>
              <h2 className="font-display text-section text-navy">Godrej Properties Listings</h2>
            </div>
            <span className="bg-navy/8 text-navy text-xs font-syne font-semibold px-3 py-1.5 rounded-full">
              {properties.length} Projects
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="bg-navy py-12">
        <div className="container-site">
          <h2 className="font-display text-section text-white text-center mb-8">
            Why Buy Godrej Through Digisoft Nexus?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Shield, title: 'Official Partner', desc: 'Directly authorised by Godrej Properties — best pricing guaranteed.' },
              { icon: Star, title: 'Expert Advisory', desc: 'Our team has sold 200+ Godrej units — unmatched product knowledge.' },
              { icon: CheckCircle, title: 'End-to-End Support', desc: 'From site visit to registration — we handle everything.' },
              { icon: Phone, title: '30-Min Response', desc: 'Fastest response in NCR — real advisors, not chatbots.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/5 rounded-xl2 p-5 border border-white/10 text-center">
                <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-syne font-semibold text-white text-sm mb-1">{title}</h3>
                <p className="text-white/60 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
