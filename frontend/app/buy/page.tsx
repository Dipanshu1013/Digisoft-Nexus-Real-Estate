// buy/page.tsx
import type { Metadata } from 'next'
import SiteLayout from '@/components/layout/SiteLayout'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Buy Property in Gurugram & NCR | Complete Buyer Guide 2026',
  description: 'Ready to buy your first or next home? Complete buyer guide — how to choose a property, get a home loan, negotiate, and register safely in Gurugram NCR.',
}

const BUYING_STEPS = [
  { step: '01', title: 'Define Your Budget', desc: 'Calculate all-in cost — property price + stamp duty (7%) + registration (1%) + interiors + home loan EMI capacity. Use our EMI calculator.' },
  { step: '02', title: 'Choose the Right Location', desc: 'Prioritise connectivity to your workplace, school quality, upcoming infrastructure, and resale potential. Our advisors map this for free.' },
  { step: '03', title: 'Shortlist & Visit', desc: 'We shortlist 3-5 properties matching your criteria within 24 hours and arrange site visits at your convenience — weekends included.' },
  { step: '04', title: 'Verify RERA & Legal Docs', desc: 'Never skip legal due diligence. We verify RERA registration, title deed, encumbrance certificate, and builder credibility for every project.' },
  { step: '05', title: 'Home Loan Pre-Approval', desc: 'Get pre-approved before negotiating — it speeds up the process and gives you negotiating power. We work with 10+ banks for best rates.' },
  { step: '06', title: 'Negotiate & Book', desc: 'Our advisors negotiate on your behalf — average savings of ₹3-12 lakh vs self-negotiated prices. Booking amount is typically 2-5%.' },
  { step: '07', title: 'Documentation & Registration', desc: 'We handle all documentation — ATS, sale agreement, home loan disbursal, stamp duty payment, and sub-registrar appointment.' },
  { step: '08', title: 'Possession & Handover', desc: 'We do final punch-list inspection before possession and remain available post-handover for any snags or interior planning.' },
]

export default function BuyPage() {
  return (
    <SiteLayout>
      <section className="bg-navy py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-40" />
        <div className="container-site relative z-10">
          <p className="section-label mb-3">Buyer's Guide</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">Buy Property in Gurugram & NCR</h1>
          <p className="text-white/55 max-w-xl">Your complete guide to buying property in India — from budget planning to possession, we've got every step covered.</p>
        </div>
      </section>
      <section className="section bg-warm-white">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-12">
            <p className="section-label mb-2">Step-by-Step</p>
            <h2 className="section-title">The Complete Home Buying Process</h2>
          </div>
          <div className="space-y-4">
            {BUYING_STEPS.map((s, i) => (
              <div key={s.step} className="card p-5 flex gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center shrink-0">
                  <span className="font-syne font-bold text-sm text-gold">{s.step}</span>
                </div>
                <div>
                  <h3 className="font-syne font-semibold text-sm text-navy mb-1.5">{s.title}</h3>
                  <p className="text-sm text-dark-grey leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/properties" className="btn btn-gold gap-2">Browse Properties <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/calculator/emi" className="btn btn-outline">Calculate EMI</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
