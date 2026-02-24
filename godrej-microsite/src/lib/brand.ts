/**
 * Godrej Properties Microsite — Brand & Data Config
 *
 * Single source of truth for all brand tokens, copy, and project data
 * used across the Godrej microsite.
 */

// ─── Brand ───────────────────────────────────────────────────

export const GODREJ_BRAND = {
  name: 'Godrej Properties',
  tagline: 'Building Brighter Living',
  logo: '/godrej-logo.svg',
  established: '1990',
  headquarters: 'Mumbai, India',
  colors: {
    primary: '#2D6A4F',      // Forest Green
    primaryLight: '#3A8A65',
    primaryDark: '#1B4332',
    accent: '#D4AF37',       // Gold
    bg: '#F8FBF9',           // Soft Mint
    bgDark: '#EBF5EF',
    text: '#1A2E25',
    textMuted: '#4A7260',
  },
  contact: {
    phone: '+919999999999',
    whatsapp: '919999999999',
    email: 'godrej@digisoftnexus.com',
  },
  social: {
    linkedin: 'https://linkedin.com/company/godrej-properties',
    instagram: 'https://instagram.com/godrejproperties',
    youtube: 'https://youtube.com/@godrejproperties',
  },
  stats: [
    { value: '12+', label: 'Cities' },
    { value: '170+', label: 'Projects Delivered' },
    { value: '70,000+', label: 'Happy Families' },
    { value: '98%', label: 'RERA Compliant' },
  ],
  certifications: ['RERA Registered', 'ISO 9001:2015', 'IGBC Green Building', 'CII Awards Winner'],
}

// ─── Projects ────────────────────────────────────────────────

export interface GodrejProject {
  id: string
  slug: string
  name: string
  tagline: string
  location: string
  sector: string
  city: string
  reraNumber: string
  status: 'pre-launch' | 'under-construction' | 'ready-to-move' | 'sold-out'
  possession: string
  priceRange: string
  priceMin: number    // in lakhs
  priceMax: number    // in lakhs
  configs: {
    type: string
    area: string
    price: string
  }[]
  totalUnits: number
  floors: number
  towers: number
  landAcres: number
  amenities: string[]
  highlights: string[]
  images: { url: string; alt: string }[]
  floorPlans: { label: string; image: string }[]
  masterPlan: string
  brochureUrl: string
  videoUrl?: string
  lat: number
  lng: number
  nearbyLandmarks: string[]
  paymentPlan: {
    option: string
    details: string
  }[]
}

export const GODREJ_PROJECTS: GodrejProject[] = [
  {
    id: 'ge-sector79',
    slug: 'godrej-emerald',
    name: 'Godrej Emerald',
    tagline: 'Where Luxury Meets Nature',
    location: 'Sector 79, Gurugram',
    sector: 'Sector 79',
    city: 'Gurugram',
    reraNumber: 'HARERA/GGM/2024/1234',
    status: 'under-construction',
    possession: 'December 2026',
    priceRange: '₹1.4 Cr – ₹3.2 Cr',
    priceMin: 140,
    priceMax: 320,
    configs: [
      { type: '2 BHK', area: '1,245 – 1,380 sq.ft.', price: '₹1.4 – 1.8 Cr' },
      { type: '3 BHK', area: '1,650 – 1,890 sq.ft.', price: '₹1.9 – 2.5 Cr' },
      { type: '4 BHK', area: '2,400 – 2,750 sq.ft.', price: '₹2.8 – 3.2 Cr' },
    ],
    totalUnits: 480,
    floors: 32,
    towers: 4,
    landAcres: 7.5,
    amenities: [
      'Olympic-size swimming pool',
      'Grand clubhouse (12,000 sq.ft.)',
      'Landscaped forest trail (1.2 km)',
      'Children\'s adventure zone',
      'Yoga and meditation garden',
      'Smart gym with Technogym equipment',
      'Multipurpose sports court',
      'EV charging stations',
      'Concierge services',
      'Guest suites',
      '3-tier security system',
      'Rainwater harvesting',
    ],
    highlights: [
      '40% open green space',
      '2-min drive to NH-48 (Delhi–Gurgaon Expressway)',
      'Adjacent to 150-acre forest reserve',
      'Walking distance to upcoming metro station',
      'Adjacent to Aldi Mall and luxury retail strip',
      'Godrej\'s fastest-selling project in Gurugram',
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80', alt: 'Godrej Emerald tower exterior Gurugram' },
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', alt: 'Godrej Emerald clubhouse' },
      { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80', alt: 'Godrej Emerald swimming pool' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80', alt: 'Godrej Emerald 3BHK living room' },
      { url: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=80', alt: 'Godrej Emerald master bedroom' },
    ],
    floorPlans: [
      { label: '2 BHK — 1,245 sq.ft.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
      { label: '3 BHK — 1,650 sq.ft.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
      { label: '4 BHK — 2,400 sq.ft.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
    ],
    masterPlan: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    brochureUrl: '/brochures/godrej-emerald.pdf',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    lat: 28.3917,
    lng: 77.0085,
    nearbyLandmarks: [
      'Cyber City (12 km)',
      'IGI Airport (28 km)',
      'Rajiv Chowk Metro (16 km)',
      'Dwarka Expressway (3 km)',
      'Hero Honda Chowk (8 km)',
    ],
    paymentPlan: [
      { option: '30:70 Plan', details: '30% at booking, 70% at possession — No EMI till possession' },
      { option: 'Subvention Plan', details: 'Pay 10% now, bank pays 90% — Zero EMI till 2026' },
      { option: 'Flexi Plan', details: '10:10:80 — 10% booking, 10% at slab, 80% at possession' },
    ],
  },

  {
    id: 'gc-sector63a',
    slug: 'godrej-central',
    name: 'Godrej Central',
    tagline: 'Connected. Curated. Complete.',
    location: 'Sector 63A, Gurugram',
    sector: 'Sector 63A',
    city: 'Gurugram',
    reraNumber: 'HARERA/GGM/2024/5678',
    status: 'pre-launch',
    possession: 'March 2028',
    priceRange: '₹1.8 Cr – ₹4.5 Cr',
    priceMin: 180,
    priceMax: 450,
    configs: [
      { type: '2.5 BHK', area: '1,480 – 1,620 sq.ft.', price: '₹1.8 – 2.2 Cr' },
      { type: '3 BHK', area: '1,850 – 2,100 sq.ft.', price: '₹2.4 – 3.1 Cr' },
      { type: '4 BHK', area: '2,800 – 3,200 sq.ft.', price: '₹3.6 – 4.5 Cr' },
    ],
    totalUnits: 360,
    floors: 40,
    towers: 3,
    landAcres: 6.2,
    amenities: [
      'Rooftop infinity pool (40th floor)',
      'Sky lounge and co-working space',
      'Private theatre (12-seater)',
      'Chef\'s kitchen for events',
      'Wellness spa and hammam',
      'Squash and badminton courts',
      '4-level basement parking',
      'Smart home automation',
      'EV charging for every unit',
      'Concierge and valet',
    ],
    highlights: [
      'Pre-launch pricing locked at ₹9,800 per sq.ft.',
      'Direct frontage on Southern Peripheral Road',
      '5-minute drive to Cyber City',
      'IGBC Platinum rated building',
      'Guaranteed 15% appreciation on possession — or 2% refund',
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80', alt: 'Godrej Central tower render Sector 63A Gurugram' },
      { url: 'https://images.unsplash.com/photo-1560185127-6a443e032b82?w=1200&q=80', alt: 'Godrej Central sky lounge' },
      { url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&q=80', alt: 'Godrej Central rooftop infinity pool' },
    ],
    floorPlans: [
      { label: '3 BHK — 1,850 sq.ft.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
    ],
    masterPlan: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    brochureUrl: '/brochures/godrej-central.pdf',
    lat: 28.4230,
    lng: 77.0452,
    nearbyLandmarks: [
      'Cyber City DLF (5 km)',
      'MG Road Metro (4 km)',
      'Golf Course Road (3 km)',
      'Indira Gandhi International Airport (22 km)',
    ],
    paymentPlan: [
      { option: 'Pre-Launch Special', details: '5% booking amount, structured payments till possession' },
      { option: '10:90 Subvention', details: '10% now, nothing till possession — bank handles 90%' },
    ],
  },
]

export function getProjectBySlug(slug: string): GodrejProject | undefined {
  return GODREJ_PROJECTS.find((p) => p.slug === slug)
}
