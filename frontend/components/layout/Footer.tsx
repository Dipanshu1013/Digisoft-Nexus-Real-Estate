import Link from 'next/link'
import { Building2, Phone, Mail, MapPin, ArrowRight, Shield } from 'lucide-react'

const footerLinks = {
  properties: {
    label: 'Properties',
    links: [
      { label: 'Godrej Properties', href: '/projects/godrej-properties' },
      { label: 'DLF Homes', href: '/projects/dlf' },
      { label: 'M3M India', href: '/projects/m3m' },
      { label: 'Luxury Residences', href: '/luxury' },
      { label: 'Affordable Homes', href: '/affordable' },
      { label: 'Pre-Launch Projects', href: '/pre-launch' },
    ],
  },
  locations: {
    label: 'Locations',
    links: [
      { label: 'Gurugram Properties', href: '/gurugram' },
      { label: 'Delhi NCR', href: '/delhi-ncr' },
      { label: 'Noida', href: '/noida' },
      { label: 'New Launch 2026', href: '/new-launch' },
      { label: 'Commercial Spaces', href: '/commercial' },
    ],
  },
  tools: {
    label: 'Tools & Guides',
    links: [
      { label: 'EMI Calculator', href: '/calculator/emi' },
      { label: 'ROI Calculator', href: '/calculator/roi' },
      { label: 'Stamp Duty Calculator', href: '/calculator/stamp-duty' },
      { label: 'Buy Property Guide', href: '/buy' },
      { label: 'Investment Guide', href: '/invest' },
      { label: 'Blog & Insights', href: '/blog' },
    ],
  },
  company: {
    label: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Why Choose Us', href: '/why-us' },
      { label: 'Testimonials', href: '/testimonials' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
}

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="container-site py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="section-label text-gold mb-1">Stay Informed</p>
              <h3 className="font-display text-2xl font-semibold text-white">
                Get New Launch Alerts & Investment Insights
              </h3>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 md:w-72 px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:border-gold transition-colors"
              />
              <button type="submit" className="btn btn-gold whitespace-nowrap">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main links */}
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-gold" />
              </div>
              <div>
                <div className="font-display text-lg font-semibold text-white">
                  DigiSoft <span className="text-gold">Nexus</span>
                </div>
                <div className="text-[9px] font-syne uppercase tracking-widest text-white/40">
                  Real Estate
                </div>
              </div>
            </Link>
            <p className="text-white/55 text-sm leading-relaxed mb-5">
              Digisoft Nexus — Your trusted real estate advisor for premium properties in Gurugram and Delhi NCR.
            </p>
            <div className="space-y-2.5 text-sm">
              <a href="tel:+919910000000" className="flex items-center gap-2.5 text-white/55 hover:text-gold transition-colors">
                <Phone className="w-4 h-4 text-gold/70" />
                +91 99100 XXXXX
              </a>
              <a href="mailto:info@digisoftnexus.com" className="flex items-center gap-2.5 text-white/55 hover:text-gold transition-colors">
                <Mail className="w-4 h-4 text-gold/70" />
                info@digisoftnexus.com
              </a>
              <span className="flex items-start gap-2.5 text-white/55">
                <MapPin className="w-4 h-4 text-gold/70 mt-0.5 shrink-0" />
                Gurugram, Haryana, India
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-syne text-xs font-semibold uppercase tracking-widest text-gold mb-4">
                {section.label}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 hover:text-white transition-colors inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-200 opacity-0 group-hover:opacity-100">
                        <ArrowRight className="w-3 h-3" />
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="container-site py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/35">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-gold/50" />
            <span>© {new Date().getFullYear()} Digisoft Nexus OPC Private Limited. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <span className="text-white/20">|</span>
            <Link href="/terms" className="hover:text-white/70 transition-colors">Terms</Link>
            <span className="text-white/20">|</span>
            <Link href="/sitemap" className="hover:text-white/70 transition-colors">Sitemap</Link>
            <span className="text-white/20">|</span>
            <span>RERA Registered</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
