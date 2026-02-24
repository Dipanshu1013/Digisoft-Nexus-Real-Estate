import {
  Users, Target, Zap, IndianRupee,
  ArrowUpRight, ArrowDownRight, MapPin, CheckCircle2, Clock,
} from 'lucide-react'
import AdminHeader from '@/components/layout/AdminHeader'
import { ANALYTICS, LEADS, CAMPAIGNS, AGENTS, statusColor, statusLabel, getAgentName, formatINR } from '@/lib/mockData'

function KPICard({ title, value, delta, deltaLabel, icon: Icon, colors, trend }: {
  title: string; value: string | number; delta?: string; deltaLabel?: string
  icon: React.ElementType; colors: string; trend?: 'up' | 'down'
}) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colors}`}>
          <Icon className="w-4 h-4" />
        </div>
        {delta && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {delta}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{title}</p>
      {deltaLabel && <p className="text-[10px] text-gray-400 mt-0.5">{deltaLabel}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const { kpi, dailyLeads, funnel, sourceBreakdown } = ANALYTICS
  const recentLeads = LEADS.slice(0, 7)
  const activeCampaigns = CAMPAIGNS.filter((c) => c.status === 'active')

  return (
    <>
      <AdminHeader title="Dashboard" subtitle={`Today — Tuesday, 24 February 2026`} />

      <div className="admin-content space-y-5">

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Leads Today" value={kpi.leadsToday} delta="+23%" deltaLabel="vs yesterday" icon={Zap} colors="bg-blue-50 text-blue-600" trend="up" />
          <KPICard title="Leads This Week" value={kpi.leadsThisWeek} delta="+11%" deltaLabel="vs last week" icon={Users} colors="bg-violet-50 text-violet-600" trend="up" />
          <KPICard title="Conversion Rate" value={`${kpi.conversionRate}%`} delta="+0.4%" deltaLabel="vs last month" icon={Target} colors="bg-emerald-50 text-emerald-600" trend="up" />
          <KPICard title="Revenue (Month)" value={formatINR(kpi.revenueThisMonth)} delta="+18%" deltaLabel="8 deals closed" icon={IndianRupee} colors="bg-amber-50 text-amber-600" trend="up" />
        </div>

        {/* Middle row */}
        <div className="grid lg:grid-cols-3 gap-4">

          {/* Daily leads chart */}
          <div className="content-card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-800">Lead Volume — Last 7 Days</h2>
              <span className="text-xs text-gray-400">{kpi.leadsThisWeek} total</span>
            </div>
            <div className="flex items-end gap-2 h-28">
              {dailyLeads.map((d) => {
                const max = Math.max(...dailyLeads.map((x) => x.leads))
                const heightPct = (d.leads / max) * 100
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] text-gray-400">{d.leads}</span>
                    <div
                      className="w-full rounded-t-md bg-[#0A1628] transition-all hover:bg-[#D4AF37]"
                      style={{ height: `${heightPct}%`, minHeight: 4 }}
                    />
                    <span className="text-[9px] text-gray-400 whitespace-nowrap">{d.date.replace('Feb ', '')}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Funnel */}
          <div className="content-card p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Conversion Funnel</h2>
            <div className="space-y-2.5">
              {funnel.map((stage, i) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">{stage.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-800">{stage.count.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-gray-400">{stage.pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${stage.pct}%`,
                        background: i === 0 ? '#0A1628' : i < 4 ? '#162340' : i < 6 ? '#D4AF37' : '#16a34a',
                        minWidth: '2px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid lg:grid-cols-3 gap-4">

          {/* Recent Leads */}
          <div className="content-card lg:col-span-2">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800">Recent Leads</h2>
              <a href="/leads" className="text-xs text-[#0A1628] font-medium hover:underline">View all</a>
            </div>
            <table className="table-admin">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Status</th>
                  <th>Interest</th>
                  <th>Score</th>
                  <th>Agent</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="cursor-pointer">
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-gray-500">
                            {lead.firstName[0]}{lead.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800">{lead.firstName} {lead.lastName}</p>
                          <p className="text-[10px] text-gray-400">{lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={statusColor(lead.status)}>{statusLabel(lead.status)}</span>
                    </td>
                    <td>
                      <span className="text-xs text-gray-600 truncate max-w-[120px] block">
                        {lead.propertyInterest ?? '—'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${lead.score}%`,
                              background: lead.score >= 70 ? '#16a34a' : lead.score >= 40 ? '#D4AF37' : '#ef4444',
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500">{lead.score}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs text-gray-600">{getAgentName(lead.assignedAgent)}</span>
                    </td>
                    <td>
                      <span className="text-[10px] text-gray-400">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Active Campaigns */}
            <div className="content-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-800">Active Campaigns</h2>
                <a href="/campaigns" className="text-xs text-[#0A1628] font-medium hover:underline">View all</a>
              </div>
              <div className="space-y-3">
                {activeCampaigns.map((c) => (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      c.platform === 'google' ? 'bg-blue-50 text-blue-700' :
                      c.platform === 'meta' ? 'bg-indigo-50 text-indigo-700' : 'bg-green-50 text-green-700'
                    }`}>
                      {c.platform === 'google' ? 'G' : c.platform === 'meta' ? 'M' : 'W'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{c.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#0A1628] rounded-full" style={{ width: `${(c.spent / c.budget) * 100}%` }} />
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0">{Math.round((c.spent / c.budget) * 100)}%</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-gray-800">{c.leads}</p>
                      <p className="text-[10px] text-gray-400">leads</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Leaderboard */}
            <div className="content-card p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">Agent Performance</h2>
              <div className="space-y-2.5">
                {AGENTS.slice(0, 4).sort((a, b) => b.conversionRate - a.conversionRate).map((agent, i) => (
                  <div key={agent.id} className="flex items-center gap-2.5">
                    <span className="text-[10px] font-bold text-gray-400 w-3">{i + 1}</span>
                    <div className="w-6 h-6 rounded-full bg-[#0A1628]/8 flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold text-[#0A1628]">
                        {agent.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{agent.name.split(' ')[0]}</p>
                      <p className="text-[10px] text-gray-400">{agent.leadsAssigned} leads</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-emerald-600">{agent.conversionRate}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Source Breakdown */}
            <div className="content-card p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">Lead Sources</h2>
              <div className="space-y-2">
                {sourceBreakdown.map((s) => (
                  <div key={s.source} className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-24 shrink-0">{s.source}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0A1628] rounded-full" style={{ width: `${s.pct}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-400 w-8 text-right">{s.leads}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
