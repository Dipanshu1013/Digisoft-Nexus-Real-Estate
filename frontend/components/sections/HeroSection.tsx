'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, MapPin, ChevronDown, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const heroStats = [
  { value: '500+', label: 'Premium Properties' },
  { value: '₹50Cr+', label: 'Deals Closed' },
  { value: '1,200+', label: 'Happy Families' },
  { value: '10+', label: 'Years Experience' },
]

const quickSearchLinks = [
  { label: 'Godrej Properties', href: '/projects/godrej-properties' },
  { label: 'DLF Gurugram', href: '/projects/dlf' },
  { label: 'Luxury Apartments', href: '/luxury' },
  { label: '₹50L - ₹1Cr Homes', href: '/affordable' },
  { label: 'Pre-Launch 2026', href: '/pre-launch' },
]

export default function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('gurugram')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (location) params.set('city', location)
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-navy">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80')`,
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/50" />
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
      </div>

      {/* Floating gold accent */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full bg-gold/8 blur-2xl pointer-events-none" />

      <div className="container-site relative z-10 py-16 md:py-24">
        <div className="max-w-3xl">

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 rounded-full px-4 py-1.5 mb-7"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="font-syne text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Trusted Real Estate Advisor — Gurugram & Delhi NCR
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-hero text-white leading-tight mb-6"
          >
            Find Your{' '}
            <span className="italic text-gold-gradient font-semibold">
              Dream Home
            </span>
            {' '}in Gurugram
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/65 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
          >
            Premium properties by Godrej, DLF, and M3M — curated by experts, 
            delivered with zero brokerage hassle. Get personal guidance today.
          </motion.p>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSearch}
            className="bg-white rounded-xl2 shadow-luxury-lg p-2 flex flex-col sm:flex-row gap-2 mb-6"
          >
            {/* Location select */}
            <div className="flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-navy/10 sm:min-w-[150px]">
              <MapPin className="w-4 h-4 text-gold shrink-0" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent text-sm text-navy font-medium outline-none w-full cursor-pointer"
              >
                <option value="gurugram">Gurugram</option>
                <option value="delhi-ncr">Delhi NCR</option>
                <option value="noida">Noida</option>
                <option value="all">All Cities</option>
              </select>
            </div>

            {/* Search input */}
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-4 h-4 text-mid-grey shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by project, developer, or locality..."
                className="flex-1 bg-transparent text-sm text-navy placeholder-mid-grey outline-none py-2"
              />
            </div>

            <button type="submit" className="btn btn-gold px-6">
              Search
            </button>
          </motion.form>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-2"
          >
            <span className="text-white/40 text-xs font-syne uppercase tracking-wider self-center mr-1">
              Popular:
            </span>
            {quickSearchLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-1.5 rounded-full bg-white/8 border border-white/15 text-white/70 hover:text-white hover:border-white/30 text-xs font-medium transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14 max-w-2xl"
        >
          {heroStats.map((stat, i) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-center backdrop-blur-sm"
            >
              <div className="font-display text-2xl md:text-3xl font-semibold text-gold mb-1">
                {stat.value}
              </div>
              <div className="font-syne text-xs uppercase tracking-wider text-white/45">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
      >
        <span className="font-syne text-[10px] uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  )
}
