'use client'
import { useState, useEffect } from 'react'
import SiteLayout from '@/components/layout/SiteLayout'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, MapPin, Bed, Maximize2, ArrowRight, CheckCircle } from 'lucide-react'

const NEW_LAUNCHES = [
  { id:'1', slug:'godrej-emerald-sector-89', title:'Godrej Emerald', developer:'Godrej Properties', developerSlug:'godrej-properties', location:'Sector 89, Gurugram', launchedOn:'January 10, 2026', priceDisplay:'₹1.25 Cr onwards', bhkOptions:['2BHK','3BHK'], areaMin:1150, areaMax:1850, unitsAvailable:187, totalUnits:320, possessionDate:'Q4 2027', rera:'GGM/2024/001', image:'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=700&q=80', imageAlt:'Godrej Emerald new launch 2BHK 3BHK apartments Sector 89 Gurugram', highlights:['Smart home tech standard','Olympic pool + 20,000 sqft clubhouse','IGBC Green Certified'] },
  { id:'6', slug:'dlf-privana-sector-77', title:'DLF Privana', developer:'DLF Limited', developerSlug:'dlf', location:'Sector 77, Gurugram', launchedOn:'February 1, 2026', priceDisplay:'₹3.5 Cr onwards', bhkOptions:['3BHK','4BHK'], areaMin:2500, areaMax:3800, unitsAvailable:94, totalUnits:240, possessionDate:'Q2 2028', rera:'GGM/2024/078', image:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80', imageAlt:'DLF Privana new launch luxury 3BHK 4BHK apartments Sector 77 Gurugram', highlights:['Forest reserve facing apartments','80% open green area','DLF 70-year brand legacy'] },
  { id:'5', slug:'m3m-capital-sector-113', title:'M3M Capital Walk', developer:'M3M India', developerSlug:'m3m', location:'Sector 113, Gurugram', launchedOn:'January 25, 2026', priceDisplay:'₹1.8 Cr onwards', bhkOptions:['2BHK','3BHK'], areaMin:1400, areaMax:2200, unitsAvailable:211, totalUnits:450, possessionDate:'Q3 2027', rera:'GGM/2024/102', image:'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=700&q=80', imageAlt:'M3M Capital Walk new launch 2BHK 3BHK apartments Sector 113 Dwarka Expressway Gurugram', highlights:['Dwarka Expressway frontage','Integrated retail within complex','EV charging in every tower'] },
]

function LaunchBadge({ date }: { date: string }) {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
  if (days < 7)  return <span className="badge bg-red-500 text-white text-[10px]">🔥 Just Launched</span>
  if (days < 30) return <span className="badge bg-gold text-navy text-[10px]">✨ New Launch</span>
  return <span className="badge badge-navy text-[10px]">New</span>
}

export default function NewLaunchPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-navy py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-40" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
        <div className="container-site relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 rounded-full px-4 py-1.5 mb-4">
                <Zap className="w-3.5 h-3.5 text-gold fill-gold" />
                <span className="font-syne text-xs font-semibold uppercase tracking-widest text-gold">2026 Fresh Launches</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">New Launch Projects</h1>
              <p className="text-white/55 text-base max-w-xl">
                Freshly launched projects in Gurugram — book at introductory pricing before inventory runs out.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                { v: NEW_LAUNCHES.length, l: 'New Launches' },
                { v: NEW_LAUNCHES.reduce((a, p) => a + p.unitsAvailable, 0), l: 'Units Available' },
              ].map(s => (
                <div key={s.l} className="bg-white/6 border border-white/10 rounded-xl px-6 py-4 text-center">
                  <p className="font-display text-3xl font-semibold text-gold">{s.v}</p>
                  <p className="text-white/45 text-xs font-syne">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="section bg-warm-white">
        <div className="container-site">
          <div className="space-y-6">
            {NEW_LAUNCHES.map((p, i) => {
              const soldPct = Math.round(((p.totalUnits - p.unitsAvailable) / p.totalUnits) * 100)
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="card overflow-hidden group"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    {/* Image */}
                    <div className="relative h-60 md:h-auto overflow-hidden img-hover-zoom">
                      <img src={p.image} alt={p.imageAlt} className="img-luxury" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <LaunchBadge date={p.launchedOn} />
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy/80 to-transparent p-4">
                        <p className="text-gold font-display text-lg font-semibold">{p.priceDisplay}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <Link href={`/projects/${p.developerSlug}`}>
                          <p className="section-label mb-1 hover:text-gold-600 transition-colors">{p.developer}</p>
                        </Link>
                        <Link href={`/properties/${p.slug}`}>
                          <h3 className="font-display text-2xl font-semibold text-navy mb-2 group-hover:text-gold transition-colors">{p.title}</h3>
                        </Link>
                        <p className="flex items-center gap-1 text-sm text-dark-grey mb-1"><MapPin className="w-4 h-4 text-gold" />{p.location}</p>
                        <div className="flex gap-4 text-sm text-dark-grey mb-4">
                          <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{p.bhkOptions.join(', ')}</span>
                          <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" />{p.areaMin}–{p.areaMax} sq ft</span>
                        </div>
                        <ul className="space-y-1.5">
                          {p.highlights.map(h => (
                            <li key={h} className="flex items-center gap-2 text-xs text-dark-grey">
                              <CheckCircle className="w-3.5 h-3.5 text-gold shrink-0" />{h}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4 pt-4 border-t border-navy/8 grid grid-cols-2 gap-3 text-xs text-dark-grey">
                        <div><p className="text-mid-grey">Possession</p><p className="font-semibold text-navy">{p.possessionDate}</p></div>
                        <div><p className="text-mid-grey">RERA</p><p className="font-semibold text-navy">{p.rera}</p></div>
                      </div>
                    </div>

                    {/* Availability + CTA */}
                    <div className="bg-cream p-6 border-t md:border-t-0 md:border-l border-navy/8 flex flex-col justify-between">
                      <div>
                        <p className="font-syne font-semibold text-sm text-navy mb-2">Availability</p>
                        <p className="font-display text-3xl font-semibold text-navy mb-1">{p.unitsAvailable}</p>
                        <p className="text-xs text-dark-grey mb-3">units remaining of {p.totalUnits}</p>
                        <div className="h-2 bg-navy/10 rounded-full overflow-hidden mb-1">
                          <div className="h-full bg-gradient-gold rounded-full" style={{ width: `${soldPct}%` }} />
                        </div>
                        <p className="text-[10px] text-mid-grey font-syne">{soldPct}% booked</p>
                      </div>
                      <div className="mt-6 space-y-2.5">
                        <Link href={`/properties/${p.slug}`} className="btn btn-gold w-full justify-center text-sm">
                          View Details <ArrowRight className="w-4 h-4" />
                        </Link>
                        <a href="https://wa.me/919910000000" target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full justify-center text-sm gap-1.5">
                          📱 WhatsApp Enquiry
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/properties" className="btn btn-outline gap-2">
              View All Properties <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
