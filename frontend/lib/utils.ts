// ============================================================
// DigiSoft Nexus — Utility Functions
// ============================================================

/**
 * Format Indian price with ₹ symbol and Cr/L suffix
 */
export function formatPrice(priceInRupees: number): string {
  if (priceInRupees >= 10000000) {
    const cr = priceInRupees / 10000000
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`
  }
  if (priceInRupees >= 100000) {
    const lac = priceInRupees / 100000
    return `₹${lac % 1 === 0 ? lac.toFixed(0) : lac.toFixed(1)} L`
  }
  return `₹${priceInRupees.toLocaleString('en-IN')}`
}

/**
 * Format area in sq ft
 */
export function formatArea(sqft: number): string {
  return `${sqft.toLocaleString('en-IN')} sq ft`
}

/**
 * Format date to "DD Month YYYY"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}

/**
 * Calculate EMI
 */
export function calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
  const r = annualRate / 100 / 12
  if (r === 0) return principal / tenureMonths
  const emi = (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1)
  return Math.round(emi)
}

/**
 * Get possession status label
 */
export function getPossessionLabel(status: string): string {
  const labels: Record<string, string> = {
    'ready-to-move': 'Ready to Move',
    'under-construction': 'Under Construction',
    'new-launch': 'New Launch',
    'pre-launch': 'Pre-Launch',
  }
  return labels[status] || status
}

/**
 * Truncate text to n words
 */
export function truncateWords(text: string, wordCount: number): string {
  const words = text.split(' ')
  if (words.length <= wordCount) return text
  return words.slice(0, wordCount).join(' ') + '...'
}

/**
 * Get UTM params from URL search params
 */
export function extractUTMParams(searchParams: URLSearchParams) {
  return {
    utm_source: searchParams.get('utm_source') || '',
    utm_medium: searchParams.get('utm_medium') || '',
    utm_campaign: searchParams.get('utm_campaign') || '',
    utm_content: searchParams.get('utm_content') || '',
    utm_term: searchParams.get('utm_term') || '',
  }
}

/**
 * Get stored UTM from localStorage
 */
export function getStoredUTM(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem('digisoft_utm')
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

/**
 * Store UTM to localStorage + cookie
 */
export function storeUTM(utmParams: Record<string, string>): void {
  if (typeof window === 'undefined') return
  const hasValues = Object.values(utmParams).some(Boolean)
  if (!hasValues) return
  localStorage.setItem('digisoft_utm', JSON.stringify(utmParams))
  document.cookie = `digisoft_utm=${encodeURIComponent(JSON.stringify(utmParams))};path=/;max-age=2592000;SameSite=Lax`
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Generate a star rating string
 */
export function starRating(rating: number): string {
  return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '')
}
