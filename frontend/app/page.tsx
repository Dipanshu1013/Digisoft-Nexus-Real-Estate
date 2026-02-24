import type { Metadata } from 'next'
import SiteLayout from '@/components/layout/SiteLayout'
import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import FeaturedProperties from '@/components/sections/FeaturedProperties'
import FeaturedDevelopers from '@/components/sections/FeaturedDevelopers'
import WhyChooseUs from '@/components/sections/WhyChooseUs'
import CalculatorsTeaser from '@/components/sections/CalculatorsTeaser'
import Testimonials from '@/components/sections/Testimonials'
import BlogTeaser from '@/components/sections/BlogTeaser'
import HomeCTA from '@/components/sections/HomeCTA'

export const metadata: Metadata = {
  title: 'DigiSoft Nexus | Premium Real Estate in Gurugram & Delhi NCR',
  description: 'Discover 500+ premium properties in Gurugram, Delhi NCR & Noida. Exclusive campaigns from Godrej, DLF, M3M. Expert guidance, zero brokerage for select projects. Your dream home starts here.',
  keywords: 'real estate gurugram, properties delhi ncr, godrej properties, dlf homes, m3m gurugram, buy apartment gurugram, luxury flats gurugram',
  openGraph: {
    title: 'DigiSoft Nexus | Premium Real Estate Gurugram & NCR',
    description: 'Find your perfect property with Digisoft Nexus. 500+ curated listings, exclusive pre-launch access, expert advisory.',
    url: 'https://digisoftnexus.com',
    siteName: 'DigiSoft Nexus',
    images: [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', width: 1200, height: 630 }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DigiSoft Nexus | Real Estate Gurugram & NCR',
    description: '500+ premium properties. Expert advisory. Exclusive pre-launch access.',
  },
  alternates: {
    canonical: 'https://digisoftnexus.com',
  },
}

export const revalidate = 300 // ISR every 5 minutes

export default function HomePage() {
  return (
    <SiteLayout>
      <HeroSection />
      <StatsSection />
      <FeaturedProperties />
      <WhyChooseUs />
      <FeaturedDevelopers />
      <CalculatorsTeaser />
      <Testimonials />
      <BlogTeaser />
      <HomeCTA />
    </SiteLayout>
  )
}
