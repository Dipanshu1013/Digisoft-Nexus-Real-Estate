'use client'
import { useState } from 'react'
import {
  Plus, Search, Edit2, Archive, Eye, ExternalLink,
  CheckCircle, AlertTriangle, Building2, BarChart2,
} from 'lucide-react'
import { PROPERTIES_ADMIN, type PropertyAdmin } from '@/lib/mockData'

const DEVELOPER_COLORS = {
  godrej: 'bg-green-50 text-green-700',
  dlf:    'bg-blue-50 text-blue-700',
  m3m:    'bg-gray-100 text-gray-700',
  other:  'bg-purple-50 text-purple-700',
}

const DEVELOPER_LABELS = {
  godrej: 'Godrej',
  dlf:    'DLF',
  m3m:    'M3M',
  other:  'Other',
}

function StatusBadge({ status }: { status: PropertyAdmin['status'] }) {
  return (
    <span className={`badge ${
      status === 'active' ? 'bg-green-50 text-green-700' :
      status === 'sold-out' ? 'bg-red-50 text-red-600' :
      'bg-gray-100 text-gray-500'
    }`}>
      {status === 'active' ? '● Active' : status === 'sold-out' ? '● Sold Out' : '● Archived'}
    </span>
  )
}

interface EditModalProps {
  property: PropertyAdmin | null
  onClose: () => void
}

function EditModal({ property, onClose }: EditModalProps) {
  if (!property) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-900">Edit Property</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg">&times;</button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="label-admin">Title</label>
            <input type="text" defaultValue={property.title} className="input-admin" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-admin">Developer</label>
              <select defaultValue={property.developer} className="select-admin">
                <option value="godrej">Godrej</option>
                <option value="dlf">DLF</option>
                <option value="m3m">M3M</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label-admin">Status</label>
              <select defaultValue={property.status} className="select-admin">
                <option value="active">Active</option>
                <option value="sold-out">Sold Out</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-admin">RERA Number</label>
            <input type="text" defaultValue={property.reraNumber} className="input-admin font-mono" />
          </div>
          <div>
            <label className="label-admin">Location</label>
            <input type="text" defaultValue={property.location} className="input-admin" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-admin">Price Min (₹L)</label>
              <input type="number" defaultValue={property.priceMin} className="input-admin" />
            </div>
            <div>
              <label className="label-admin">Price Max (₹L)</label>
              <input type="number" defaultValue={property.priceMax} className="input-admin" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="btn-secondary-admin text-xs">Cancel</button>
          <button onClick={onClose} className="btn-primary-admin text-xs">Save Changes</button>
        </div>
      </div>
    </div>
  )
}

export default function PropertiesPage() {
  const [search, setSearch] = useState('')
  const [devFilter, setDevFilter] = useState<PropertyAdmin['developer'] | 'all'>('all')
  const [properties, setProperties] = useState(PROPERTIES_ADMIN)
  const [editing, setEditing] = useState<PropertyAdmin | null>(null)

  const filtered = properties.filter((p) => {
    const q = search.toLowerCase()
    const matchSearch = !search || p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
    const matchDev = devFilter === 'all' || p.developer === devFilter
    return matchSearch && matchDev
  })

  const archive = (id: string) => {
    setProperties((prev) => prev.map((p) => p.id === id ? { ...p, status: 'archived' as const } : p))
  }

  const totalLeads = properties.reduce((s, p) => s + p.leads, 0)
  const totalViews = properties.reduce((s, p) => s + p.views, 0)

  return (
    <div className="space-y-5">
      {editing && <EditModal property={editing} onClose={() => setEditing(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Properties</h1>
          <p className="text-sm text-gray-500 mt-0.5">{properties.filter((p) => p.status === 'active').length} active listings</p>
        </div>
        <button className="btn-primary-admin text-xs gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Property
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active Listings', value: properties.filter((p) => p.status === 'active').length, icon: Building2 },
          { label: 'Total Leads', value: totalLeads.toLocaleString(), icon: BarChart2 },
          { label: 'Total Views', value: totalViews.toLocaleString(), icon: Eye },
          { label: 'Avg CPV', value: `₹${Math.round(40000 / totalViews * 1000)}`, icon: CheckCircle },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="stat-card flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0A1628]/8 flex items-center justify-center">
              <Icon className="w-4 h-4 text-[#0A1628]" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500">{label}</p>
              <p className="text-lg font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="content-card p-4 flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search properties…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-admin pl-9 text-sm w-56"
          />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'godrej', 'dlf', 'm3m'] as const).map((d) => (
            <button key={d} onClick={() => setDevFilter(d)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${
                devFilter === d ? 'bg-[#0A1628] text-white border-[#0A1628]' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}>
              {d === 'all' ? 'All' : DEVELOPER_LABELS[d]}
            </button>
          ))}
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className={`content-card overflow-hidden ${p.status === 'archived' ? 'opacity-50' : ''}`}>
            {/* Top bar */}
            <div className={`h-1.5 ${p.developer === 'godrej' ? 'bg-green-500' : p.developer === 'dlf' ? 'bg-blue-600' : 'bg-gray-800'}`} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge text-[10px] ${DEVELOPER_COLORS[p.developer]}`}>
                      {DEVELOPER_LABELS[p.developer]}
                    </span>
                    <StatusBadge status={p.status} />
                  </div>
                  <h3 className="font-semibold text-gray-900">{p.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{p.location}</p>
                </div>
              </div>

              {/* Price range */}
              <p className="text-lg font-bold text-[#0A1628] mb-3">
                ₹{p.priceMin}L – ₹{p.priceMax < 100 ? `${p.priceMax}L` : `${(p.priceMax / 100).toFixed(1)} Cr`}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="font-bold text-gray-900">{p.leads}</p>
                  <p className="text-[10px] text-gray-500">Leads</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="font-bold text-gray-900">{(p.views / 1000).toFixed(1)}k</p>
                  <p className="text-[10px] text-gray-500">Views</p>
                </div>
              </div>

              {/* RERA */}
              <div className="flex items-center gap-1.5 mb-4 p-2.5 bg-green-50 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                <span className="text-[10px] text-green-700 font-mono">{p.reraNumber}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditing(p)}
                  className="flex-1 btn-secondary-admin text-xs gap-1.5 justify-center"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <a
                  href={`https://digisoftnexus.com/properties/${p.slug}`}
                  target="_blank"
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                </a>
                {p.status === 'active' && (
                  <button
                    onClick={() => archive(p.id)}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RERA Compliance Note */}
      <div className="flex items-start gap-2.5 p-4 bg-amber-50 rounded-xl border border-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800">
          <p className="font-semibold mb-0.5">RERA Compliance Reminder</p>
          <p>All properties must have a valid RERA registration number before being listed. Verify at{' '}
            <a href="https://hrera.in" target="_blank" className="underline">hrera.in</a>.
            Listings without valid RERA numbers will be automatically archived after 30 days.
          </p>
        </div>
      </div>
    </div>
  )
}
