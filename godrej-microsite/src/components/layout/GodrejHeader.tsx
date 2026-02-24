'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, MessageCircle, Menu, X, ChevronDown } from 'lucide-react'
import { GODREJ_BRAND, GODREJ_PROJECTS } from '@/lib/brand'

export default function GodrejHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container-godrej">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] flex items-center justify-center">
              <span className="text-white font-bold text-xs">G</span>
            </div>
            <div>
              <p className={`font-display font-semibold text-sm leading-none ${scrolled ? 'text-[#1A2E25]' : 'text-white'}`}>
                Godrej Properties
              </p>
              <p className={`text-[9px] font-sans font-medium leading-none mt-0.5 ${scrolled ? 'text-[#4A7260]' : 'text-white/60'}`}>
                by DigiSoft Nexus
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Projects dropdown */}
            <div className="relative" onMouseEnter={() => setProjectsOpen(true)} onMouseLeave={() => setProjectsOpen(false)}>
              <button className={`flex items-center gap-1 text-sm font-sans font-medium transition-colors ${scrolled ? 'text-[#1A2E25] hover:text-[#2D6A4F]' : 'text-white/90 hover:text-white'}`}>
                Projects <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {projectsOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#2D6A4F]/8 overflow-hidden z-10">
                  {GODREJ_PROJECTS.map((p) => (
                    <Link
                      key={p.id}
                      href={`/projects/${p.slug}`}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-[#F8FBF9] transition-colors group"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]/40 group-hover:bg-[#2D6A4F] mt-1.5 shrink-0 transition-colors" />
                      <div>
                        <p className="font-sans font-semibold text-[#1A2E25] text-xs">{p.name}</p>
                        <p className="text-[10px] text-[#4A7260]">{p.location}</p>
                        <span className={`text-[9px] font-semibold mt-0.5 inline-block ${
                          p.status === 'pre-launch' ? 'text-amber-700' :
                          p.status === 'under-construction' ? 'text-[#2D6A4F]' : 'text-gray-500'
                        }`}>
                          {p.status === 'pre-launch' ? '🔴 Pre-Launch' :
                           p.status === 'under-construction' ? '🟢 Under Construction' : '✅ Ready'}
                        </span>
                      </div>
                    </Link>
                  ))}
                  <div className="border-t border-[#2D6A4F]/8 p-3">
                    <Link href="/projects" className="text-[11px] font-semibold text-[#2D6A4F] hover:underline">
                      View all projects →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {[
              { label: 'Developer', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-sans font-medium transition-colors ${
                  scrolled ? 'text-[#1A2E25] hover:text-[#2D6A4F]' : 'text-white/90 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${GODREJ_BRAND.contact.phone}`}
              className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                scrolled ? 'text-[#2D6A4F]' : 'text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              {GODREJ_BRAND.contact.phone.replace('+91', '+91 ')}
            </a>
            <Link href="/contact" className="btn-godrej-gold text-xs px-4 py-2">
              Get VIP Pricing
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className={`w-5 h-5 ${scrolled ? 'text-[#1A2E25]' : 'text-white'}`} />
            ) : (
              <Menu className={`w-5 h-5 ${scrolled ? 'text-[#1A2E25]' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#2D6A4F]/8 px-4 py-4 space-y-2">
          {GODREJ_PROJECTS.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.slug}`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-2.5 text-sm font-sans font-medium text-[#1A2E25]"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
              {p.name}
            </Link>
          ))}
          <div className="border-t border-[#2D6A4F]/8 pt-3 flex flex-col gap-2">
            <Link href="/about" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium text-[#1A2E25]">Developer</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="btn-godrej-gold text-center text-sm">Get VIP Pricing</Link>
          </div>
        </div>
      )}
    </header>
  )
}
