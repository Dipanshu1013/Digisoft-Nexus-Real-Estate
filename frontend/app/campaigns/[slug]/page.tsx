import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import SiteLayout from '@/components/layout/SiteLayout'
import CampaignPageClient from './CampaignPageClient'

// Campaign data — in production, fetch from Django backend
const CAMPAIGNS: Record<string, any> = {
  'godrej-emerald-facebook-may2026': {
    slug: 'godrej-emerald-facebook-may2026',
    title: 'Godrej Emerald — Pre-Launch Pricing',
    developer: 'Godrej Properties',
    developerSlug: 'godrej-properties',
    propertySlug: 'godrej-emerald-sector-89',
    location: 'Sector 89, Gurugram',
    priceDisplay: '₹1.25 Cr onwards',
    heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80',
    tagline: 'Gurugram\'s Most Awaited New Launch in 2026',
    description: 'Godrej Emerald in Sector 89 Gurugram offers thoughtfully designed 2 and 3 BHK apartments with world-class amenities. Pre-launch pricing is available exclusively for registered buyers.',
    urgencyText: 'Pre-launch pricing ends',
    highlights: [
      'Zero floor rise premium (limited period)',
      'Pre-launch pricing — save ₹12-18 Lakhs vs post-launch',
      'RERA registered: RC/REP/HARERA/GGM/522/2023',
      '424 units across 4 towers',
      '10% down, balance at possession',
      '3 mins from NH-48 Dwarka Expressway',
    ],
    configurations: [
      { type: '2BHK', area: '1150 sq ft', price: '₹1.25 Cr' },
      { type: '3BHK', area: '1550 sq ft', price: '₹1.65 Cr' },
      { type: '3BHK+Study', area: '1850 sq ft', price: '₹2.05 Cr' },
    ],
    amenities: ['Swimming Pool', 'Gymnasium', 'Clubhouse', 'Children\'s Play Area', 'Jogging Track', 'EV Charging', 'Yoga Deck', 'Power Backup'],
    leadMagnet: 'Download Floor Plans + Pre-Launch Price Sheet',
    metaTitle: 'Godrej Emerald Sector 89 Gurugram | Pre-Launch Pricing from ₹1.25 Cr',
    metaDescription: 'Register now for Godrej Emerald pre-launch pricing. 2 & 3 BHK from ₹1.25 Cr in Sector 89, Gurugram. Limited units. RERA registered.',
  },
  'dlf-privana-google-luxury': {
    slug: 'dlf-privana-google-luxury',
    title: 'DLF Privana West — Luxury Living',
    developer: 'DLF Limited',
    developerSlug: 'dlf',
    propertySlug: 'dlf-privana-sector-77',
    location: 'Sector 77, Gurugram',
    priceDisplay: '₹3.5 Cr onwards',
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
    tagline: 'Aravalli Views. DLF Luxury. 116-Acre Township.',
    description: 'DLF Privana West is DLF\'s most prestigious new launch in Sector 77. Nestled adjacent to the Aravalli Biodiversity Park, these super-luxury residences offer an unparalleled living experience.',
    urgencyText: 'Expression of Interest closes',
    highlights: [
      'Aravalli Biodiversity Park views',
      'Part of DLF\'s 116-acre township',
      'Club Privana — 75,000 sq ft clubhouse',
      '1,113 super-luxury units, 12 towers',
      'RERA: RC/REP/HARERA/GGM/689/2024',
      'DLF\'s most anticipated NCR launch',
    ],
    configurations: [
      { type: '3BHK', area: '2500 sq ft', price: '₹3.5 Cr' },
      { type: '4BHK', area: '3200 sq ft', price: '₹4.8 Cr' },
      { type: '4BHK+Study', area: '3800 sq ft', price: '₹5.8 Cr' },
    ],
    amenities: ['Club Privana 75K sqft', 'Golf Putting Green', '6 Swimming Pools', 'Indoor Sports', 'Fine Dining', 'Spa & Wellness', 'Aravalli Decks', 'Smart Home'],
    leadMagnet: 'Download Project Brochure + EOI Form',
    metaTitle: 'DLF Privana West Sector 77 Gurugram | 3-4 BHK Luxury from ₹3.5 Cr',
    metaDescription: 'DLF Privana West — super luxury 3 & 4 BHK from ₹3.5 Cr. Aravalli views, 116-acre township, Club Privana. Register for EOI.',
  },
  'm3m-capital-pre-launch': {
    slug: 'm3m-capital-pre-launch',
    title: 'M3M Capital Walk — VIP Pre-Launch',
    developer: 'M3M India',
    developerSlug: 'm3m',
    propertySlug: 'm3m-capital-sector-113',
    location: 'Sector 113, Gurugram',
    priceDisplay: '₹1.8 Cr onwards',
    heroImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1600&q=80',
    tagline: 'Register Before Public Launch — Dwarka Expressway\'s Next Big Thing',
    description: 'M3M Capital Walk is an upcoming landmark on the Dwarka Expressway in Sector 113. Pre-launch pricing is available exclusively for early registrations through Digisoft Nexus.',
    urgencyText: 'VIP registration closes',
    highlights: [
      'Pre-launch pricing — 15-20% below market',
      'Dwarka Expressway — 2 min drive',
      'Largest clubhouse in Sector 113',
      '500 units across 4 towers',
      'Smart home enabled',
      'EV charging in all parking slots',
    ],
    configurations: [
      { type: '2BHK', area: '1400 sq ft', price: '₹1.8 Cr' },
      { type: '3BHK', area: '1800 sq ft', price: '₹2.4 Cr' },
      { type: '4BHK', area: '2200 sq ft', price: '₹3.1 Cr' },
    ],
    amenities: ['Grand Clubhouse', 'Olympic Pool', 'Cricket Net', 'Futsal Court', 'Co-working Space', 'EV Charging', 'Rooftop Lounge', 'Yoga Deck'],
    leadMagnet: 'Get VIP Pre-Launch Price Sheet + Floor Plans',
    metaTitle: 'M3M Capital Walk Sector 113 | Pre-Launch from ₹1.8 Cr | VIP Registration',
    metaDescription: 'M3M Capital Walk VIP pre-launch — 2, 3 & 4 BHK from ₹1.8 Cr. Dwarka Expressway, Sector 113. Register for exclusive pre-launch pricing.',
  },
}

interface PageProps {
  params: { slug: string }
  searchParams: Record<string, string>
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const campaign = CAMPAIGNS[params.slug]
  if (!campaign) return { title: 'Campaign Not Found' }
  return {
    title: campaign.metaTitle,
    description: campaign.metaDescription,
    robots: 'noindex, follow', // Campaign pages — don't index (UTM traffic)
  }
}

// SSR — real-time UTM capture
export const dynamic = 'force-dynamic'

export default function CampaignPage({ params, searchParams }: PageProps) {
  const campaign = CAMPAIGNS[params.slug]
  if (!campaign) notFound()

  const utmParams = {
    utm_source: searchParams.utm_source || '',
    utm_medium: searchParams.utm_medium || '',
    utm_campaign: searchParams.utm_campaign || params.slug,
    utm_content: searchParams.utm_content || '',
    utm_term: searchParams.utm_term || '',
  }

  return (
    <SiteLayout showMinimalHeader>
      <CampaignPageClient campaign={campaign} utmParams={utmParams} />
    </SiteLayout>
  )
}
