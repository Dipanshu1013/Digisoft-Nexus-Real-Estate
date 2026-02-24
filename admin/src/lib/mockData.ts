/**
 * DigiSoft Nexus Admin — Mock Data
 * In production these come from Phase 2 Django API endpoints.
 */

export type LeadStatus = 'new' | 'contacted' | 'site-visit' | 'negotiation' | 'closed-won' | 'closed-lost'
export type LeadSource = 'google-ads' | 'meta-ads' | 'organic' | 'referral' | 'campaign' | 'microsite' | 'exit-intent' | 'scroll-popup' | 'whatsapp' | 'walk-in'

export interface Lead {
  id: string
  firstName: string
  lastName: string
  phone: string
  email?: string
  status: LeadStatus
  source: LeadSource
  budget?: string
  buyerStatus?: 'buyer' | 'investor' | 'renter' | 'nri'
  currentCity?: string
  propertyInterest?: string
  campaignSlug?: string
  assignedAgent?: string
  profileStage: 1 | 2 | 3 | 4
  score: number
  createdAt: string
  updatedAt: string
  lastContactedAt?: string
  notes?: LeadNote[]
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

export interface LeadNote {
  id: string
  leadId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
  type: 'note' | 'call' | 'whatsapp' | 'email' | 'sitevisit'
}

export interface Agent {
  id: string
  name: string
  email: string
  phone: string
  role: 'super-admin' | 'manager' | 'agent'
  leadsAssigned: number
  leadsConverted: number
  conversionRate: number
}

export interface Campaign {
  id: string
  name: string
  slug: string
  platform: 'google' | 'meta' | 'whatsapp' | 'sms' | 'email'
  status: 'active' | 'paused' | 'ended' | 'draft'
  budget: number
  spent: number
  leads: number
  conversions: number
  cpl: number
  startDate: string
  endDate?: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
}

export interface PropertyAdmin {
  id: string
  title: string
  slug: string
  developer: 'godrej' | 'dlf' | 'm3m' | 'other'
  status: 'active' | 'sold-out' | 'archived'
  reraNumber: string
  priceMin: number
  priceMax: number
  location: string
  leads: number
  views: number
  updatedAt: string
}

export const AGENTS: Agent[] = [
  { id: 'a1', name: 'Priya Sharma', email: 'priya@digisoftnexus.com', phone: '+919876543210', role: 'manager', leadsAssigned: 48, leadsConverted: 12, conversionRate: 25 },
  { id: 'a2', name: 'Rahul Verma', email: 'rahul@digisoftnexus.com', phone: '+919876543211', role: 'agent', leadsAssigned: 32, leadsConverted: 8, conversionRate: 25 },
  { id: 'a3', name: 'Ankit Gupta', email: 'ankit@digisoftnexus.com', phone: '+919876543212', role: 'agent', leadsAssigned: 28, leadsConverted: 9, conversionRate: 32 },
  { id: 'a4', name: 'Neha Singh', email: 'neha@digisoftnexus.com', phone: '+919876543213', role: 'agent', leadsAssigned: 22, leadsConverted: 4, conversionRate: 18 },
  { id: 'a5', name: 'Vikram Joshi', email: 'vikram@digisoftnexus.com', phone: '+919876543214', role: 'agent', leadsAssigned: 19, leadsConverted: 6, conversionRate: 32 },
]

export const LEADS: Lead[] = [
  {
    id: 'l001', firstName: 'Amit', lastName: 'Kapoor', phone: '+919811234567', email: 'amit.kapoor@gmail.com',
    status: 'negotiation', source: 'google-ads', budget: '₹2 Cr – ₹5 Cr', buyerStatus: 'investor',
    currentCity: 'Delhi', propertyInterest: 'DLF Privana West', assignedAgent: 'a1',
    profileStage: 4, score: 88, createdAt: '2026-02-22T09:15:00Z', updatedAt: '2026-02-23T14:30:00Z',
    lastContactedAt: '2026-02-23T14:30:00Z', utmSource: 'google', utmMedium: 'cpc', utmCampaign: 'dlf-privana-feb',
    notes: [
      { id: 'n1', leadId: 'l001', authorId: 'a1', authorName: 'Priya Sharma', content: 'Very interested in 4BHK. Has budget confirmed. Site visit done on 22nd Feb. Wants floor plan comparison.', createdAt: '2026-02-22T11:00:00Z', type: 'call' },
      { id: 'n2', leadId: 'l001', authorId: 'a1', authorName: 'Priya Sharma', content: 'Sent price negotiation to developer. Awaiting response on floor 28 unit.', createdAt: '2026-02-23T14:30:00Z', type: 'note' },
    ],
  },
  {
    id: 'l002', firstName: 'Sunita', lastName: 'Mehta', phone: '+919822345678', email: 'sunita.mehta@outlook.com',
    status: 'site-visit', source: 'meta-ads', budget: '₹1 Cr – ₹2 Cr', buyerStatus: 'buyer',
    currentCity: 'Noida', propertyInterest: 'Godrej Emerald', assignedAgent: 'a2',
    profileStage: 3, score: 72, createdAt: '2026-02-21T16:00:00Z', updatedAt: '2026-02-23T10:00:00Z',
  },
  {
    id: 'l003', firstName: 'Rajesh', lastName: 'Nair', phone: '+919833456789',
    status: 'contacted', source: 'organic', budget: '₹50L – ₹1 Cr', buyerStatus: 'buyer',
    currentCity: 'Gurugram', propertyInterest: 'Godrej Emerald 2BHK', assignedAgent: 'a3',
    profileStage: 2, score: 45, createdAt: '2026-02-23T08:30:00Z', updatedAt: '2026-02-23T08:45:00Z',
  },
  {
    id: 'l004', firstName: 'Priyanka', lastName: 'Reddy', phone: '+919844567890', email: 'priyanka@company.com',
    status: 'new', source: 'exit-intent', budget: '₹2 Cr – ₹5 Cr', buyerStatus: 'investor',
    currentCity: 'Hyderabad', propertyInterest: 'M3M Altitude',
    profileStage: 1, score: 30, createdAt: '2026-02-24T07:15:00Z', updatedAt: '2026-02-24T07:15:00Z',
  },
  {
    id: 'l005', firstName: 'Arjun', lastName: 'Bhatt', phone: '+919855678901', email: 'arjun.bhatt@nri.com',
    status: 'closed-won', source: 'referral', budget: '₹5 Cr – ₹10 Cr', buyerStatus: 'nri',
    currentCity: 'Dubai', propertyInterest: 'DLF Privana North 5BHK', assignedAgent: 'a1',
    profileStage: 4, score: 95, createdAt: '2026-01-15T12:00:00Z', updatedAt: '2026-02-20T16:00:00Z',
  },
  {
    id: 'l006', firstName: 'Kavya', lastName: 'Iyer', phone: '+919866789012',
    status: 'new', source: 'scroll-popup', budget: '₹1 Cr – ₹2 Cr', buyerStatus: 'buyer',
    currentCity: 'Bangalore', propertyInterest: 'Godrej Central',
    profileStage: 1, score: 25, createdAt: '2026-02-24T09:45:00Z', updatedAt: '2026-02-24T09:45:00Z',
  },
  {
    id: 'l007', firstName: 'Deepak', lastName: 'Malhotra', phone: '+919877890123', email: 'deepak@corp.in',
    status: 'contacted', source: 'campaign', budget: '₹2 Cr – ₹5 Cr', buyerStatus: 'investor',
    currentCity: 'Mumbai', propertyInterest: 'M3M Capital', campaignSlug: 'm3m-capital-vip',
    assignedAgent: 'a3', profileStage: 2, score: 60, createdAt: '2026-02-22T14:30:00Z', updatedAt: '2026-02-23T11:00:00Z',
  },
  {
    id: 'l008', firstName: 'Ritu', lastName: 'Agarwal', phone: '+919888901234',
    status: 'closed-lost', source: 'google-ads', budget: '₹50L – ₹1 Cr',
    assignedAgent: 'a4', profileStage: 2, score: 20,
    createdAt: '2026-02-10T09:00:00Z', updatedAt: '2026-02-18T16:00:00Z',
  },
  {
    id: 'l009', firstName: 'Sanjay', lastName: 'Patel', phone: '+919899012345', email: 'sanjay@business.com',
    status: 'new', source: 'google-ads', budget: '₹1 Cr – ₹2 Cr', buyerStatus: 'buyer',
    currentCity: 'Ahmedabad', propertyInterest: 'Godrej Emerald 3BHK',
    profileStage: 1, score: 35, createdAt: '2026-02-24T11:00:00Z', updatedAt: '2026-02-24T11:00:00Z',
    utmSource: 'google', utmMedium: 'cpc', utmCampaign: 'godrej-emerald-search',
  },
  {
    id: 'l010', firstName: 'Meena', lastName: 'Krishnan', phone: '+919800123456',
    status: 'site-visit', source: 'whatsapp', budget: '₹2 Cr – ₹5 Cr', buyerStatus: 'investor',
    currentCity: 'Chennai', propertyInterest: 'DLF Privana West 4BHK', assignedAgent: 'a2',
    profileStage: 3, score: 78, createdAt: '2026-02-19T14:00:00Z', updatedAt: '2026-02-23T16:00:00Z',
    lastContactedAt: '2026-02-23T16:00:00Z',
  },
]

export const CAMPAIGNS: Campaign[] = [
  { id: 'c1', name: 'DLF Privana — Google Search Feb', slug: 'dlf-privana-feb', platform: 'google', status: 'active', budget: 150000, spent: 87500, leads: 124, conversions: 8, cpl: 706, startDate: '2026-02-01', utmSource: 'google', utmMedium: 'cpc', utmCampaign: 'dlf-privana-feb' },
  { id: 'c2', name: 'Godrej Emerald — Meta Retargeting', slug: 'godrej-emerald-retarget', platform: 'meta', status: 'active', budget: 80000, spent: 52300, leads: 89, conversions: 5, cpl: 588, startDate: '2026-02-10', utmSource: 'facebook', utmMedium: 'social', utmCampaign: 'godrej-emerald-retarget' },
  { id: 'c3', name: 'M3M Capital VIP — Google Display', slug: 'm3m-capital-vip', platform: 'google', status: 'active', budget: 100000, spent: 41200, leads: 67, conversions: 3, cpl: 615, startDate: '2026-02-15', utmSource: 'google', utmMedium: 'display', utmCampaign: 'm3m-capital-vip' },
  { id: 'c4', name: 'Godrej Pre-Launch WhatsApp Blast', slug: 'godrej-central-wa', platform: 'whatsapp', status: 'ended', budget: 25000, spent: 25000, leads: 203, conversions: 11, cpl: 123, startDate: '2026-02-01', endDate: '2026-02-07', utmSource: 'whatsapp', utmMedium: 'message', utmCampaign: 'godrej-central-wa' },
  { id: 'c5', name: 'NCR Luxury Homes — Email Newsletter', slug: 'ncr-luxury-email', platform: 'email', status: 'paused', budget: 15000, spent: 8200, leads: 34, conversions: 2, cpl: 241, startDate: '2026-01-20', utmSource: 'email', utmMedium: 'newsletter', utmCampaign: 'ncr-luxury-jan' },
]

export const PROPERTIES_ADMIN: PropertyAdmin[] = [
  { id: 'p1', title: 'Godrej Emerald', slug: 'godrej-emerald', developer: 'godrej', status: 'active', reraNumber: 'HARERA/GGM/2024/1234', priceMin: 140, priceMax: 320, location: 'Sector 79, Gurugram', leads: 234, views: 4820, updatedAt: '2026-02-23' },
  { id: 'p2', title: 'Godrej Central', slug: 'godrej-central', developer: 'godrej', status: 'active', reraNumber: 'HARERA/GGM/2024/5678', priceMin: 180, priceMax: 450, location: 'Sector 63A, Gurugram', leads: 178, views: 3240, updatedAt: '2026-02-22' },
  { id: 'p3', title: 'DLF Privana West', slug: 'dlf-privana-west', developer: 'dlf', status: 'active', reraNumber: 'HARERA/GGM/2024/2345', priceMin: 380, priceMax: 850, location: 'Sector 76–77, Gurugram', leads: 312, views: 6100, updatedAt: '2026-02-24' },
  { id: 'p4', title: 'DLF Privana North', slug: 'dlf-privana-north', developer: 'dlf', status: 'active', reraNumber: 'HARERA/GGM/2025/0192', priceMin: 420, priceMax: 1000, location: 'Sector 77, Gurugram', leads: 198, views: 5410, updatedAt: '2026-02-24' },
  { id: 'p5', title: 'M3M Altitude', slug: 'm3m-altitude', developer: 'm3m', status: 'active', reraNumber: 'HARERA/GGM/2024/9012', priceMin: 220, priceMax: 550, location: 'Sector 65, Gurugram', leads: 145, views: 2980, updatedAt: '2026-02-21' },
  { id: 'p6', title: 'M3M Capital', slug: 'm3m-capital', developer: 'm3m', status: 'active', reraNumber: 'HARERA/GGM/2024/7834', priceMin: 280, priceMax: 700, location: 'Sector 113, Gurugram', leads: 121, views: 2450, updatedAt: '2026-02-20' },
]

export const ANALYTICS = {
  funnel: [
    { stage: 'Page Views', count: 28450, pct: 100 },
    { stage: 'Form Views', count: 4210,  pct: 14.8 },
    { stage: 'Form Starts', count: 1890, pct: 6.6 },
    { stage: 'Submitted',   count: 987,  pct: 3.5 },
    { stage: 'Leads',       count: 854,  pct: 3.0 },
    { stage: 'Site Visit',  count: 124,  pct: 0.44 },
    { stage: 'Closed',      count: 29,   pct: 0.10 },
  ],
  sourceBreakdown: [
    { source: 'Google Ads', leads: 312, pct: 36.5, cpl: 706 },
    { source: 'Meta Ads',   leads: 224, pct: 26.2, cpl: 588 },
    { source: 'Organic',    leads: 145, pct: 17.0, cpl: 0   },
    { source: 'WhatsApp',   leads: 98,  pct: 11.5, cpl: 123 },
    { source: 'Referral',   leads: 48,  pct: 5.6,  cpl: 0   },
    { source: 'Email',      leads: 27,  pct: 3.2,  cpl: 241 },
  ],
  dailyLeads: [
    { date: 'Feb 18', leads: 28 }, { date: 'Feb 19', leads: 34 }, { date: 'Feb 20', leads: 22 },
    { date: 'Feb 21', leads: 41 }, { date: 'Feb 22', leads: 38 }, { date: 'Feb 23', leads: 45 },
    { date: 'Feb 24', leads: 19 },
  ],
  kpi: {
    totalLeads: 854,
    leadsToday: 19,
    leadsThisWeek: 227,
    conversionRate: 3.4,
    avgScore: 52,
    openLeads: 142,
    sitVisitsBooked: 18,
    closedThisMonth: 8,
    revenueThisMonth: 24500000,
  },
}

// Helpers
export function getLeadById(id: string): Lead | undefined {
  return LEADS.find((l) => l.id === id)
}

export function getAgentById(id: string): Agent | undefined {
  return AGENTS.find((a) => a.id === id)
}

export function getAgentName(id?: string): string {
  if (!id) return 'Unassigned'
  return AGENTS.find((a) => a.id === id)?.name ?? 'Unknown'
}

export function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`
  if (amount >= 100000)   return `₹${(amount / 100000).toFixed(1)} L`
  return `₹${amount.toLocaleString('en-IN')}`
}

export function statusColor(status: LeadStatus): string {
  const map: Record<LeadStatus, string> = {
    'new':          'badge-new',
    'contacted':    'badge-contacted',
    'site-visit':   'badge-sitevisit',
    'negotiation':  'badge-negotiation',
    'closed-won':   'badge-closed',
    'closed-lost':  'badge-lost',
  }
  return map[status] ?? 'badge-new'
}

export function statusLabel(status: LeadStatus): string {
  const map: Record<LeadStatus, string> = {
    'new':         'New',
    'contacted':   'Contacted',
    'site-visit':  'Site Visit',
    'negotiation': 'Negotiation',
    'closed-won':  'Won',
    'closed-lost': 'Lost',
  }
  return map[status] ?? status
}
