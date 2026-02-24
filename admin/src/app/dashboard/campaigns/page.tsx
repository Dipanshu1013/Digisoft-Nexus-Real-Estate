'use client'
import { useState } from 'react'
import {
  Plus, Copy, CheckCircle, TrendingUp, TrendingDown,
  ExternalLink, BarChart2, Zap, Pause, Play,
} from 'lucide-react'
import { CAMPAIGNS, type Campaign } from '@/lib/mockData'

// ─── UTM Builder ──────────────────────────────────────────────

function UTMBuilder() {
  const [base, setBase] = useState('https://digisoftnexus.com')
  const [page, setPage] = useState('/properties/godrej-emerald')
  const [source, setSource] = useState('google')
  const [medium, setMedium] = useState('cpc')
  const [campaign, setCampaign] = useState('')
  const [content, setContent] = useState('')
  const [copied, setCopied] = useState(false)

  const url = `${base}${page}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${encodeURIComponent(campaign)}${content ? `&utm_content=${encodeURIComponent(content)}` : ''}`

  const copy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="content-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-[#D4AF37]" />
        <h3 className="font-semibold text-gray-800 text-sm">UTM URL Builder</h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="label-admin">Base URL</label>
          <select className="select-admin" value={base} onChange={(e) => setBase(e.target.value)}>
            <option>https://digisoftnexus.com</option>
            <option>https://godrej.digisoftnexus.com</option>
            <option>https://dlf.digisoftnexus.com</option>
            <option>https://m3m.digisoftnexus.com</option>
          </select>
        </div>
        <div>
          <label className="label-admin">Landing Page</label>
          <input type="text" className="input-admin" value={page} onChange={(e) => setPage(e.target.value)}
            placeholder="/properties/godrej-emerald" />
        </div>
        <div>
          <label className="label-admin">utm_source *</label>
          <input type="text" className="input-admin" value={source} onChange={(e) => setSource(e.target.value)}
            placeholder="google, facebook, whatsapp…" />
        </div>
        <div>
          <label className="label-admin">utm_medium *</label>
          <input type="text" className="input-admin" value={medium} onChange={(e) => setMedium(e.target.value)}
            placeholder="cpc, social, email, message…" />
        </div>
        <div>
          <label className="label-admin">utm_campaign *</label>
          <input type="text" className="input-admin" value={campaign} onChange={(e) => setCampaign(e.target.value)}
            placeholder="godrej-emerald-feb26" />
        </div>
        <div>
          <label className="label-admin">utm_content (optional)</label>
          <input type="text" className="input-admin" value={content} onChange={(e) => setContent(e.target.value)}
            placeholder="banner-a, cta-button…" />
        </div>
      </div>

      {campaign && (
        <div>
          <label className="label-admin">Generated URL</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 font-mono overflow-x-auto whitespace-nowrap">
              {url}
            </div>
            <button onClick={copy} className={`btn-admin shrink-0 gap-1.5 text-xs ${copied ? 'bg-green-500 text-white' : 'btn-secondary-admin'}`}>
              {copied ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Campaign Row ─────────────────────────────────────────────

function StatusBadge({ status }: { status: Campaign['status'] }) {
  const map = {
    active:  'bg-green-50 text-green-700',
    paused:  'bg-amber-50 text-amber-700',
    ended:   'bg-gray-100 text-gray-500',
    draft:   'bg-blue-50 text-blue-600',
  }
  return <span className={`badge ${map[status]}`}>{status}</span>
}

function PlatformIcon({ platform }: { platform: Campaign['platform'] }) {
  const icons: Record<string, string> = {
    google: 'G',
    meta: 'M',
    whatsapp: 'W',
    sms: 'S',
    email: 'E',
  }
  const colors: Record<string, string> = {
    google: 'bg-red-100 text-red-700',
    meta: 'bg-blue-100 text-blue-700',
    whatsapp: 'bg-green-100 text-green-700',
    sms: 'bg-purple-100 text-purple-700',
    email: 'bg-amber-100 text-amber-700',
  }
  return (
    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-black ${colors[platform] ?? 'bg-gray-100 text-gray-600'}`}>
      {icons[platform] ?? platform.charAt(0).toUpperCase()}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(CAMPAIGNS)

  const totalSpend   = campaigns.reduce((s, c) => s + c.spent, 0)
  const totalLeads   = campaigns.reduce((s, c) => s + c.leads, 0)
  const totalConvs   = campaigns.reduce((s, c) => s + c.conversions, 0)
  const blendedCPL   = totalLeads ? Math.round(totalSpend / totalLeads) : 0
  const avgCVR       = totalLeads ? ((totalConvs / totalLeads) * 100).toFixed(1) : '0'

  const toggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'active' ? 'paused' : c.status === 'paused' ? 'active' : c.status }
          : c
      )
    )
  }

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-0.5">{campaigns.filter((c) => c.status === 'active').length} active campaigns</p>
        </div>
        <button className="btn-primary-admin text-xs gap-1.5">
          <Plus className="w-3.5 h-3.5" /> New Campaign
        </button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Spend', value: `₹${(totalSpend / 1000).toFixed(0)}k`, sub: 'this month' },
          { label: 'Total Leads', value: totalLeads.toLocaleString(), sub: 'all campaigns' },
          { label: 'Conversions', value: totalConvs, sub: 'closed deals' },
          { label: 'Blended CPL', value: `₹${blendedCPL}`, sub: 'cost per lead' },
          { label: 'Avg CVR', value: `${avgCVR}%`, sub: 'lead to deal' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="stat-card">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
            <p className="text-[11px] text-gray-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* UTM Builder */}
      <UTMBuilder />

      {/* Campaigns Table */}
      <div className="content-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 text-sm">All Campaigns</h3>
          <select className="select-admin text-xs w-32 py-1.5">
            <option>All Platforms</option>
            <option>Google</option>
            <option>Meta</option>
            <option>WhatsApp</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="table-admin">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Platform</th>
                <th>Status</th>
                <th>Budget / Spent</th>
                <th>Leads</th>
                <th>Conversions</th>
                <th>CPL</th>
                <th>CVR</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => {
                const cvr = c.leads ? ((c.conversions / c.leads) * 100).toFixed(1) : '0'
                const spendPct = Math.round((c.spent / c.budget) * 100)
                const cplGood = c.cpl < 500
                return (
                  <tr key={c.id}>
                    <td>
                      <p className="font-semibold text-gray-800 text-xs">{c.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        ?utm_source={c.utmSource}&utm_campaign={c.utmCampaign}
                      </p>
                    </td>
                    <td><PlatformIcon platform={c.platform} /></td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">₹{(c.spent / 1000).toFixed(1)}k</span>
                          <span className="text-gray-400">/ ₹{(c.budget / 1000).toFixed(0)}k</span>
                        </div>
                        <div className="w-24 bg-gray-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${spendPct >= 90 ? 'bg-red-400' : 'bg-[#0A1628]'}`}
                            style={{ width: `${Math.min(spendPct, 100)}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">{spendPct}% utilized</p>
                      </div>
                    </td>
                    <td>
                      <p className="font-semibold text-gray-800 text-sm">{c.leads}</p>
                    </td>
                    <td>
                      <p className="font-semibold text-gray-800 text-sm">{c.conversions}</p>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <span className={`font-semibold text-xs ${cplGood ? 'text-green-600' : 'text-amber-600'}`}>
                          ₹{c.cpl}
                        </span>
                        {cplGood
                          ? <TrendingDown className="w-3 h-3 text-green-500" />
                          : <TrendingUp className="w-3 h-3 text-amber-500" />
                        }
                      </div>
                    </td>
                    <td>
                      <span className={`text-xs font-semibold ${Number(cvr) >= 5 ? 'text-green-600' : Number(cvr) >= 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                        {cvr}%
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {(c.status === 'active' || c.status === 'paused') && (
                          <button onClick={() => toggleStatus(c.id)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                              c.status === 'active'
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                                : 'bg-green-50 hover:bg-green-100 text-green-600'
                            }`}>
                            {c.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          </button>
                        )}
                        <button className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                          <BarChart2 className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                        <button className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                          <ExternalLink className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* A/B Test Results */}
      <div className="content-card p-5">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">A/B Test Results (Phase 4 Integration)</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { test: 'popup-headline', varA: 'Limited Units Remaining (Urgency)', varB: 'Get Exclusive Pre-Launch Access (Value)', impressions: 1840, aConv: 62, bConv: 89, winner: 'B' },
            { test: 'lead-form-cta', varA: 'Request Callback', varB: 'Get VIP Pricing Now', impressions: 1240, aConv: 44, bConv: 71, winner: 'B' },
          ].map((test) => {
            const aRate = ((test.aConv / (test.impressions / 2)) * 100).toFixed(1)
            const bRate = ((test.bConv / (test.impressions / 2)) * 100).toFixed(1)
            const uplift = (((test.bConv - test.aConv) / test.aConv) * 100).toFixed(0)
            return (
              <div key={test.test} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-700">{test.test}</p>
                  <span className="badge bg-green-50 text-green-700">Variant {test.winner} wins</span>
                </div>
                <div className="space-y-2">
                  {[
                    { variant: 'A', label: test.varA, convs: test.aConv, rate: aRate },
                    { variant: 'B', label: test.varB, convs: test.bConv, rate: bRate },
                  ].map(({ variant, label, convs, rate }) => (
                    <div key={variant} className={`p-2.5 rounded-lg border ${test.winner === variant ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-gray-600">Variant {variant}</span>
                        <span className="text-xs font-bold text-gray-800">{rate}%</span>
                      </div>
                      <p className="text-[10px] text-gray-600 mb-1">{label}</p>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${test.winner === variant ? 'bg-green-500' : 'bg-gray-400'}`}
                          style={{ width: `${rate}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-green-700 mt-2 font-semibold">+{uplift}% uplift · {test.impressions.toLocaleString()} impressions</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
