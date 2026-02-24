'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search, Filter, Download, UserPlus, ChevronDown,
  Phone, MessageCircle, ArrowUpDown, SlidersHorizontal,
} from 'lucide-react'
import {
  LEADS, AGENTS, statusColor, statusLabel, getAgentName,
  type Lead, type LeadStatus, type LeadSource,
} from '@/lib/mockData'

const ALL_STATUSES: LeadStatus[] = ['new', 'contacted', 'site-visit', 'negotiation', 'closed-won', 'closed-lost']
const ALL_SOURCES: LeadSource[] = ['google-ads', 'meta-ads', 'organic', 'referral', 'campaign', 'microsite', 'exit-intent', 'scroll-popup', 'whatsapp', 'walk-in']

function ScorePill({ score }: { score: number }) {
  const color = score >= 75 ? 'bg-green-100 text-green-700' : score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
  return <span className={`badge ${color}`}>{score}</span>
}

function ProfileStageBar({ stage }: { stage: 1 | 2 | 3 | 4 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className={`h-1.5 w-4 rounded-full ${s <= stage ? 'bg-[#0A1628]' : 'bg-gray-200'}`} />
      ))}
    </div>
  )
}

export default function LeadsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all')
  const [agentFilter, setAgentFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'score' | 'createdAt' | 'updatedAt'>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let leads = [...LEADS]

    if (search.trim()) {
      const q = search.toLowerCase()
      leads = leads.filter((l) =>
        `${l.firstName} ${l.lastName}`.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.email ?? '').toLowerCase().includes(q) ||
        (l.propertyInterest ?? '').toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'all') leads = leads.filter((l) => l.status === statusFilter)
    if (sourceFilter !== 'all') leads = leads.filter((l) => l.source === sourceFilter)
    if (agentFilter !== 'all') leads = leads.filter((l) => l.assignedAgent === agentFilter)

    leads.sort((a, b) => {
      let av: number | string = sortBy === 'score' ? a.score : a[sortBy]
      let bv: number | string = sortBy === 'score' ? b.score : b[sortBy]
      if (sortDir === 'asc') return av < bv ? -1 : 1
      return av > bv ? -1 : 1
    })

    return leads
  }, [search, statusFilter, sourceFilter, agentFilter, sortBy, sortDir])

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortBy(field); setSortDir('desc') }
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map((l) => l.id)))
  }

  const handleExport = () => {
    const rows = filtered.map((l) => [
      l.id, l.firstName, l.lastName, l.phone, l.email ?? '',
      l.status, l.source, l.budget ?? '', l.score,
      getAgentName(l.assignedAgent), l.createdAt,
    ])
    const csv = [
      'ID,First,Last,Phone,Email,Status,Source,Budget,Score,Agent,Created',
      ...rows.map((r) => r.join(',')),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'leads-export.csv'; a.click()
  }

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} leads{statusFilter !== 'all' ? ` · ${statusFilter}` : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs text-gray-500">{selected.size} selected</span>
              <select className="select-admin py-1.5 text-xs w-36">
                <option value="">Assign to agent…</option>
                {AGENTS.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <button className="btn-secondary-admin text-xs py-1.5">Assign</button>
            </div>
          )}
          <button onClick={handleExport} className="btn-secondary-admin text-xs gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button className="btn-primary-admin text-xs gap-1.5">
            <UserPlus className="w-3.5 h-3.5" /> Add Lead
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="content-card p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, phone, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-admin pl-9 text-sm"
            />
          </div>

          {/* Status pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['all', ...ALL_STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-xs font-medium px-3 py-1 rounded-full transition-all ${
                  statusFilter === s
                    ? 'bg-[#0A1628] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s === 'all' ? 'All' : statusLabel(s)}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters((f) => !f)}
            className={`btn-secondary-admin text-xs gap-1.5 ${showFilters ? 'bg-[#0A1628] text-white border-[#0A1628]' : ''}`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="flex-1">
              <label className="label-admin">Source</label>
              <select className="select-admin" value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value as any)}>
                <option value="all">All Sources</option>
                {ALL_SOURCES.map((s) => <option key={s} value={s}>{s.replace(/-/g, ' ')}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="label-admin">Assigned Agent</label>
              <select className="select-admin" value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)}>
                <option value="all">All Agents</option>
                <option value="unassigned">Unassigned</option>
                {AGENTS.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="label-admin">Sort By</label>
              <select className="select-admin" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                <option value="createdAt">Created Date</option>
                <option value="updatedAt">Last Updated</option>
                <option value="score">Lead Score</option>
              </select>
            </div>
            <div className="pt-5">
              <button
                onClick={() => { setSearch(''); setStatusFilter('all'); setSourceFilter('all'); setAgentFilter('all') }}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="content-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-admin">
            <thead>
              <tr>
                <th className="w-10">
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded" />
                </th>
                <th>Lead</th>
                <th>Status</th>
                <th>Source</th>
                <th>Interest</th>
                <th>Agent</th>
                <th className="cursor-pointer" onClick={() => toggleSort('score')}>
                  <span className="flex items-center gap-1">Score <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th>Profile</th>
                <th className="cursor-pointer" onClick={() => toggleSort('createdAt')}>
                  <span className="flex items-center gap-1">Created <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-gray-400 text-sm">
                    No leads match your filters
                  </td>
                </tr>
              ) : filtered.map((lead) => (
                <tr key={lead.id} className={selected.has(lead.id) ? 'bg-blue-50' : ''}>
                  <td>
                    <input type="checkbox" checked={selected.has(lead.id)} onChange={() => toggleSelect(lead.id)} className="rounded" />
                  </td>
                  <td>
                    <div>
                      <Link href={`/dashboard/leads/${lead.id}`} className="font-semibold text-gray-900 hover:text-[#0A1628]">
                        {lead.firstName} {lead.lastName}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">{lead.phone}</p>
                      {lead.email && <p className="text-[11px] text-gray-400">{lead.email}</p>}
                    </div>
                  </td>
                  <td>
                    <span className={statusColor(lead.status)}>{statusLabel(lead.status)}</span>
                  </td>
                  <td>
                    <span className="text-xs text-gray-600 capitalize">{lead.source.replace(/-/g, ' ')}</span>
                    {lead.utmCampaign && <p className="text-[10px] text-gray-400">{lead.utmCampaign}</p>}
                  </td>
                  <td>
                    <p className="text-xs text-gray-700 max-w-[140px] truncate">{lead.propertyInterest ?? '—'}</p>
                    {lead.budget && <p className="text-[11px] text-gray-400">{lead.budget}</p>}
                  </td>
                  <td>
                    <span className="text-xs text-gray-600">{getAgentName(lead.assignedAgent)}</span>
                  </td>
                  <td><ScorePill score={lead.score} /></td>
                  <td><ProfileStageBar stage={lead.profileStage} /></td>
                  <td>
                    <p className="text-xs text-gray-500">{new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                    {lead.lastContactedAt && (
                      <p className="text-[10px] text-gray-400">
                        Last: {new Date(lead.lastContactedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </p>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <a href={`tel:${lead.phone}`}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-[#0A1628] hover:text-white flex items-center justify-center transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank"
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-green-500 hover:text-white flex items-center justify-center transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                      <Link href={`/dashboard/leads/${lead.id}`}
                        className="text-[11px] text-[#0A1628] font-semibold hover:underline whitespace-nowrap">
                        View →
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">Showing {filtered.length} of {LEADS.length} leads</p>
          <div className="flex items-center gap-1">
            {/* Pagination placeholder — would be server-side in prod */}
            {[1, 2, 3].map((p) => (
              <button key={p} className={`w-7 h-7 rounded text-xs font-medium ${p === 1 ? 'bg-[#0A1628] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
