/**
 * M3M India Microsite — Brand & Data Config
 */

export const M3M_BRAND = {
  name: 'M3M India',
  tagline: 'Magnificence in the Trinity of Men, Materials & Money',
  established: '2010',
  headquarters: 'Gurugram, India',
  colors: {
    primary: '#1A1A1A',       // Charcoal
    primaryLight: '#2D2D2D',
    accent: '#D4AF37',        // Gold
    accentLight: '#EDCC55',
    bg: '#FAFAFA',
    bgDark: '#F0F0F0',
    text: '#111111',
    textMuted: '#555555',
  },
  contact: {
    phone: '+919999999999',
    whatsapp: '919999999999',
    email: 'm3m@digisoftnexus.com',
  },
  social: {
    linkedin: 'https://linkedin.com/company/m3m-india',
    instagram: 'https://instagram.com/m3mindia',
    youtube: 'https://youtube.com/@m3mindia',
  },
  stats: [
    { value: '75 mn sq.ft.', label: 'Developed' },
    { value: '50,000+', label: 'Happy Families' },
    { value: '60+', label: 'Projects' },
    { value: '4.7★', label: 'Customer Rating' },
  ],
  certifications: ['RERA Registered', 'IGBC Green Building', 'FICCI Awards', 'ET Now Realty Awards'],
}

export interface M3MProject {
  id: string
  slug: string
  name: string
  tagline: string
  location: string
  sector: string
  city: string
  reraNumber: string
  status: 'pre-launch' | 'under-construction' | 'ready-to-move'
  possession: string
  priceRange: string
  configs: { type: string; area: string; price: string }[]
  totalUnits: number
  floors: number
  landAcres: number
  amenities: string[]
  highlights: string[]
  images: { url: string; alt: string }[]
  lat: number
  lng: number
}

export const M3M_PROJECTS: M3MProject[] = [
  {
    id: 'm3m-altitude',
    slug: 'm3m-altitude',
    name: 'M3M Altitude',
    tagline: 'Reach New Heights of Living',
    location: 'Golf Course Extension Road, Gurugram',
    sector: 'Sector 65',
    city: 'Gurugram',
    reraNumber: 'HARERA/GGM/2024/9012',
    status: 'under-construction',
    possession: 'September 2027',
    priceRange: '₹2.2 Cr – ₹5.5 Cr',
    configs: [
      { type: '2 BHK', area: '1,400 sq.ft.', price: '₹2.2 – 2.8 Cr' },
      { type: '3 BHK', area: '1,900 – 2,200 sq.ft.', price: '₹3.0 – 4.0 Cr' },
      { type: '4 BHK + Terrace', area: '3,100 sq.ft.', price: '₹4.8 – 5.5 Cr' },
    ],
    totalUnits: 650,
    floors: 46,
    landAcres: 10.5,
    amenities: [
      'Sky pool at level 30',
      'Business lounge with Bloomberg terminals',
      'Cigar bar and whisky vault',
      'Wellness club with Technogym',
      'Rooftop restaurant (members only)',
      'Supercar parking (paid)',
      'AI-enabled smart home system',
      'Personal butler service on demand',
      'Helipad',
      'Guest suites (2 per tower)',
    ],
    highlights: [
      'Golf Course Extension frontage — highest appreciation belt',
      'Tallest residential tower in Sector 65',
      'AI smart home standard for every unit',
      '15% appreciation since 2023 pre-launch',
      'Pre-leased retail below — guaranteed footfall',
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80', alt: 'M3M Altitude tower Gurugram' },
      { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80', alt: 'M3M Altitude sky pool' },
      { url: 'https://images.unsplash.com/photo-1560185127-6a443e032b82?w=1200&q=80', alt: 'M3M Altitude interior' },
    ],
    lat: 28.4228,
    lng: 77.0862,
  },
  {
    id: 'm3m-capital',
    slug: 'm3m-capital',
    name: 'M3M Capital',
    tagline: 'The Financial District. Elevated.',
    location: 'Sector 113, Gurugram',
    sector: 'Sector 113',
    city: 'Gurugram',
    reraNumber: 'HARERA/GGM/2024/7834',
    status: 'pre-launch',
    possession: 'March 2028',
    priceRange: '₹2.8 Cr – ₹7 Cr',
    configs: [
      { type: '3 BHK', area: '2,050 sq.ft.', price: '₹2.8 – 3.8 Cr' },
      { type: '4 BHK', area: '2,900 sq.ft.', price: '₹4.2 – 5.8 Cr' },
      { type: '4 BHK + Study Penthouse', area: '4,200 sq.ft.', price: '₹6.0 – 7.0 Cr' },
    ],
    totalUnits: 420,
    floors: 48,
    landAcres: 8.2,
    amenities: [
      'Sky Observatory at level 48',
      'Private dining room (reservation system)',
      'Golf simulator',
      'Olympic pool + hot tub',
      'Studio recording room',
      'Pilates and yoga studio',
    ],
    highlights: [
      'First project in India with Sky Observatory at 48th floor',
      'Direct NH-8 frontage — next exit from Dwarka Expressway',
      'VIP pre-launch open — expected 30% appreciation at launch',
      'M3M\'s flagship 2025 launch project',
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', alt: 'M3M Capital render Gurugram' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80', alt: 'M3M Capital interior' },
    ],
    lat: 28.4920,
    lng: 76.9838,
  },
]

export function getProjectBySlug(slug: string): M3MProject | undefined {
  return M3M_PROJECTS.find((p) => p.slug === slug)
}
