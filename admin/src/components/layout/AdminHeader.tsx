'use client'
import { useState } from 'react'
import { Search, Bell, Plus, RefreshCw } from 'lucide-react'

interface AdminHeaderProps {
  title: string
  subtitle?: string
  action?: { label: string; onClick: () => void; icon?: React.ReactNode }
}

export default function AdminHeader({ title, subtitle, action }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="h-14 bg-white border-b border-gray-100 px-6 flex items-center gap-4 shrink-0">
      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-gray-900 truncate">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 truncate">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className="relative w-56 hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search leads, properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:bg-white transition-all"
        />
      </div>

      {/* Refresh */}
      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500" aria-label="Refresh">
        <RefreshCw className="w-3.5 h-3.5" />
      </button>

      {/* Notifications */}
      <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500" aria-label="Notifications">
        <Bell className="w-3.5 h-3.5" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
      </button>

      {/* Action CTA */}
      {action && (
        <button onClick={action.onClick} className="btn-primary-admin text-xs gap-1.5 h-8">
          {action.icon ?? <Plus className="w-3.5 h-3.5" />}
          {action.label}
        </button>
      )}
    </header>
  )
}
