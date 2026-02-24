'use client'
import { useState, useMemo } from 'react'
import SiteLayout from '@/components/layout/SiteLayout'
import { Calculator, TrendingUp, IndianRupee } from 'lucide-react'
import Link from 'next/link'

function formatINR(n: number) {
  if (n >= 10000000) return `₹${(n/10000000).toFixed(2)} Cr`
  if (n >= 100000)   return `₹${(n/100000).toFixed(2)} L`
  return `₹${n.toLocaleString('en-IN')}`
}

export default function EMICalculatorPage() {
  const [loan, setLoan]     = useState(5000000)   // ₹50L
  const [rate, setRate]     = useState(8.5)        // 8.5%
  const [tenure, setTenure] = useState(20)         // 20 years

  const result = useMemo(() => {
    const r = rate / 12 / 100
    const n = tenure * 12
    if (r === 0) return { emi: loan / n, totalPayable: loan, totalInterest: 0 }
    const emi = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPayable = emi * n
    const totalInterest = totalPayable - loan
    return { emi: Math.round(emi), totalPayable: Math.round(totalPayable), totalInterest: Math.round(totalInterest) }
  }, [loan, rate, tenure])

  const principalPct = Math.round((loan / result.totalPayable) * 100)

  return (
    <SiteLayout>
      {/* Header */}
      <section className="bg-navy py-14">
        <div className="container-site text-center">
          <p className="section-label mb-3">Financial Tools</p>
          <h1 className="font-display text-4xl md:text-5xl text-white font-semibold mb-3">EMI Calculator</h1>
          <p className="text-white/55 max-w-lg mx-auto">Calculate your monthly home loan EMI, total interest payable, and see a year-wise payment breakdown.</p>
        </div>
      </section>

      <section className="section bg-warm-white">
        <div className="container-site max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Inputs */}
            <div className="card p-7 space-y-6">
              <SliderInput
                label="Loan Amount"
                value={loan}
                min={500000} max={50000000} step={100000}
                displayFn={formatINR}
                onChange={setLoan}
              />
              <SliderInput
                label="Interest Rate (% per annum)"
                value={rate}
                min={6} max={15} step={0.1}
                displayFn={v => `${v.toFixed(1)}%`}
                onChange={setRate}
              />
              <SliderInput
                label="Loan Tenure"
                value={tenure}
                min={1} max={30} step={1}
                displayFn={v => `${v} years`}
                onChange={setTenure}
              />
            </div>

            {/* Results */}
            <div className="space-y-4">
              {/* EMI display */}
              <div className="bg-navy rounded-xl3 p-6 text-center">
                <p className="text-white/50 text-xs font-syne uppercase tracking-wider mb-2">Monthly EMI</p>
                <p className="font-display text-5xl font-semibold text-gold">{formatINR(result.emi)}</p>
                <p className="text-white/40 text-xs mt-2">per month for {tenure} years</p>
              </div>

              {/* Breakdown */}
              <div className="card p-5 space-y-3">
                {[
                  { label: 'Loan Amount', value: formatINR(loan), color: 'bg-navy' },
                  { label: 'Total Interest', value: formatINR(result.totalInterest), color: 'bg-gold' },
                  { label: 'Total Payable', value: formatINR(result.totalPayable), color: 'bg-dark-grey' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b border-navy/6 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-3 h-3 rounded-full ${row.color}`} />
                      <span className="text-sm text-dark-grey">{row.label}</span>
                    </div>
                    <span className="font-syne font-semibold text-sm text-navy">{row.value}</span>
                  </div>
                ))}

                {/* Visual ratio bar */}
                <div className="mt-3">
                  <div className="flex h-3 rounded-full overflow-hidden">
                    <div className="bg-navy transition-all duration-500" style={{ width: `${principalPct}%` }} />
                    <div className="bg-gold flex-1" />
                  </div>
                  <div className="flex justify-between text-[10px] text-mid-grey mt-1.5 font-syne">
                    <span>Principal {principalPct}%</span>
                    <span>Interest {100-principalPct}%</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Link href="/contact" className="btn btn-gold w-full justify-center">
                Get Home Loan Assistance →
              </Link>
            </div>
          </div>

          {/* Related tools */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/calculator/roi" className="card p-5 flex items-center gap-4 hover:shadow-luxury-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-gold-600" /></div>
              <div><p className="font-syne font-semibold text-sm text-navy">ROI Calculator</p><p className="text-xs text-dark-grey">Estimate your investment returns</p></div>
            </Link>
            <Link href="/calculator/stamp-duty" className="card p-5 flex items-center gap-4 hover:shadow-luxury-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Calculator className="w-5 h-5 text-blue-700" /></div>
              <div><p className="font-syne font-semibold text-sm text-navy">Stamp Duty Calculator</p><p className="text-xs text-dark-grey">State-wise registration charges</p></div>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}

function SliderInput({ label, value, min, max, step, displayFn, onChange }: {
  label: string; value: number; min: number; max: number; step: number
  displayFn: (v: number) => string; onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <label className="form-label mb-0">{label}</label>
        <span className="font-syne font-semibold text-sm text-navy bg-navy/5 px-3 py-1 rounded-lg">
          {displayFn(value)}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-navy/15 rounded-full appearance-none cursor-pointer accent-navy"
      />
      <div className="flex justify-between text-[10px] text-mid-grey mt-1 font-syne">
        <span>{displayFn(min)}</span>
        <span>{displayFn(max)}</span>
      </div>
    </div>
  )
}
