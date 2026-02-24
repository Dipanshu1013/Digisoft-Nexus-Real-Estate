import Link from 'next/link'
import { Phone, MessageCircle, ArrowRight } from 'lucide-react'

export default function HomeCTA() {
  return (
    <section className="section bg-cream">
      <div className="container-site">
        <div className="bg-navy rounded-xl4 overflow-hidden relative">
          {/* Pattern */}
          <div className="absolute inset-0 bg-hero-pattern opacity-50" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/8 rounded-full blur-3xl" />

          <div className="relative z-10 py-14 px-8 md:px-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <p className="section-label mb-3">Free Consultation</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-3 leading-tight">
                Ready to Find Your Perfect Home?
              </h2>
              <p className="text-white/55 max-w-lg leading-relaxed">
                Speak with our expert advisor — free of charge. We'll help you shortlist, negotiate, 
                and close the best deal for your budget and requirements.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="https://wa.me/919910000000"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold gap-2 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>
              <Link href="/contact" className="btn btn-outline-gold gap-2 whitespace-nowrap">
                <Phone className="w-4 h-4" />
                Book Call
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
