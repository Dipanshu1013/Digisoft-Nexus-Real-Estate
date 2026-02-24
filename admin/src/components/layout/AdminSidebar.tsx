'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Megaphone, BarChart3,
  Building2, Settings, LogOut, Zap, ChevronRight,
} from 'lucide-react'

const NAV = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    section: 'CRM',
    items: [
      { label: 'Leads', href: '/dashboard/leads', icon: Users, badge: '19' },
      { label: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone },
    ],
  },
  {
    section: 'Content',
    items: [
      { label: 'Properties', href: '/dashboard/properties', icon: Building2 },
      { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    ],
  },
  {
    section: 'System',
    items: [
      { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="admin-sidebar scrollbar-thin">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/8 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#D4AF37] flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-[#0A1628]" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">DigiSoft Nexus</p>
            <p className="text-white/30 text-[10px] mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3">
        {NAV.map((group) => (
          <div key={group.section}>
            <p className="nav-section">{group.section}</p>
            {group.items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item mb-0.5 ${active ? 'nav-item-active' : 'nav-item-inactive'}`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {'badge' in item && item.badge && (
                    <span className="text-[10px] font-bold bg-[#D4AF37] text-[#0A1628] px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {active && <ChevronRight className="w-3 h-3 text-white/30" />}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-white/8 shrink-0">
        <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
            <span className="text-[#D4AF37] text-[10px] font-bold">PS</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">Priya Sharma</p>
            <p className="text-white/30 text-[10px] truncate">Manager</p>
          </div>
          <button className="text-white/30 hover:text-white/70 transition-colors" aria-label="Log out">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
