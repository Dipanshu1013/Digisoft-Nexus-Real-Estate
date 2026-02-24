import type { Metadata } from 'next'
import SiteLayout from '@/components/layout/SiteLayout'
import Link from 'next/link'
import { Shield, Users, TrendingUp, Clock, Award, Headphones, CheckCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Why Choose DigiSoft Nexus | Zero Brokerage, Best Price Guaranteed',
  description: 'Why 1200+ families trust DigiSoft Nexus — zero hidden charges, best price guarantee, RERA expertise, and dedicated relationship managers for every buyer.',
}

const USPS = [
  { icon: Shield, title: 'Zero Hidden Charges', desc: 'What you see is what you pay. No surprise fees, no last-minute add-ons. Full financial breakdown before booking.', stat: '100%', statLabel: 'Transparent Pricing' },
  { icon: Users, title: 'Dedicated Relationship Manager', desc: 'Your assigned RM handles everything — property shortlisting, site visits, loan coordination, documentation, and registration.', stat: '1:1', statLabel: 'Personal Advisor' },
  { icon: TrendingUp, title: 'Best Price Guarantee', desc: 'As authorised channel partners of Godrej, DLF, and M3M, we get exclusive pre-launch and launch pricing not available elsewhere.', stat: '18%', statLabel: 'Avg. Savings vs. Market' },
  { icon: Clock, title: 'Fastest Turnaround', desc: 'Property shortlisted in 24 hours. Site visit arranged within 48 hours. Loan pre-approval in 3 days. Documentation in one week.', stat: '7 Days', statLabel: 'Avg. End-to-End' },
  { icon: Award, title: 'RERA Verified Listings Only', desc: 'We only list RERA-registered projects. Every project is vetted for legal compliance, builder credibility, and construction status.', stat: '100%', statLabel: 'RERA Compliant' },
  { icon: Headphones, title: '7-Day Support', desc: 'Real estate decisions don\'t wait for business hours. Our advisors are available 7 days a week, including public holidays.', stat: '7 Days', statLabel: 'Support Availability' },
]

const COMPARISON = [
  { feature: 'Price Guarantee',     us: true,  others: false },
  { feature: 'RERA Verification',   us: true,  others: 'Partial' },
  { feature: 'Zero Brokerage',      us: true,  others: false },
  { feature: 'Dedicated RM',        us: true,  others: false },
  { feature: 'Loan Assistance',     us: true,  others: 'Extra Charge' },
  { feature: 'Post-Purchase Support',us:true,  others: false },
  { feature: 'WhatsApp Updates',    us: true,  others: false },
  { feature: 'Transparent Fees',    us: true,  others: false },
]

export default function WhyUsPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-navy py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-40" />
        <div className="container-site relative z-10 text-center">
          <p className="section-label mb-3">Our Promise</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-5 leading-tight">
            Why 1,200+ Families<br />Choose DigiSoft Nexus
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            We built this company because we were tired of how Indian real estate worked. Here's what we do differently.
          </p>
        </div>
      </section>

      {/* USPs */}
      <section className="section bg-warm-white">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {USPS.map((usp, i) => (
              <div key={usp.title} className="card p-6 group hover:shadow-luxury-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-navy/6 flex items-center justify-center shrink-0 group-hover:bg-navy transition-colors">
                    <usp.icon className="w-5 h-5 text-navy group-hover:text-gold transition-colors" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-xl font-semibold text-navy">{usp.stat}</span>
                      <span className="text-xs text-mid-grey">{usp.statLabel}</span>
                    </div>
                  </div>
                </div>
                <h3 className="font-syne font-semibold text-base text-navy mb-2">{usp.title}</h3>
                <p className="text-sm text-dark-grey leading-relaxed">{usp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="section bg-cream">
        <div className="container-site max-w-3xl">
          <div className="text-center mb-10">
            <p className="section-label mb-2">Honest Comparison</p>
            <h2 className="section-title">DigiSoft vs. Typical Real Estate Agents</h2>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy/8">
                  <th className="text-left px-5 py-4 font-syne text-xs font-semibold text-mid-grey uppercase tracking-wide w-1/2">Feature</th>
                  <th className="text-center px-4 py-4 font-syne text-xs font-semibold text-navy uppercase tracking-wide bg-navy/3">DigiSoft Nexus</th>
                  <th className="text-center px-4 py-4 font-syne text-xs font-semibold text-mid-grey uppercase tracking-wide">Others</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-navy/6 last:border-0 ${i % 2 === 0 ? '' : 'bg-navy/2'}`}>
                    <td className="px-5 py-3.5 font-medium text-dark-grey">{row.feature}</td>
                    <td className="px-4 py-3.5 text-center bg-navy/3">
                      {row.us === true
                        ? <CheckCircle className="w-5 h-5 text-success mx-auto" />
                        : <span className="text-xs font-medium text-dark-grey">{row.us}</span>
                      }
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {row.others === false
                        ? <span className="text-mid-grey text-lg">✗</span>
                        : <span className="text-xs text-mid-grey">{row.others}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-sm bg-navy">
        <div className="container-site text-center">
          <h2 className="font-display text-3xl text-white font-semibold mb-4">Ready to Experience the Difference?</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="btn btn-gold">Book Free Consultation</Link>
            <Link href="/testimonials" className="btn btn-outline-gold gap-2">
              Read Client Stories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
