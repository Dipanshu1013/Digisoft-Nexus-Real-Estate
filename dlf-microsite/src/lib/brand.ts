/**
 * DLF Limited Microsite — Brand & Data Config
 */

export const DLF_BRAND = {
  name: 'DLF Limited',
  tagline: 'Building India',
  established: '1946',
  headquarters: 'Gurugram, India',
  colors: {
    primary: '#0B1F4A',       // Royal Navy
    primaryLight: '#162B60',
    accent: '#C0C0C0',        // Silver
    accentWarm: '#D4AF37',    // Gold (warm accent)
    bg: '#F5F7FA',
    bgDark: '#E8ECF2',
    text: '#0D1B2A',
    textMuted: '#4A5568',
  },
  contact: {
    phone: '+919999999999',
    whatsapp: '919999999999',
    email: 'dlf@digisoftnexus.com',
  },
  social: {
    linkedin: 'https://linkedin.com/company/dlf-limited',
    instagram: 'https://instagram.com/dlf_india',
    youtube: 'https://youtube.com/@dlfindia',
  },
  stats: [
    { value: '75+', label: 'Years of Trust' },
    { value: '158 mn sq.ft.', label: 'Area Developed' },
    { value: '15+', label: 'States' },
    { value: '1 Lakh+', label: 'Homes Delivered' },
  ],
  certifications: ['RERA Registered', 'NSE/BSE Listed', 'IGBC Platinum', 'Forbes Top Developer'],
}

export interface DLFProject {
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
  paymentPlan: { option: string; details: string }[]
}

export const DLF_PROJECTS: DLFProject[] = [
  {
    id: 'dlf-privana-west',
    slug: 'dlf-privana-west',
    name: 'DLF Privana West',
    tagline: 'The Address the City Has Always Wanted',
    location: 'Sector 76–77, Gurugram',
    sector: 'Sector 76–77',
    city: 'Gurugram',
    reraNumber: 'HARERA/GGM/2024/2345',
    status: 'under-construction',
    possession: 'June 2027',
    priceRange: '₹3.8 Cr – ₹8.5 Cr',
    configs: [
      { type: '3 BHK Ultra Luxury', area: '2,500 – 2,750 sq.ft.', price: '₹3.8 – 4.8 Cr' },
      { type: '4 BHK Signature', area: '3,200 – 3,800 sq.ft.', price: '₹5.2 – 7.0 Cr' },
      { type: '4 BHK + Study Penthouse', area: '4,800 – 5,500 sq.ft.', price: '₹7.5 – 8.5 Cr' },
    ],
    totalUnits: 1113,
    floors: 39,
    landAcres: 22.6,
    amenities: [
      'Private courtyards in each tower',
      'Olympic-size pool with deck',
      'Half-acre forest trail within complex',
      'Double-height sky lounge',
      'Signature spa by international brand',
      'Cigar lounge and wine cellar',
      'Private screening room',
      'Dedicated concierge on every floor',
      'Smart home Alexa/Google integration',
      'EV charging for all units',
      'Pet park and grooming station',
      'Helipad (select towers)',
    ],
    highlights: [
      'DLF\'s fastest-selling project — 3x oversubscription in 2025 pre-launch',
      'Sold out Phase 1 in 72 hours at ₹18,000 / sq.ft.',
      'Adjacent to 135-acre DLF Cyber City extension',
      '5-minute drive to Rapid Metro',
      '28% price appreciation since 2023 launch',
      'Backed by DLF\'s 75-year delivery promise',
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80', alt: 'DLF Privana West tower Gurugram' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80', alt: 'DLF Privana luxury interior' },
      { url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&q=80', alt: 'DLF Privana pool' },
      { url: 'https://images.unsplash.com/photo-1560185127-6a443e032b82?w=1200&q=80', alt: 'DLF Privana living room' },
    ],
    lat: 28.4055,
    lng: 77.0325,
    paymentPlan: [
      { option: 'CLP (Construction Linked)', details: '10% booking, then 10% at each slab completion, balance at possession' },
      { option: 'Flexi Pay', details: '20% now, 80% within 90 days (discounted pricing available)' },
    ],
  },
  {
    id: 'dlf-privana-north',
    slug: 'dlf-privana-north',
    name: 'DLF Privana North',
    tagline: 'Where Exclusivity Meets Infinity',
    location: 'Sector 77, Gurugram',
    sector: 'Sector 77',
    city: 'Gurugram',
    reraNumber: 'HARERA/GGM/2025/0192',
    status: 'pre-launch',
    possession: 'December 2028',
    priceRange: '₹4.2 Cr – ₹10 Cr',
    configs: [
      { type: '3 BHK Ultra', area: '2,650 sq.ft.', price: '₹4.2 – 5.5 Cr' },
      { type: '4 BHK Signature', area: '3,550 sq.ft.', price: '₹6.0 – 8.0 Cr' },
      { type: '5 BHK Penthouse', area: '5,800 sq.ft.', price: '₹9.0 – 10 Cr' },
    ],
    totalUnits: 800,
    floors: 42,
    landAcres: 18,
    amenities: [
      'Private sky gardens on every 5th floor',
      'International art installation in lobby',
      'Michelin-star inspired F&B venue',
      'Private cinema and gaming lounge',
      'Hydrotherapy spa',
      'Full-floor resident lounge',
    ],
    highlights: [
      'Pre-launch pricing — expected 20-25% jump at public launch',
      'VIP registrations open — limited to 200 slots',
      'North-facing units with Aravalli view',
      'Adjacent to upcoming DMIC knowledge city',
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80', alt: 'DLF Privana North render' },
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', alt: 'DLF Privana North interior' },
    ],
    lat: 28.4085,
    lng: 77.0350,
    paymentPlan: [
      { option: 'VIP Pre-Launch', details: 'Special 5% booking deposit, structured payments — details on registration' },
    ],
  },
]

export function getProjectBySlug(slug: string): DLFProject | undefined {
  return DLF_PROJECTS.find((p) => p.slug === slug)
}
