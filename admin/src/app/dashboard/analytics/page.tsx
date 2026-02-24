'use client'
import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, FunnelChart, Funnel, LabelList, PieChart, Pie, Cell,
} from 'recharts'
import { TrendingUp, ArrowUp, ArrowDown, Users, Target, IndianRupee, Download } from 'lucide-react'
import { ANALYTICS, AGENTS, formatINR } from '@/lib/mockData'

const COLORS = ['#0A1628', '#D4AF37', '#64748b', '#10b981', '#f59e0b', '#6366f1']

function KPICard({ label, value, sub, trend, trendPct, icon: Icon, color = 'blue' }: {
  label: string; value: string | number; sub: string; trend?: 'up' | 'down'; trendPct?: number;
  icon: any; color?: string
}) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-[11px] text-gray-400 mt-1">{sub}</p>
        </div>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
          color === 'gold' ? 'bg-[#D4AF37]/10' : 'bg-[#0A1628]/8'
        }`}>
          <Icon className={`w-4.5 h-4.5 ${color === 'gold' ? 'text-[#D4AF37]' : 'text-[#0A1628]'}`} />
        </div>
      </div>
      {trend && trendPct !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-[11px] font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
          {trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {trendPct}% vs last week
        </div>
      )}
    </div>
  )
}

// Custom Funnel Chart (Recharts FunnelChart is tricky; using custom bars)
function ConversionFunnel() {
  const data = ANALYTICS.funnel
  const max = data[0].count

  return (
    <div className="space-y-2">
      {data.map((row, i) => {
        const width = (row.count / max) * 100
        const dropoff = i > 0 ? (((data[i - 1].count - row.count) / data[i - 1].count) * 100).toFixed(0) : null
        return (
          <div key={row.stage}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-gray-700">{row.stage}</span>
              <div className="flex items-center gap-3">
                {dropoff && <span className="text-red-400 text-[10px]">-{dropoff}%</span>}
                <span className="font-bold text-gray-900">{row.count.toLocaleString()}</span>
                <span className="text-gray-400 w-10 text-right">{row.pct}%</span>
              </div>
            </div>
            <div className="h-7 bg-gray-100 rounded-lg overflow-hidden">
              <div
                className="h-full rounded-lg transition-all flex items-center pl-3"
                style={{
                  width: `${width}%`,
                  background: `linear-gradient(90deg, #0A1628 0%, #162340 100%)`,
                }}
              >
                {width > 20 && <span className="text-white text-[10px] font-semibold">{row.stage}</span>}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d')
  const kpi = ANALYTICS.kpi

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Conversion funnel, source attribution, and team performance</p>
        </div>
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all ${period === p ? 'bg-[#0A1628] text-white border-[#0A1628]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
              {p === '7d' ? 'Last 7 days' : p === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
          <button className="btn-secondary-admin text-xs gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard icon={Users} label="Total Leads" value={kpi.totalLeads.toLocaleString()}
          sub={`${kpi.leadsToday} today · ${kpi.leadsThisWeek} this week`} trend="up" trendPct={18} />
        <KPICard icon={Target} label="Conversion Rate" value={`${kpi.conversionRate}%`}
          sub="Lead to site visit" trend="up" trendPct={4} />
        <KPICard icon={IndianRupee} label="Revenue (Month)" value={formatINR(kpi.revenueThisMonth)}
          sub={`${kpi.closedThisMonth} deals closed`} color="gold" trend="up" trendPct={22} icon={IndianRupee} />
        <KPICard icon={TrendingUp} label="Open Pipeline" value={kpi.openLeads}
          sub={`${kpi.sitVisitsBooked} site visits booked`} trend="up" trendPct={8} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Daily Leads Chart */}
        <div className="content-card p-5 lg:col-span-2">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Daily Lead Volume</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={ANALYTICS.dailyLeads} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A1628" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0A1628" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                formatter={(v: number) => [`${v} leads`, 'Leads']}
              />
              <Area type="monotone" dataKey="leads" stroke="#0A1628" strokeWidth={2} fill="url(#leadGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Source Pie */}
        <div className="content-card p-5">
          <h3 className="font-semibold text-gray-800 text-sm mb-4">Lead Sources</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={ANALYTICS.sourceBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="leads"
                nameKey="source"
              >
                {ANALYTICS.sourceBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v} leads`, '']} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {ANALYTICS.sourceBreakdown.map((s, i) => (
              <div key={s.source} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-gray-600 capitalize">{s.source}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">{s.pct}%</span>
                  {s.cpl > 0 && <span className="text-gray-500 text-[10px]">₹{s.cpl} CPL</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Funnel */}
      <div className="content-card p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-800 text-sm">Conversion Funnel</h3>
          <div className="text-xs text-gray-500">
            Overall: <span className="font-bold text-gray-800">{ANALYTICS.funnel[ANALYTICS.funnel.length - 1].pct}%</span> visitor-to-deal rate
          </div>
        </div>
        <ConversionFunnel />
      </div>

      {/* Source Performance Table */}
      <div className="content-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 text-sm">Source Attribution</h3>
        </div>
        <table className="table-admin">
          <thead>
            <tr>
              <th>Source</th>
              <th>Leads</th>
              <th>Share</th>
              <th>CPL</th>
              <th>CPL vs Average</th>
            </tr>
          </thead>
          <tbody>
            {ANALYTICS.sourceBreakdown.map((s, i) => {
              const avgCPL = 450
              const diff = s.cpl > 0 ? s.cpl - avgCPL : null
              return (
                <tr key={s.source}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="font-medium text-gray-700 capitalize">{s.source}</span>
                    </div>
                  </td>
                  <td><span className="font-semibold text-gray-800">{s.leads}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-[#0A1628]" style={{ width: `${s.pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{s.pct}%</span>
                    </div>
                  </td>
                  <td>
                    {s.cpl > 0 ? <span className="font-semibold text-gray-800">₹{s.cpl}</span> : <span className="text-gray-400 text-xs">Organic (free)</span>}
                  </td>
                  <td>
                    {diff !== null ? (
                      <span className={`text-xs font-semibold flex items-center gap-1 ${diff < 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {diff < 0 ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                        {Math.abs(diff)} vs avg
                      </span>
                    ) : (
                      <span className="text-green-600 text-xs font-semibold">Best ROI</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Agent Leaderboard */}
      <div className="content-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 text-sm">Agent Leaderboard</h3>
        </div>
        <table className="table-admin">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Agent</th>
              <th>Leads Assigned</th>
              <th>Converted</th>
              <th>CVR</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {[...AGENTS]
              .sort((a, b) => b.conversionRate - a.conversionRate)
              .map((agent, i) => (
                <tr key={agent.id}>
                  <td>
                    <span className={`font-black text-lg ${i === 0 ? 'text-[#D4AF37]' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-700' : 'text-gray-300'}`}>
                      #{i + 1}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#0A1628] flex items-center justify-center text-white text-xs font-bold">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-xs">{agent.name}</p>
                        <p className="text-[10px] text-gray-400 capitalize">{agent.role}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="font-medium text-gray-700">{agent.leadsAssigned}</span></td>
                  <td><span className="font-semibold text-gray-800">{agent.leadsConverted}</span></td>
                  <td>
                    <span className={`font-bold text-sm ${agent.conversionRate >= 30 ? 'text-green-600' : agent.conversionRate >= 20 ? 'text-amber-600' : 'text-gray-500'}`}>
                      {agent.conversionRate}%
                    </span>
                  </td>
                  <td>
                    <div className="w-28 bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${agent.conversionRate >= 30 ? 'bg-green-500' : agent.conversionRate >= 20 ? 'bg-amber-500' : 'bg-gray-400'}`}
                        style={{ width: `${agent.conversionRate * 2.5}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
