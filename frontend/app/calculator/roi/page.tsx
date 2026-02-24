'use client'
import { useState, useMemo } from 'react'
import SiteLayout from '@/components/layout/SiteLayout'
import { TrendingUp, IndianRupee, ArrowRight } from 'lucide-react'
import Link from 'next/link'

function formatINR(n: number) {
  if (n >= 10000000) return `₹${(n/10000000).toFixed(2)} Cr`
  if (n >= 100000)   return `₹${(n/100000).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export default function ROICalculatorPage() {
  const [purchase,     setPurchase]     = useState(10000000)  // ₹1 Cr
  const [rentalYield,  setRentalYield]  = useState(3.5)       // 3.5% pa
  const [appreciation, setAppreciation] = useState(12)        // 12% pa
  const [holding,      setHolding]      = useState(5)         // 5 years

  const result = useMemo(() => {
    const yearlyRental = purchase * (rentalYield / 100)
    const totalRental  = yearlyRental * holding
    const resaleValue  = purchase * Math.pow(1 + appreciation / 100, holding)
    const totalGain    = totalRental + (resaleValue - purchase)
    const totalROI     = (totalGain / purchase) * 100
    const annROI       = (Math.pow(1 + totalROI / 100, 1 / holding) - 1) * 100
    return {
      yearlyRental:   Math.round(yearlyRental),
      totalRental:    Math.round(totalRental),
      resaleValue:    Math.round(resaleValue),
      appreciation:   Math.round(resaleValue - purchase),
      totalGain:      Math.round(totalGain),
      totalROI:       Math.round(totalROI * 10) / 10,
      annROI:         Math.round(annROI * 10) / 10,
    }
  }, [purchase, rentalYield, appreciation, holding])

  const SliderInput = ({ label, value, min, max, step, display, onChange }: any) => (
    <div>
      <div className="flex justify-between mb-2.5">
        <label className="form-label mb-0">{label}</label>
        <span className="font-syne font-semibold text-sm text-navy bg-navy/6 px-3 py-1 rounded-lg">{display(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full h-1.5 bg-navy/15 rounded-full appearance-none cursor-pointer accent-navy" />
      <div className="flex justify-between text-[10px] text-mid-grey mt-1 font-syne">
        <span>{display(min)}</span><span>{display(max)}</span>
      </div>
    </div>
  )

  return (
    <SiteLayout>
      <section className="bg-navy py-14">
        <div className="container-site text-center">
          <p className="section-label mb-2">Investment Tools</p>
          <h1 className="font-display text-4xl md:text-5xl text-white font-semibold mb-3">ROI Calculator</h1>
          <p className="text-white/55 max-w-lg mx-auto">Estimate total returns from rental income + capital appreciation over your investment period.</p>
        </div>
      </section>

      <section className="section bg-warm-white">
        <div className="container-site max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-7 space-y-6">
              <SliderInput label="Purchase Price" value={purchase} min={2000000} max={100000000} step={500000} display={formatINR} onChange={setPurchase} />
              <SliderInput label="Expected Rental Yield (p.a.)" value={rentalYield} min={1} max={8} step={0.1} display={(v: number) => `${v.toFixed(1)}%`} onChange={setRentalYield} />
              <SliderInput label="Annual Price Appreciation" value={appreciation} min={3} max={25} step={0.5} display={(v: number) => `${v}%`} onChange={setAppreciation} />
              <SliderInput label="Holding Period" value={holding} min={1} max={15} step={1} display={(v: number) => `${v} years`} onChange={setHolding} />
            </div>

            <div className="space-y-4">
              <div className="bg-navy rounded-xl3 p-6 text-center">
                <p className="text-white/50 text-xs font-syne uppercase tracking-wider mb-1">Total ROI in {holding} years</p>
                <p className="font-display text-5xl font-semibold text-gold">{result.totalROI}%</p>
                <p className="text-white/40 text-xs mt-1">({result.annROI}% annualized)</p>
              </div>

              <div className="card p-5 space-y-3">
                {[
                  { label: 'Purchase Price', val: formatINR(purchase), color: 'bg-navy/30' },
                  { label: `Rental Income (${holding} yrs)`, val: formatINR(result.totalRental), color: 'bg-blue-400' },
                  { label: 'Capital Appreciation', val: formatINR(result.appreciation), color: 'bg-gold' },
                  { label: 'Estimated Resale Value', val: formatINR(result.resaleValue), color: 'bg-success' },
                  { label: 'Total Gain', val: formatINR(result.totalGain), color: 'bg-navy' },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between py-2 border-b border-navy/6 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-3 h-3 rounded-full ${r.color}`} />
                      <span className="text-sm text-dark-grey">{r.label}</span>
                    </div>
                    <span className="font-syne font-semibold text-sm text-navy">{r.val}</span>
                  </div>
                ))}
              </div>

              <Link href="/contact" className="btn btn-gold w-full justify-center gap-2">
                Get Investment Advice <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-[10px] text-center text-mid-grey">
                * Estimates only. Actual returns depend on market conditions, location, and timing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
