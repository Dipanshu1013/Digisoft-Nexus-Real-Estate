'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/store'
import {
  Phone, Menu, X, ChevronDown, MapPin, Building2,
  Calculator, BookOpen, Heart, Search,
} from 'lucide-react'

const navItems = [
  {
    label: 'Properties',
    href: '/properties',
    mega: [
      {
        label: 'By Developer',
        items: [
          { label: 'Godrej Properties', href: '/projects/godrej-properties' },
          { label: 'DLF Homes', href: '/projects/dlf' },
          { label: 'M3M India', href: '/projects/m3m' },
        ],
      },
      {
        label: 'By Location',
        items: [
          { label: 'Gurugram', href: '/gurugram' },
          { label: 'Delhi NCR', href: '/delhi-ncr' },
          { label: 'Noida', href: '/noida' },
        ],
      },
      {
        label: 'By Category',
        items: [
          { label: 'Luxury Residences', href: '/luxury' },
          { label: 'Affordable Homes', href: '/affordable' },
          { label: 'Commercial', href: '/commercial' },
        ],
      },
    ],
  },
  {
    label: 'New Launch',
    href: '/new-launch',
    mega: [
      {
        label: 'Hot Projects',
        items: [
          { label: 'Pre-Launch VIP', href: '/pre-launch' },
          { label: 'Under Construction', href: '/properties?status=under-construction' },
          { label: 'Ready to Move', href: '/properties?status=ready-to-move' },
        ],
      },
    ],
  },
  {
    label: 'Services',
    href: '/why-us',
    mega: [
      {
        label: 'Financial Tools',
        items: [
          { label: 'EMI Calculator', href: '/calculator/emi' },
          { label: 'ROI Calculator', href: '/calculator/roi' },
          { label: 'Stamp Duty', href: '/calculator/stamp-duty' },
        ],
      },
      {
        label: 'Guidance',
        items: [
          { label: 'Buy Guide', href: '/buy' },
          { label: 'Investment Guide', href: '/invest' },
          { label: 'Why Choose Us', href: '/why-us' },
        ],
      },
    ],
  },
  { label: 'Blog', href: '/blog', mega: null },
  { label: 'About', href: '/about', mega: null },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeMega, setActiveMega] = useState<string | null>(null)
  const { isMobileMenuOpen, setMobileMenu, savedProperties } = useUIStore()
  const megaCloseTimer = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openMega = (label: string) => {
    clearTimeout(megaCloseTimer.current)
    setActiveMega(label)
  }

  const closeMega = () => {
    megaCloseTimer.current = setTimeout(() => setActiveMega(null), 120)
  }

  return (
    <>
      {/* ===== TOP BAR ===== */}
      <div className="hidden md:block bg-navy text-white/70 text-xs py-2">
        <div className="container-site flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-gold" />
              Gurugram | Delhi NCR | Noida
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-gold" />
              +91 99100 XXXXX
            </span>
            <span>|</span>
            <span>RERA Registered Consultant</span>
          </div>
        </div>
      </div>

      {/* ===== MAIN HEADER ===== */}
      <motion.header
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-luxury border-b border-navy/5 top-0'
            : 'bg-white/90 backdrop-blur-sm md:top-8'
          }
        `}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-navy group-hover:bg-navy-700 transition-colors">
                <Building2 className="w-5 h-5 text-gold" />
              </div>
              <div>
                <span className="font-display text-xl font-semibold text-navy tracking-tight">
                  DigiSoft
                </span>
                <span className="font-display text-xl font-light text-gold tracking-tight">
                  {' '}Nexus
                </span>
                <div className="text-[9px] font-syne font-semibold uppercase tracking-widest text-mid-grey -mt-0.5">
                  Real Estate
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.mega && openMega(item.label)}
                  onMouseLeave={closeMega}
                >
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-1.5 px-4 py-2 rounded-lg
                      font-syne text-sm font-medium transition-all duration-200
                      ${activeMega === item.label
                        ? 'text-navy bg-navy/5'
                        : 'text-dark-grey hover:text-navy hover:bg-navy/5'
                      }
                    `}
                  >
                    {item.label}
                    {item.mega && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          activeMega === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </Link>

                  {/* Mega Menu */}
                  <AnimatePresence>
                    {item.mega && activeMega === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        onMouseEnter={() => openMega(item.label)}
                        onMouseLeave={closeMega}
                        className="absolute top-full left-0 mt-2 bg-white border border-navy/8 rounded-xl2 shadow-luxury-lg p-5 flex gap-8 min-w-[480px]"
                      >
                        {/* Gold accent line */}
                        <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-gold rounded-full" />
                        {item.mega.map((section) => (
                          <div key={section.label} className="flex-1">
                            <p className="font-syne text-[10px] font-semibold uppercase tracking-widest text-mid-grey mb-3">
                              {section.label}
                            </p>
                            <ul className="space-y-1">
                              {section.items.map((sub) => (
                                <li key={sub.label}>
                                  <Link
                                    href={sub.href}
                                    className="block px-3 py-2 rounded-lg text-sm text-dark-grey hover:text-navy hover:bg-navy/5 transition-colors font-medium"
                                    onClick={() => setActiveMega(null)}
                                  >
                                    {sub.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Saved */}
              <Link
                href="/dashboard"
                className="relative hidden md:flex items-center justify-center w-10 h-10 rounded-xl hover:bg-navy/5 transition-colors"
                aria-label="Saved properties"
              >
                <Heart className="w-4.5 h-4.5 text-dark-grey" />
                {savedProperties.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold text-navy text-[10px] font-bold flex items-center justify-center">
                    {savedProperties.length}
                  </span>
                )}
              </Link>

              {/* CTA */}
              <Link
                href="/contact"
                className="hidden md:inline-flex btn btn-primary btn-sm"
              >
                Get Free Consultation
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenu(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-navy/5 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen
                  ? <X className="w-5 h-5 text-navy" />
                  : <Menu className="w-5 h-5 text-navy" />
                }
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ===== MOBILE MENU ===== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenu(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto shadow-luxury-lg"
            >
              <div className="flex items-center justify-between p-5 border-b border-navy/8">
                <span className="font-display text-xl font-semibold text-navy">Menu</span>
                <button
                  onClick={() => setMobileMenu(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-navy/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenu(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-navy/5 transition-colors"
                    >
                      <span className="font-syne font-semibold text-sm text-navy">
                        {item.label}
                      </span>
                    </Link>
                    {item.mega && (
                      <div className="ml-4 mt-1 space-y-0.5">
                        {item.mega.flatMap((s) =>
                          s.items.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setMobileMenu(false)}
                              className="flex items-center px-4 py-2 text-sm text-dark-grey hover:text-navy rounded-lg hover:bg-navy/5 transition-colors"
                            >
                              {sub.label}
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              <div className="p-4 border-t border-navy/8">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenu(false)}
                  className="btn btn-gold w-full justify-center"
                >
                  Get Free Consultation
                </Link>
                <p className="text-center text-xs text-mid-grey mt-3">
                  📞 +91 99100 XXXXX
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
