import type { Metadata } from 'next'
import { Suspense } from 'react'
import SiteLayout from '@/components/layout/SiteLayout'
import PropertiesClient from './PropertiesClient'

export const metadata: Metadata = {
  title: 'Properties in Gurugram & Delhi NCR | Browse 500+ Projects',
  description: 'Explore premium and affordable properties in Gurugram, Delhi NCR, Noida. Filter by developer, location, price, BHK type. Best deals from Godrej, DLF, M3M.',
}

export const revalidate = 60  // ISR — 1 minute

export default function PropertiesPage() {
  return (
    <SiteLayout>
      <div className="bg-cream min-h-screen">
        {/* Page Header */}
        <div className="bg-navy py-12 md:py-16">
          <div className="container-site">
            {/* Breadcrumb */}
            <nav className="text-white/40 text-xs font-syne mb-4 flex items-center gap-2">
              <a href="/" className="hover:text-white/70 transition-colors">Home</a>
              <span>/</span>
              <span className="text-gold">Properties</span>
            </nav>
            <h1 className="font-display text-hero-sm text-white mb-3">
              Browse Properties in Gurugram & NCR
            </h1>
            <p className="text-white/55 text-base md:text-lg max-w-xl">
              500+ curated properties — new launch, under construction, ready to move. 
              Find your perfect home or investment.
            </p>
          </div>
        </div>
        {/* Filter + Grid — client side for interactivity */}
        <Suspense fallback={<PropertiesLoadingShell />}>
          <PropertiesClient />
        </Suspense>
      </div>
    </SiteLayout>
  )
}

function PropertiesLoadingShell() {
  return (
    <div className="container-site py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl3 overflow-hidden shadow-card">
            <div className="skeleton h-52 w-full" />
            <div className="p-5 space-y-3">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-5 w-1/2 rounded" />
              <div className="skeleton h-3 w-full rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
