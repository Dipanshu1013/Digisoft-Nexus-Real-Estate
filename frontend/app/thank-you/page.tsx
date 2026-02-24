import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, MessageCircle, Phone, ArrowRight, Clock, Star } from 'lucide-react'
import SiteLayout from '@/components/layout/SiteLayout'

export const metadata: Metadata = {
  title: "You're All Set! | DigiSoft Nexus",
  description: 'Thank you for your enquiry. Our expert will call you within 30 minutes.',
  robots: 'noindex, nofollow',
}

export default function ThankYouPage() {
  return (
    <SiteLayout>
      <section className="min-h-[80vh] flex items-center justify-center bg-cream py-16">
        <div className="container-site max-w-xl text-center">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h1 className="font-display text-hero-sm text-navy mb-3">You're All Set!</h1>
          <p className="text-dark-grey text-lg mb-8">
            Thank you for reaching out to Digisoft Nexus. Our expert advisor will call you within{' '}
            <strong>30 minutes</strong> during business hours.
          </p>

          {/* What happens next */}
          <div className="bg-white rounded-xl2 shadow-luxury p-6 mb-8 text-left">
            <h2 className="font-syne font-bold text-navy text-sm mb-4">What Happens Next?</h2>
            <div className="space-y-4">
              {[
                { time: 'Within 15 minutes', icon: MessageCircle, title: 'WhatsApp Message', desc: 'You\'ll receive a personalised WhatsApp with the project brochure, floor plans, and pricing.' },
                { time: 'Within 30 minutes', icon: Phone, title: 'Expert Call', desc: 'A dedicated advisor will call you to understand your requirements and shortlist the best options.' },
                { time: 'Within 48 hours', icon: Clock, title: 'Site Visit Arranged', desc: 'If you\'re interested, we\'ll arrange a guided site visit at your preferred time.' },
              ].map(step => (
                <div key={step.time} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <step.icon className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-[10px] font-syne font-bold text-gold uppercase tracking-wider">{step.time}</p>
                    <p className="font-syne font-semibold text-navy text-xs">{step.title}</p>
                    <p className="text-dark-grey text-xs mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm gap-2 bg-[#25D366] text-white border-0 hover:bg-[#1eb356] justify-center"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us Now
            </a>
            <Link href="/properties" className="btn btn-outline btn-sm justify-center gap-2">
              Browse Properties <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-mid-grey text-xs">
            Not hearing from us?{' '}
            <a href="tel:+919999999999" className="text-gold hover:underline">
              Call +91 99999 99999
            </a>
          </p>
        </div>
      </section>
    </SiteLayout>
  )
}
