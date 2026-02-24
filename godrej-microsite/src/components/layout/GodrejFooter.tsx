import Link from 'next/link'
import { Phone, MessageCircle, Mail, MapPin, Instagram, Linkedin, Youtube } from 'lucide-react'
import { GODREJ_BRAND, GODREJ_PROJECTS } from '@/lib/brand'

export default function GodrejFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#1B4332] text-white/80">
      {/* Top strip */}
      <div className="border-b border-white/10">
        <div className="container-godrej py-10">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">G</span>
                </div>
                <div>
                  <p className="font-display font-semibold text-white text-sm">Godrej Properties</p>
                  <p className="text-[10px] text-white/40">Authorised Channel Partner</p>
                </div>
              </div>
              <p className="text-xs text-white/50 leading-relaxed mb-4">
                DigiSoft Nexus is an authorised channel partner for Godrej Properties in Gurugram & Delhi NCR.
              </p>
              <div className="flex gap-3">
                <a href={GODREJ_BRAND.social.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D4AF37]/20 flex items-center justify-center transition-colors">
                  <Instagram className="w-3.5 h-3.5 text-white" />
                </a>
                <a href={GODREJ_BRAND.social.linkedin} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D4AF37]/20 flex items-center justify-center transition-colors">
                  <Linkedin className="w-3.5 h-3.5 text-white" />
                </a>
                <a href={GODREJ_BRAND.social.youtube} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D4AF37]/20 flex items-center justify-center transition-colors">
                  <Youtube className="w-3.5 h-3.5 text-white" />
                </a>
              </div>
            </div>

            {/* Projects */}
            <div>
              <h4 className="font-sans font-semibold text-white text-xs uppercase tracking-wider mb-4">Our Projects</h4>
              <ul className="space-y-2">
                {GODREJ_PROJECTS.map((p) => (
                  <li key={p.id}>
                    <Link href={`/projects/${p.slug}`}
                      className="text-xs text-white/55 hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#D4AF37]/40" />
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-sans font-semibold text-white text-xs uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { label: 'About Godrej Properties', href: '/about' },
                  { label: 'VIP Pre-Launch Access', href: '/contact' },
                  { label: 'EMI Calculator', href: '/tools/emi-calculator' },
                  { label: 'RERA Information', href: '/rera' },
                  { label: 'Privacy Policy', href: '/privacy-policy' },
                  { label: 'Terms of Service', href: '/terms' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs text-white/55 hover:text-[#D4AF37] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-sans font-semibold text-white text-xs uppercase tracking-wider mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li>
                  <a href={`tel:${GODREJ_BRAND.contact.phone}`}
                    className="flex items-center gap-2 text-xs text-white/55 hover:text-[#D4AF37] transition-colors">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {GODREJ_BRAND.contact.phone}
                  </a>
                </li>
                <li>
                  <a href={`https://wa.me/${GODREJ_BRAND.contact.whatsapp}`} target="_blank"
                    className="flex items-center gap-2 text-xs text-white/55 hover:text-[#D4AF37] transition-colors">
                    <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                    WhatsApp Us
                  </a>
                </li>
                <li>
                  <a href={`mailto:${GODREJ_BRAND.contact.email}`}
                    className="flex items-center gap-2 text-xs text-white/55 hover:text-[#D4AF37] transition-colors">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {GODREJ_BRAND.contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span className="text-xs text-white/55">Golf Course Road, Gurugram, Haryana 122002</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-godrej py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-white/30">
          <p>© {year} DigiSoft Nexus. Authorised Channel Partner for Godrej Properties Limited.</p>
          <p className="text-center">
            RERA Reg: HARERA/GGM/2024/1234 · RERA Haryana:{' '}
            <a href="https://hrera.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/50">hrera.in</a>
            {' · '}Disclaimer: All prices are indicative. Subject to change without notice.
          </p>
        </div>
      </div>
    </footer>
  )
}
