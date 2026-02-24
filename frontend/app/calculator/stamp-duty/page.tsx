'use client'
import { useState, useMemo } from 'react'
import SiteLayout from '@/components/layout/SiteLayout'
import Link from 'next/link'
import { ArrowRight, Calculator } from 'lucide-react'

const STATES: Record<string, { stampDuty: number; registration: number; sdWomen?: number }> = {
  'Haryana':          { stampDuty: 7,   registration: 1,   sdWomen: 5 },
  'Delhi':            { stampDuty: 6,   registration: 1,   sdWomen: 4 },
  'Uttar Pradesh':    { stampDuty: 7,   registration: 1 },
  'Maharashtra':      { stampDuty: 5,   registration: 1 },
  'Karnataka':        { stampDuty: 5.6, registration: 1 },
  'Tamil Nadu':       { stampDuty: 7,   registration: 1 },
  'West Bengal':      { stampDuty: 6,   registration: 1 },
  'Rajasthan':        { stampDuty: 6,   registration: 1 },
  'Gujarat':          { stampDuty: 4.9, registration: 1 },
  'Telangana':        { stampDuty: 5,   registration: 0.5 },
  'Madhya Pradesh':   { stampDuty: 7.5, registration: 1 },
  'Punjab':           { stampDuty: 7,   registration: 1 },
}

function formatINR(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export default function StampDutyPage() {
  const [propertyValue, setPropertyValue] = useState(10000000)
  const [state, setState]     = useState('Haryana')
  const [gender, setGender]   = useState<'male' | 'female'>('male')
  const [propertyType, setPropertyType] = useState<'residential' | 'commercial'>('residential')

  const rates = STATES[state]

  const result = useMemo(() => {
    const sdRate   = gender === 'female' && rates.sdWomen != null ? rates.sdWomen : rates.stampDuty
    const regRate  = rates.registration
    // Commercial gets +1% in many states
    const effectiveSD = propertyType === 'commercial' ? sdRate + 1 : sdRate
    const stampDuty   = (propertyValue * effectiveSD) / 100
    const regFee      = (propertyValue * regRate) / 100
    const totalCharges = stampDuty + regFee
    const totalCost    = propertyValue + totalCharges
    return { stampDuty: Math.round(stampDuty), regFee: Math.round(regFee), totalCharges: Math.round(totalCharges), totalCost: Math.round(totalCost), sdRate: effectiveSD, regRate }
  }, [propertyValue, state, gender, propertyType, rates])

  return (
    <SiteLayout>
      <section className="bg-navy py-14">
        <div className="container-site text-center">
          <p className="section-label mb-2">Financial Tools</p>
          <h1 className="font-display text-4xl md:text-5xl text-white font-semibold mb-3">Stamp Duty Calculator</h1>
          <p className="text-white/55 max-w-lg mx-auto">Calculate exact stamp duty and registration charges for any state in India before you buy.</p>
        </div>
      </section>

      <section className="section bg-warm-white">
        <div className="container-site max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="card p-7 space-y-5">
              {/* State */}
              <div>
                <label className="form-label">State</label>
                <select value={state} onChange={e => setState(e.target.value)} className="form-input">
                  {Object.keys(STATES).sort().map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Property Value */}
              <div>
                <div className="flex justify-between mb-2.5">
                  <label className="form-label mb-0">Property Value</label>
                  <span className="font-syne font-semibold text-sm text-navy bg-navy/6 px-3 py-1 rounded-lg">{formatINR(propertyValue)}</span>
                </div>
                <input type="range" min={1000000} max={100000000} step={500000} value={propertyValue} onChange={e => setPropertyValue(Number(e.target.value))} className="w-full h-1.5 bg-navy/15 rounded-full appearance-none cursor-pointer accent-navy" />
                <div className="flex justify-between text-[10px] text-mid-grey mt-1 font-syne">
                  <span>₹10 L</span><span>₹10 Cr</span>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="form-label">Buyer Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['male', 'female'] as const).map(g => (
                    <button key={g} type="button" onClick={() => setGender(g)} className={`px-4 py-2.5 rounded-xl border-2 text-sm font-syne font-medium capitalize transition-all ${gender === g ? 'border-gold bg-gold/8 text-navy' : 'border-navy/12 text-dark-grey hover:border-navy/25'}`}>
                      {g === 'female' ? '👩 Female' : '👨 Male'}
                    </button>
                  ))}
                </div>
                {gender === 'female' && STATES[state].sdWomen != null && (
                  <p className="text-xs text-success mt-2 font-medium">✓ Female buyer discount applied ({STATES[state].sdWomen}% vs {STATES[state].stampDuty}%)</p>
                )}
              </div>

              {/* Property Type */}
              <div>
                <label className="form-label">Property Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['residential', 'commercial'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setPropertyType(t)} className={`px-4 py-2.5 rounded-xl border-2 text-sm font-syne font-medium capitalize transition-all ${propertyType === t ? 'border-gold bg-gold/8 text-navy' : 'border-navy/12 text-dark-grey hover:border-navy/25'}`}>
                      {t === 'residential' ? '🏠 Residential' : '🏢 Commercial'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="bg-navy rounded-xl3 p-6">
                <p className="text-white/50 text-xs font-syne uppercase tracking-wider mb-2">Total Charges</p>
                <p className="font-display text-5xl font-semibold text-gold mb-1">{formatINR(result.totalCharges)}</p>
                <p className="text-white/40 text-xs">Stamp duty ({result.sdRate}%) + Registration ({result.regRate}%)</p>
              </div>

              <div className="card p-5 space-y-3">
                {[
                  { label: 'Property Value',       val: formatINR(propertyValue),       color: 'bg-navy/30' },
                  { label: `Stamp Duty (${result.sdRate}%)`, val: formatINR(result.stampDuty), color: 'bg-gold' },
                  { label: `Registration Fee (${result.regRate}%)`, val: formatINR(result.regFee), color: 'bg-blue-400' },
                  { label: 'Total Cost (All-in)',  val: formatINR(result.totalCost),    color: 'bg-navy' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b border-navy/6 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-3 h-3 rounded-full ${row.color}`} />
                      <span className="text-sm text-dark-grey">{row.label}</span>
                    </div>
                    <span className="font-syne font-semibold text-sm text-navy">{row.val}</span>
                  </div>
                ))}
              </div>

              <div className="bg-cream rounded-xl3 p-4 text-xs text-dark-grey space-y-1.5">
                <p className="font-syne font-semibold text-navy text-xs mb-2">💡 Money-Saving Tips</p>
                <p>• In Haryana & Delhi, female buyers save 2% on stamp duty — register in a female family member's name.</p>
                <p>• Some states offer discounts for properties under ₹50L or for first-time buyers.</p>
                <p>• Stamp duty is paid at sub-registrar office; keep funds ready at possession.</p>
              </div>

              <Link href="/contact" className="btn btn-gold w-full justify-center gap-2">
                Get Home Loan + Registration Help <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* State Comparison Table */}
          <div className="mt-10">
            <h2 className="font-syne font-semibold text-base text-navy mb-4">Stamp Duty Rates Across India (2026)</h2>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-navy text-white">
                  <tr>
                    <th className="text-left px-4 py-3 font-syne text-xs font-semibold">State</th>
                    <th className="text-center px-4 py-3 font-syne text-xs font-semibold">Stamp Duty</th>
                    <th className="text-center px-4 py-3 font-syne text-xs font-semibold">Women Rate</th>
                    <th className="text-center px-4 py-3 font-syne text-xs font-semibold">Registration</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(STATES).sort().map(([st, r], i) => (
                    <tr key={st} className={i % 2 === 0 ? 'bg-cream/40' : 'bg-white'}>
                      <td className="px-4 py-3 font-medium text-navy">{st}</td>
                      <td className="px-4 py-3 text-center text-dark-grey">{r.stampDuty}%</td>
                      <td className="px-4 py-3 text-center text-success font-medium">{r.sdWomen != null ? `${r.sdWomen}%` : '—'}</td>
                      <td className="px-4 py-3 text-center text-dark-grey">{r.registration}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-mid-grey mt-3">* Rates are indicative and may change. Verify with local sub-registrar before purchase.</p>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
