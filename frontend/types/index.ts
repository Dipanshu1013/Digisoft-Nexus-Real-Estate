// ==========================================
// DIGISOFT REAL ESTATE — Type Definitions
// ==========================================

// ---------- Property Types ----------
export type PropertyType = 'apartment' | 'villa' | 'plot' | 'commercial' | 'penthouse' | 'studio'
export type PropertyStatus = 'available' | 'sold' | 'upcoming' | 'pre-launch'
export type BHKType = '1BHK' | '2BHK' | '3BHK' | '4BHK' | '5BHK' | 'Studio' | 'Penthouse'
export type PossessionStatus = 'ready-to-move' | 'under-construction' | 'new-launch' | 'pre-launch'

export interface Property {
  id: string
  slug: string
  title: string
  developer: string
  developerSlug: string
  location: string
  city: string
  sector?: string
  priceMin: number
  priceMax: number
  priceDisplay: string          // e.g. "₹1.2 Cr onwards"
  bhkOptions: BHKType[]
  areaMin: number               // sq ft
  areaMax: number
  propertyType: PropertyType
  status: PropertyStatus
  possessionStatus: PossessionStatus
  possessionDate?: string
  images: PropertyImage[]
  amenities: string[]
  highlights: string[]
  description: string
  floorPlanUrl?: string
  virtualTourUrl?: string
  brochureUrl?: string
  coordinates?: { lat: number; lng: number }
  rera?: string
  isNew?: boolean
  isFeatured?: boolean
  isLuxury?: boolean
  createdAt: string
  updatedAt: string
}

export interface PropertyImage {
  id: string
  url: string
  alt: string
  type: 'exterior' | 'interior' | 'amenity' | 'floorplan' | 'aerial'
  isPrimary: boolean
}

// ---------- Lead Types ----------
export type LeadStage = 1 | 2 | 3 | 4
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'site-visited' | 'negotiating' | 'converted' | 'lost'
export type BuyerStatus = 'buyer' | 'investor' | 'renter' | 'nri'

export interface CapturedLead {
  id?: string
  // Stage 1
  firstName: string
  email: string
  // Stage 2
  phone?: string
  buyerStatus?: BuyerStatus
  // Stage 3
  budgetMin?: number
  budgetMax?: number
  jobTitle?: string
  // Stage 4
  currentCity?: string
  specificRequirements?: string
  // Attribution
  propertyInterest?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  // Consent
  consentGiven: boolean
  // Meta
  timestamp?: string
  stage?: LeadStage
  status?: LeadStatus
}

export interface LeadFormData {
  stage: LeadStage
  data: Partial<CapturedLead>
  propertySlug?: string
  campaignSlug?: string
}

// ---------- Campaign Types ----------
export type CommissionType = 'per_lead' | 'percentage' | 'fixed'

export interface AffiliateCampaign {
  id: string
  slug: string
  campaignName: string
  developer: string
  propertySlug?: string
  targetUrl: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  isActive: boolean
  commissionType: CommissionType
  commissionValue: number
  startDate?: string
  endDate?: string
  clicks?: number
  leads?: number
  createdAt: string
}

// ---------- Blog Types ----------
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  featuredImage: string
  featuredImageAlt: string
  author: Author
  category: BlogCategory
  tags: string[]
  readTime: number            // minutes
  views?: number
  publishedAt: string
  updatedAt: string
  seo: SEOMeta
}

export interface Author {
  id: string
  name: string
  avatar?: string
  bio?: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
}

// ---------- SEO Types ----------
export interface SEOMeta {
  metaTitle: string
  metaDescription: string
  ogImage?: string
  canonicalUrl?: string
  schema?: Record<string, unknown>
}

// ---------- UTM / Attribution ----------
export interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

// ---------- Calculator Types ----------
export interface EMIInput {
  loanAmount: number      // INR
  interestRate: number    // annual %
  tenureYears: number
}

export interface EMIResult {
  emi: number
  totalPayable: number
  totalInterest: number
  principalAmount: number
  breakdown: EMIBreakdownItem[]
}

export interface EMIBreakdownItem {
  year: number
  principal: number
  interest: number
  balance: number
}

export interface ROIInput {
  purchasePrice: number
  expectedRentalYield: number   // annual %
  appreciationRate: number      // annual %
  holdingPeriodYears: number
}

export interface ROIResult {
  totalRentalIncome: number
  estimatedResaleValue: number
  totalROI: number
  annualizedROI: number
  breakEvenYear: number
}

// ---------- API Response ----------
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  next: string | null
  previous: string | null
  totalPages: number
  currentPage: number
}

// ---------- User / Auth ----------
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  savedProperties: string[]
  inquiries: string[]
  createdAt: string
}

// ---------- Developer ----------
export interface Developer {
  id: string
  slug: string
  name: string
  logo: string
  description: string
  establishedYear: number
  totalProjects: number
  citiesPresent: string[]
  website?: string
  reraId?: string
}

// ---------- Popup / UI State ----------
export type PopupType = 'lead-form' | 'exit-intent' | 'lead-magnet' | 'pre-launch-vip' | null

export interface PopupConfig {
  type: PopupType
  title?: string
  subtitle?: string
  propertySlug?: string
  campaignSlug?: string
  leadMagnetTitle?: string
}
