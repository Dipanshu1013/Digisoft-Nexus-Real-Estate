// ============================================================
// DigiSoft Nexus — Mock Data Layer
// Replace API calls when Django backend is connected
// ============================================================

export interface Property {
  id: string
  slug: string
  title: string
  developer: string
  developerSlug: string
  location: string
  city: string
  sector?: string
  priceDisplay: string
  priceMin: number
  priceMax: number
  bhkOptions: string[]
  areaMin: number
  areaMax: number
  propertyType: 'apartment' | 'villa' | 'plot' | 'commercial' | 'penthouse' | 'studio'
  possessionStatus: 'ready-to-move' | 'under-construction' | 'new-launch' | 'pre-launch'
  status: 'available' | 'sold' | 'upcoming'
  isNew: boolean
  isLuxury: boolean
  isFeatured: boolean
  tag: string
  tagColor: string
  primaryImage: { url: string; alt: string }
  images?: { url: string; alt: string }[]
  description: string
  amenities: string[]
  reraId?: string
  totalUnits?: number
  totalTowers?: number
  possessionDate?: string
  metaTitle?: string
  metaDescription?: string
  highlights?: string[]
  floorPlanUrl?: string
  brochureUrl?: string
  videoUrl?: string
  latitude?: number
  longitude?: number
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content?: string
  coverImage: { url: string; alt: string }
  author: string
  authorAvatar?: string
  publishedAt: string
  readTime: number
  category: string
  tags: string[]
  metaTitle?: string
  metaDescription?: string
}

export interface Developer {
  slug: string
  name: string
  logo: string
  description: string
  established: number
  totalProjects: number
  totalUnitsDelivered: number
  rating: number
  reraId: string
  website: string
  featuredImage: string
  highlights: string[]
}

// ─── Properties ─────────────────────────────────────────────

export const ALL_PROPERTIES: Property[] = [
  {
    id: '1',
    slug: 'godrej-emerald-sector-89',
    title: 'Godrej Emerald',
    developer: 'Godrej Properties',
    developerSlug: 'godrej-properties',
    location: 'Sector 89, Gurugram',
    city: 'Gurugram',
    sector: 'Sector 89',
    priceDisplay: '₹1.25 Cr onwards',
    priceMin: 12500000,
    priceMax: 22000000,
    bhkOptions: ['2BHK', '3BHK'],
    areaMin: 1150,
    areaMax: 1850,
    propertyType: 'apartment',
    possessionStatus: 'new-launch',
    status: 'available',
    isNew: true,
    isLuxury: false,
    isFeatured: true,
    tag: 'New Launch',
    tagColor: 'bg-navy text-gold',
    primaryImage: { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', alt: 'Godrej Emerald 3BHK apartment Sector 89 Gurugram exterior view' },
    images: [
      { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', alt: 'Exterior' },
      { url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80', alt: 'Living Room' },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', alt: 'Kitchen' },
      { url: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80', alt: 'Master Bedroom' },
    ],
    description: 'Godrej Emerald is a landmark residential project in Sector 89, Gurugram. Offering spacious 2 and 3 BHK apartments with world-class amenities, Emerald is designed for families who want the perfect balance of urban convenience and natural serenity.',
    amenities: ['Swimming Pool', 'Gymnasium', 'Clubhouse', 'Children\'s Play Area', 'Jogging Track', '24/7 Security', 'Power Backup', 'Visitor Parking', 'Yoga Deck', 'EV Charging'],
    reraId: 'RC/REP/HARERA/GGM/522/2023',
    totalUnits: 424,
    totalTowers: 4,
    possessionDate: 'Dec 2026',
    isFeatured: true,
    highlights: ['RERA Registered', '3 mins from NH-48', 'Green certified building', 'Zero floor rise premium'],
    metaTitle: 'Godrej Emerald Sector 89 Gurugram | 2 & 3 BHK Apartments from ₹1.25 Cr',
    metaDescription: 'Buy 2BHK & 3BHK apartments at Godrej Emerald Sector 89 Gurugram. New launch pricing from ₹1.25 Cr. RERA registered RC/REP/HARERA/GGM/522/2023. Book site visit today.',
  },
  {
    id: '2',
    slug: 'dlf-the-camellias',
    title: 'DLF The Camellias',
    developer: 'DLF Limited',
    developerSlug: 'dlf',
    location: 'Golf Course Road, Gurugram',
    city: 'Gurugram',
    sector: 'Golf Course Road',
    priceDisplay: '₹12 Cr onwards',
    priceMin: 120000000,
    priceMax: 280000000,
    bhkOptions: ['4BHK', '5BHK', 'Penthouse'],
    areaMin: 5800,
    areaMax: 11000,
    propertyType: 'penthouse',
    possessionStatus: 'ready-to-move',
    status: 'available',
    isNew: false,
    isLuxury: true,
    isFeatured: true,
    tag: 'Ultra Luxury',
    tagColor: 'bg-gold text-navy',
    primaryImage: { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', alt: 'DLF Camellias ultra-luxury 5BHK Golf Course Road Gurugram' },
    images: [
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', alt: 'Facade' },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', alt: 'Living Area' },
      { url: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&q=80', alt: 'Master Bath' },
    ],
    description: 'DLF The Camellias is arguably India\'s most prestigious residential address. Located on Golf Course Road with sweeping views of the Aravalli hills, these expansive residences redefine luxury living in the NCR.',
    amenities: ['Private Pool per unit', 'Wine Cellar', 'Home Theatre', 'Concierge Service', 'Valet Parking', 'Spa & Wellness Center', 'Fine Dining Restaurant', 'Business Center', 'Helipad', 'Golf Course Access'],
    reraId: 'RC/REP/HARERA/GGM/388/2018',
    totalUnits: 429,
    totalTowers: 7,
    possessionDate: 'Ready to Move',
    highlights: ['Ready to Move', 'Golf course views', 'Private pool in select units', 'LEED Platinum certified'],
    metaTitle: 'DLF The Camellias Golf Course Road Gurugram | Ultra-Luxury 4-5 BHK from ₹12 Cr',
    metaDescription: 'DLF The Camellias — India\'s most prestigious address on Golf Course Road, Gurugram. 4 & 5 BHK apartments and penthouses from ₹12 Cr. Ready to Move.',
  },
  {
    id: '3',
    slug: 'm3m-altitude-sector-65',
    title: 'M3M Altitude',
    developer: 'M3M India',
    developerSlug: 'm3m',
    location: 'Sector 65, Gurugram',
    city: 'Gurugram',
    sector: 'Sector 65',
    priceDisplay: '₹2.8 Cr onwards',
    priceMin: 28000000,
    priceMax: 52000000,
    bhkOptions: ['3BHK', '4BHK'],
    areaMin: 2100,
    areaMax: 3200,
    propertyType: 'apartment',
    possessionStatus: 'under-construction',
    status: 'available',
    isNew: false,
    isLuxury: true,
    isFeatured: true,
    tag: 'Under Construction',
    tagColor: 'bg-dark-grey/80 text-white',
    primaryImage: { url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80', alt: 'M3M Altitude luxury 3BHK apartment Sector 65 Gurugram' },
    images: [
      { url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80', alt: 'Exterior' },
      { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80', alt: 'Clubhouse' },
    ],
    description: 'M3M Altitude in Sector 65 offers sky-high living with panoramic city views. These ultra-premium 3 and 4 BHK residences feature double-height living rooms, imported marble flooring, and world-class amenities.',
    amenities: ['Infinity Pool', 'Sky Lounge', 'Gymnasium', 'Squash Court', 'Multiplex', 'Fine Dining', 'Concierge', 'EV Parking', 'Terrace Garden', 'Business Hub'],
    reraId: 'RC/REP/HARERA/GGM/601/2022',
    totalUnits: 354,
    totalTowers: 3,
    possessionDate: 'Jun 2027',
    highlights: ['Double-height living rooms', '3 mins from Golf Course Ext. Road', 'Sky dining at 40th floor', 'Smart home automation'],
    metaTitle: 'M3M Altitude Sector 65 Gurugram | 3 & 4 BHK Luxury Apartments from ₹2.8 Cr',
    metaDescription: 'M3M Altitude Sector 65 Gurugram — premium 3 & 4 BHK luxury residences from ₹2.8 Cr. Under construction, possession Jun 2027. Sky lounge, infinity pool.',
  },
  {
    id: '4',
    slug: 'godrej-meridian-sector-106',
    title: 'Godrej Meridian',
    developer: 'Godrej Properties',
    developerSlug: 'godrej-properties',
    location: 'Sector 106, Gurugram',
    city: 'Gurugram',
    sector: 'Sector 106',
    priceDisplay: '₹78 L onwards',
    priceMin: 7800000,
    priceMax: 14000000,
    bhkOptions: ['2BHK', '3BHK'],
    areaMin: 850,
    areaMax: 1350,
    propertyType: 'apartment',
    possessionStatus: 'ready-to-move',
    status: 'available',
    isNew: false,
    isLuxury: false,
    isFeatured: true,
    tag: 'Ready to Move',
    tagColor: 'bg-success/90 text-white',
    primaryImage: { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', alt: 'Godrej Meridian 2BHK apartment Sector 106 Gurugram ready to move' },
    images: [
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', alt: 'Exterior' },
    ],
    description: 'Godrej Meridian in Sector 106 is a ready-to-move residential complex offering thoughtfully designed 2 and 3 BHK apartments. With excellent connectivity to Dwarka Expressway and NH-48, this is ideal for end-users and investors alike.',
    amenities: ['Clubhouse', 'Swimming Pool', 'Gymnasium', 'Children\'s Play Area', 'Multi-purpose Hall', 'Jogging Track', 'Power Backup', 'CCTV Surveillance'],
    reraId: 'RC/REP/HARERA/GGM/291/2019',
    totalUnits: 560,
    totalTowers: 5,
    possessionDate: 'Ready to Move',
    highlights: ['Ready to move', 'Dwarka Expressway connectivity', 'OC received', 'Investment hotspot'],
    metaTitle: 'Godrej Meridian Sector 106 Gurugram | Ready to Move 2-3 BHK from ₹78 Lakh',
    metaDescription: 'Godrej Meridian Sector 106 Gurugram — ready to move 2 & 3 BHK apartments from ₹78 Lakh. OC received, Dwarka Expressway location. Book today.',
  },
  {
    id: '5',
    slug: 'm3m-capital-sector-113',
    title: 'M3M Capital Walk',
    developer: 'M3M India',
    developerSlug: 'm3m',
    location: 'Sector 113, Gurugram',
    city: 'Gurugram',
    sector: 'Sector 113',
    priceDisplay: '₹1.8 Cr onwards',
    priceMin: 18000000,
    priceMax: 32000000,
    bhkOptions: ['2BHK', '3BHK', '4BHK'],
    areaMin: 1400,
    areaMax: 2200,
    propertyType: 'apartment',
    possessionStatus: 'pre-launch',
    status: 'available',
    isNew: true,
    isLuxury: false,
    isFeatured: true,
    tag: 'Pre-Launch',
    tagColor: 'bg-amber-500 text-white',
    primaryImage: { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80', alt: 'M3M Capital Walk 3BHK apartment Sector 113 Gurugram pre-launch' },
    images: [
      { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80', alt: 'Exterior' },
    ],
    description: 'M3M Capital Walk is an upcoming landmark in Sector 113 on the Dwarka Expressway. With pre-launch pricing available exclusively through registered channel partners, this is a prime investment opportunity.',
    amenities: ['Grand Clubhouse', 'Olympic-size Pool', 'Cricket Net', 'Futsal Court', 'Cycling Track', 'Co-working Space', 'EV Charging', 'Rooftop Lounge'],
    totalUnits: 500,
    totalTowers: 4,
    possessionDate: 'Dec 2028',
    highlights: ['Pre-launch pricing', 'Dwarka Expressway — 2 min drive', 'Largest clubhouse in Sector 113', 'Green building norms'],
    metaTitle: 'M3M Capital Walk Sector 113 Gurugram | Pre-Launch 2-4 BHK from ₹1.8 Cr',
    metaDescription: 'M3M Capital Walk Sector 113 — pre-launch 2, 3 & 4 BHK apartments from ₹1.8 Cr. Dwarka Expressway location. Register for VIP pricing today.',
  },
  {
    id: '6',
    slug: 'dlf-privana-sector-77',
    title: 'DLF Privana West',
    developer: 'DLF Limited',
    developerSlug: 'dlf',
    location: 'Sector 77, Gurugram',
    city: 'Gurugram',
    sector: 'Sector 77',
    priceDisplay: '₹3.5 Cr onwards',
    priceMin: 35000000,
    priceMax: 62000000,
    bhkOptions: ['3BHK', '4BHK'],
    areaMin: 2500,
    areaMax: 3800,
    propertyType: 'apartment',
    possessionStatus: 'new-launch',
    status: 'available',
    isNew: true,
    isLuxury: true,
    isFeatured: true,
    tag: 'New Launch',
    tagColor: 'bg-navy text-gold',
    primaryImage: { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', alt: 'DLF Privana 3BHK luxury apartment Sector 77 Gurugram new launch' },
    images: [
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', alt: 'Exterior' },
    ],
    description: 'DLF Privana West in Sector 77 is a part of DLF\'s mega 116-acre township. Offering breathtaking views of the Aravalli biodiversity park, these super-luxury low-rise residences are designed for those who seek privacy and grandeur.',
    amenities: ['Club Privana — 75,000 sqft clubhouse', 'Golf Putting Green', 'Aravalli View Decks', '6 Swimming Pools', 'Indoor Sports Complex', 'Spa & Salon', 'Fine Dining', 'Kids\' Club', 'Concierge', 'Smart Home'],
    reraId: 'RC/REP/HARERA/GGM/689/2024',
    totalUnits: 1113,
    totalTowers: 12,
    possessionDate: 'Dec 2028',
    highlights: ['Aravalli biodiversity park views', '116-acre township', 'Club Privana 75,000 sqft', 'DLF\'s most anticipated launch'],
    metaTitle: 'DLF Privana West Sector 77 Gurugram | 3-4 BHK Luxury from ₹3.5 Cr',
    metaDescription: 'DLF Privana West Sector 77 Gurugram — new launch 3 & 4 BHK luxury apartments from ₹3.5 Cr. Aravalli views, 116-acre township, Club Privana.',
  },
  {
    id: '7',
    slug: 'godrej-nature-plus-sohna',
    title: 'Godrej Nature Plus',
    developer: 'Godrej Properties',
    developerSlug: 'godrej-properties',
    location: 'Sohna Road, Gurugram',
    city: 'Gurugram',
    priceDisplay: '₹65 L onwards',
    priceMin: 6500000,
    priceMax: 10000000,
    bhkOptions: ['1BHK', '2BHK'],
    areaMin: 650,
    areaMax: 1050,
    propertyType: 'apartment',
    possessionStatus: 'ready-to-move',
    status: 'available',
    isNew: false,
    isLuxury: false,
    isFeatured: false,
    tag: 'Ready to Move',
    tagColor: 'bg-success/90 text-white',
    primaryImage: { url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', alt: 'Godrej Nature Plus 2BHK apartment Sohna Road Gurugram' },
    images: [],
    description: 'Godrej Nature Plus on Sohna Road offers affordable 1 and 2 BHK apartments in a green, nature-inspired environment. Perfect for first-time buyers seeking Godrej quality at accessible price points.',
    amenities: ['Swimming Pool', 'Gymnasium', 'Jogging Track', 'Children\'s Play Area', 'Community Hall', 'Power Backup'],
    reraId: 'RC/REP/HARERA/GGM/177/2017',
    totalUnits: 1200,
    totalTowers: 8,
    possessionDate: 'Ready to Move',
    highlights: ['Ready to move', 'Affordable Godrej quality', 'Sohna Road connectivity', 'OC received'],
  },
  {
    id: '8',
    slug: 'm3m-skywalk-sector-74a',
    title: 'M3M Skywalk',
    developer: 'M3M India',
    developerSlug: 'm3m',
    location: 'Sector 74A, Gurugram',
    city: 'Gurugram',
    priceDisplay: '₹90 L onwards',
    priceMin: 9000000,
    priceMax: 15000000,
    bhkOptions: ['2BHK', '3BHK'],
    areaMin: 900,
    areaMax: 1450,
    propertyType: 'apartment',
    possessionStatus: 'under-construction',
    status: 'available',
    isNew: false,
    isLuxury: false,
    isFeatured: false,
    tag: 'Under Construction',
    tagColor: 'bg-dark-grey/80 text-white',
    primaryImage: { url: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=80', alt: 'M3M Skywalk 2BHK apartment Sector 74A Gurugram' },
    images: [],
    description: 'M3M Skywalk is a connected community in Sector 74A with a unique skywalk connecting towers. Thoughtfully designed 2 and 3 BHK homes for modern urban families.',
    amenities: ['Rooftop Infinity Pool', 'Gymnasium', 'Basketball Court', 'Party Lawn', 'Kids Zone', 'Cafeteria'],
    totalUnits: 390,
    totalTowers: 3,
    possessionDate: 'Mar 2027',
    highlights: ['Connected skywalk between towers', 'Rapid Metro nearby', 'Smart home ready', 'RERA registered'],
  },
  {
    id: '9',
    slug: 'dlf-super-luxury-noida',
    title: 'DLF Camellias Noida',
    developer: 'DLF Limited',
    developerSlug: 'dlf',
    location: 'Sector 54, Noida',
    city: 'Noida',
    priceDisplay: '₹4.5 Cr onwards',
    priceMin: 45000000,
    priceMax: 85000000,
    bhkOptions: ['3BHK', '4BHK', '5BHK'],
    areaMin: 3200,
    areaMax: 6500,
    propertyType: 'apartment',
    possessionStatus: 'new-launch',
    status: 'available',
    isNew: true,
    isLuxury: true,
    isFeatured: false,
    tag: 'New Launch',
    tagColor: 'bg-navy text-gold',
    primaryImage: { url: 'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?w=800&q=80', alt: 'DLF luxury 4BHK apartment Sector 54 Noida new launch' },
    images: [],
    description: 'DLF brings its unmatched luxury expertise to Noida Sector 54 with super-premium residences. This landmark project features a world-class clubhouse and landscaped boulevards designed by internationally renowned architects.',
    amenities: ['Grand Clubhouse', 'Olympic Pool', 'Tennis Courts', 'Squash Courts', 'Multiplex', 'Business Lounge', 'Concierge', 'Valet', 'Organic Garden'],
    totalUnits: 288,
    totalTowers: 4,
    possessionDate: 'Jun 2029',
    highlights: ['DLF\'s first Noida super-luxury', 'Noida Expressway connectivity', 'World-class clubhouse', 'International architect design'],
  },
]

// ─── Developers ─────────────────────────────────────────────

export const DEVELOPERS: Record<string, Developer> = {
  'godrej-properties': {
    slug: 'godrej-properties',
    name: 'Godrej Properties',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Godrej_Logo.svg/320px-Godrej_Logo.svg.png',
    description: 'Godrej Properties is one of India\'s most trusted real estate developers with a legacy spanning over 125 years. Known for exceptional build quality, green practices, and on-time delivery, Godrej has delivered millions of sq ft across India\'s prime cities.',
    established: 1897,
    totalProjects: 180,
    totalUnitsDelivered: 100000,
    rating: 4.7,
    reraId: 'Multiple — check per project',
    website: 'https://www.godrejproperties.com',
    featuredImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80',
    highlights: [
      '125+ year legacy of the Godrej Group',
      'Over 1 crore sq ft delivered in NCR alone',
      'Green & sustainable construction practices',
      'Consistent on-time delivery track record',
      'CRISIL DA1 — highest developer rating',
    ],
  },
  'dlf': {
    slug: 'dlf',
    name: 'DLF Limited',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/14/DLF_logo.png',
    description: 'DLF Limited is India\'s largest real estate developer by market capitalization. Founded in 1946, DLF has built and sold over 340 million sq ft across India, with a particular concentration of ultra-luxury and premium projects in Gurugram.',
    established: 1946,
    totalProjects: 195,
    totalUnitsDelivered: 170000,
    rating: 4.6,
    reraId: 'Multiple — check per project',
    website: 'https://www.dlf.in',
    featuredImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    highlights: [
      'India\'s largest real estate company by market cap',
      '75+ years of building legacy',
      'Developer of Cyber City, Gurugram\'s IT hub',
      'Ultra-luxury expertise — The Camellias, The Crest',
      'DLF Avenue, Promenade — India\'s top malls',
    ],
  },
  'm3m': {
    slug: 'm3m',
    name: 'M3M India',
    logo: 'https://www.m3mindia.com/images/logo.png',
    description: 'M3M India has emerged as one of the fastest-growing real estate developers in Northern India, specializing in luxury, premium, and smart living developments in Gurugram. Known for iconic projects like M3M Golf Estate, M3M Merlin, and M3M Altitude.',
    established: 2010,
    totalProjects: 65,
    totalUnitsDelivered: 40000,
    rating: 4.3,
    reraId: 'Multiple — check per project',
    website: 'https://www.m3mindia.com',
    featuredImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    highlights: [
      'One of India\'s fastest-growing premium developers',
      'NCR real estate leader — Gurugram specialist',
      'Over 65 million sq ft in development pipeline',
      'Iconic luxury landmarks: Golf Estate, Altitude, Merlin',
      'ASSOCHAM Real Estate Company of the Year',
    ],
  },
}

// ─── Blog Posts ─────────────────────────────────────────────

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'gurugram-real-estate-2026-investment-guide',
    title: 'Gurugram Real Estate 2026: Complete Investment Guide for HNIs',
    excerpt: 'Why Gurugram\'s luxury micro-markets — Sector 42, Golf Course Road, and the emerging Sector 77-79 belt — are delivering 18–25% annualized returns for early investors.',
    coverImage: { url: 'https://images.unsplash.com/photo-1559628129-67cf63b72248?w=800&q=80', alt: 'Gurugram skyline real estate investment 2026' },
    author: 'Rahul Sharma',
    publishedAt: '2026-01-15',
    readTime: 8,
    category: 'Investment',
    tags: ['Gurugram', 'Investment', 'Luxury', 'HNI'],
    metaTitle: 'Gurugram Real Estate 2026 Investment Guide | HNI Opportunities',
    metaDescription: 'Complete 2026 investment guide for Gurugram real estate. Sector analysis, ROI projections, top developer picks for HNI buyers.',
  },
  {
    id: '2',
    slug: 'godrej-emerald-vs-dlf-privana-comparison',
    title: 'Godrej Emerald vs DLF Privana: Which is the Better Buy in 2026?',
    excerpt: 'We compare Gurugram\'s two most talked-about 2026 launches across location, specifications, pricing, and investment potential. The verdict might surprise you.',
    coverImage: { url: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=80', alt: 'Godrej Emerald vs DLF Privana property comparison Gurugram 2026' },
    author: 'Priya Nair',
    publishedAt: '2026-02-01',
    readTime: 10,
    category: 'Analysis',
    tags: ['Godrej', 'DLF', 'Gurugram', 'Comparison'],
    metaTitle: 'Godrej Emerald vs DLF Privana 2026 | Gurugram Property Comparison',
    metaDescription: 'Detailed comparison of Godrej Emerald Sector 89 and DLF Privana West Sector 77. Price, amenities, location — which is the better buy?',
  },
  {
    id: '3',
    slug: 'sector-79-vs-sector-84-gurugram-neighborhood-guide',
    title: 'Sector 79 vs Sector 84: The Gurugram Neighborhood Showdown',
    excerpt: 'Hyperlocal data on connectivity, social infrastructure, price appreciation trends, and livability for two of Gurugram\'s most contested residential sectors.',
    coverImage: { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', alt: 'Gurugram Sector 79 84 neighborhood comparison' },
    author: 'Ankur Verma',
    publishedAt: '2026-01-28',
    readTime: 6,
    category: 'Neighborhood Guide',
    tags: ['Gurugram', 'Sector 79', 'Sector 84', 'Neighborhood'],
  },
  {
    id: '4',
    slug: 'emi-vs-rent-2026-should-you-buy-or-rent',
    title: 'EMI vs Rent in Gurugram 2026: The Real Numbers',
    excerpt: 'With home loan rates at 8.6% and rents climbing 15% annually, the rent-vs-buy calculation has fundamentally shifted. Here\'s our data-backed analysis.',
    coverImage: { url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80', alt: 'EMI vs Rent real estate decision 2026 India' },
    author: 'Rahul Sharma',
    publishedAt: '2026-02-10',
    readTime: 7,
    category: 'Finance',
    tags: ['EMI', 'Finance', 'Home Loan', 'Decision Guide'],
  },
  {
    id: '5',
    slug: 'pre-launch-investment-strategy-2026',
    title: 'Pre-Launch Property Investment: The ₹50L to ₹1Cr Opportunity in 2026',
    excerpt: 'Pre-launch investors in Godrej Emerald (2023) have seen 28% appreciation before possession. How to identify the next opportunity and protect your capital.',
    coverImage: { url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80', alt: 'Pre-launch property investment strategy India 2026' },
    author: 'Priya Nair',
    publishedAt: '2026-02-15',
    readTime: 9,
    category: 'Investment',
    tags: ['Pre-launch', 'Investment', 'Strategy'],
  },
  {
    id: '6',
    slug: 'luxury-property-tax-benefits-india-2026',
    title: '5 Tax Benefits on Luxury Property Purchases You Must Know in 2026',
    excerpt: 'Section 24, 80C, and the new 2025 Budget provisions — how high-net-worth buyers can save ₹8–12 Lakh annually through strategic property tax planning.',
    coverImage: { url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=80', alt: 'Tax benefits luxury property India 2026 Section 24 80C' },
    author: 'Ankur Verma',
    publishedAt: '2026-02-18',
    readTime: 5,
    category: 'Finance',
    tags: ['Tax', 'Finance', 'Luxury', 'Budget 2026'],
  },
]

// ─── Testimonials ────────────────────────────────────────────

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Vikram Mehra',
    title: 'VP Engineering, Tech MNC',
    location: 'Sector 89, Gurugram',
    property: 'Godrej Emerald',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    rating: 5,
    text: 'Digisoft Nexus made my property journey completely stress-free. The team understood my budget and family needs, shortlisted only the best options, and the end-to-end documentation support was exceptional.',
    date: 'January 2026',
  },
  {
    id: '2',
    name: 'Anjali Kapoor',
    title: 'Senior Partner, Law Firm',
    location: 'Golf Course Road, Gurugram',
    property: 'DLF The Camellias',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    rating: 5,
    text: 'As a first-time luxury buyer, I was overwhelmed. Digisoft\'s expert explained the entire Camellias project, helped with legal due diligence, and negotiated an additional parking allocation. Could not have done this alone.',
    date: 'December 2025',
  },
  {
    id: '3',
    name: 'Rajesh Bhatia',
    title: 'Business Owner, Import-Export',
    location: 'Sector 65, Gurugram',
    property: 'M3M Altitude',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80',
    rating: 5,
    text: 'I was skeptical about brokers after a bad experience. But Digisoft is different — completely transparent, no hidden charges, and they actually know the projects inside-out. Booked M3M Altitude confidently.',
    date: 'November 2025',
  },
  {
    id: '4',
    name: 'Sunita Rao',
    title: 'COO, Healthcare Startup',
    location: 'Sector 106, Gurugram',
    property: 'Godrej Meridian',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
    rating: 5,
    text: 'The WhatsApp follow-up was incredibly helpful — I got all property documents, floor plans, and price sheets instantly. The process from inquiry to site visit was under 48 hours. Truly a 2026 experience.',
    date: 'October 2025',
  },
  {
    id: '5',
    name: 'Aditya Patel',
    title: 'NRI — Dubai UAE',
    location: 'Sector 77, Gurugram',
    property: 'DLF Privana West',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    rating: 5,
    text: 'Booked DLF Privana remotely from Dubai. Digisoft arranged virtual site tours, handled all paperwork, and even managed the payment processing for NRI buyers. The entire process took 2 weeks. Incredible!',
    date: 'February 2026',
  },
  {
    id: '6',
    name: 'Meera Krishnan',
    title: 'Investment Advisor',
    location: 'Sohna Road, Gurugram',
    property: 'Godrej Nature Plus',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    rating: 5,
    text: 'As a seasoned investor, I evaluate many brokers. Digisoft stands out for their market knowledge — they gave me hyperlocal data on rental yields and price appreciation that I couldn\'t find anywhere else.',
    date: 'January 2026',
  },
]

// ─── Utility Functions ────────────────────────────────────────

export function getPropertiesByDeveloper(developerSlug: string): Property[] {
  return ALL_PROPERTIES.filter(p => p.developerSlug === developerSlug)
}

export function getPropertiesByCity(city: string): Property[] {
  return ALL_PROPERTIES.filter(p => p.city.toLowerCase() === city.toLowerCase())
}

export function getFeaturedProperties(): Property[] {
  return ALL_PROPERTIES.filter(p => p.isFeatured)
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return ALL_PROPERTIES.find(p => p.slug === slug)
}

export function getLuxuryProperties(): Property[] {
  return ALL_PROPERTIES.filter(p => p.isLuxury)
}

export function getNewLaunchProperties(): Property[] {
  return ALL_PROPERTIES.filter(p => p.possessionStatus === 'new-launch' || p.possessionStatus === 'pre-launch')
}

export function getRelatedProperties(property: Property, limit = 3): Property[] {
  return ALL_PROPERTIES.filter(p =>
    p.id !== property.id &&
    (p.developerSlug === property.developerSlug || p.city === property.city)
  ).slice(0, limit)
}
