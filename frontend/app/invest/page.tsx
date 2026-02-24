import type { Metadata } from 'next'
import SiteLayout from '@/components/layout/SiteLayout'
import Link from 'next/link'
import { TrendingUp, IndianRupee, ArrowRight, CheckCircle, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Real Estate Investment in Gurugram | ROI 15-22% | DigiSoft Nexus',
  description: 'Invest in Gurugram real estate — pre-launch properties, luxury apartments, and commercial assets with 15-22% annual ROI. Expert investment advisory for HNI and NRI buyers.',
}

const INVESTMENT_TYPES = [
  { title: 'Pre-Launch Investment', icon: '🚀', roi: '18–25% p.a.', risk: 'Medium', horizon: '3–5 years', best: 'Capital appreciation seekers', desc: 'Buy at pre-launch pricing and exit at or after possession for maximum capital gains.' },
  { title: 'Ready-to-Move Rental', icon: '🏠', roi: '3–5% yield + appreciation', risk: 'Low', horizon: 'Long-term', best: 'Steady income seekers', desc: 'Instant rental income from day 1. Lower risk than under-construction. Excellent in Gurugram corporate belt.' },
  { title: 'Commercial Office Space', icon: '🏢', roi: '6–9% rental yield', risk: 'Low-Medium', horizon: '5–10 years', best: 'HNI / Institutional investors', desc: 'Higher rental yields than residential. Long lease tenants like MNCs provide stable income.' },
  { title: 'Plot Investment', icon: '📐', roi: '10–20% p.a. appreciation', risk: 'Low', horizon: '5+ years', best: 'Land banking strategy', desc: 'DDJAY plots in Gurugram and NA plots in NCR fringe areas show strong appreciation with zero maintenance costs.' },
]

export default function InvestPage() {
  return (
    <SiteLayout>
      <section className="bg-navy py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-40" />
        <div className="container-site relative z-10">
          <p className="section-label mb-3">Investment Advisory</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">Real Estate Investment in NCR</h1>
          <p className="text-white/55 max-w-xl">Expert-guided investment strategies — pre-launch, rental yield, commercial — for HNI and NRI investors seeking 15–25% annual returns.</p>
        </div>
      </section>
      <section className="section bg-warm-white">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="section-label mb-2">Investment Options</p>
            <h2 className="section-title">Choose the Right Real Estate Strategy</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {INVESTMENT_TYPES.map(t => (
              <div key={t.title} className="card p-6 h-full">
                <div className="text-3xl mb-3">{t.icon}</div>
                <h3 className="font-syne font-semibold text-base text-navy mb-1">{t.title}</h3>
                <div className="flex flex-wrap gap-3 mb-3">
                  <span className="badge badge-gold text-[10px]">ROI: {t.roi}</span>
                  <span className="badge badge-navy text-[10px]">{t.horizon}</span>
                </div>
                <p className="text-sm text-dark-grey leading-relaxed mb-3">{t.desc}</p>
                <p className="text-xs text-mid-grey"><span className="font-semibold text-navy">Best for:</span> {t.best}</p>
              </div>
            ))}
          </div>

          {/* NRI Section */}
          <div className="bg-navy rounded-xl4 p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="section-label mb-3">NRI Investment</p>
              <h3 className="font-display text-2xl font-semibold text-white mb-3">Investing from Abroad? We Make it Seamless.</h3>
              <ul className="space-y-2.5">
                {['End-to-end service — no need to travel to India', 'POA (Power of Attorney) documentation handled', 'Repatriation of rental income guidance', 'NRI home loan from Indian banks arranged', 'Complete property management post-purchase'].map(p => (
                  <li key={p} className="flex items-start gap-2 text-sm text-white/65">
                    <CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />{p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <Link href="/calculator/roi" className="btn btn-gold w-full justify-center gap-2"><BarChart3 className="w-4 h-4" /> Calculate My ROI</Link>
              <Link href="/contact" className="btn btn-outline-gold w-full justify-center">Book Investment Consultation</Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
