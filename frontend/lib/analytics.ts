/**
 * DigiSoft Nexus — Analytics Helpers
 *
 * Thin wrapper around Google Analytics 4 (gtag) + custom event bus.
 * All events go to GA4 when NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 * All events also fire on the window event bus for any listener.
 *
 * Conversion Funnel:
 *   1. page_view
 *   2. property_viewed
 *   3. form_view (lead form appeared)
 *   4. form_start (user typed in form)
 *   5. form_submit (submitted)
 *   6. lead_captured (server confirmed)
 *   7. whatsapp_click
 *   8. call_click
 *   9. site_visit_requested
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

type EventParams = Record<string, string | number | boolean | undefined>

function gtag(event: string, params?: EventParams) {
  if (typeof window === 'undefined') return
  if (window.gtag) {
    window.gtag('event', event, params)
  }
}

// ─── Property Events ────────────────────────────────────────

export function trackPropertyView(slug: string, title: string, price: number) {
  gtag('property_view', { property_slug: slug, property_title: title, price })
}

export function trackPropertySearch(filters: Record<string, string>) {
  gtag('property_search', { ...filters })
}

// ─── Lead Form Events ────────────────────────────────────────

export function trackFormView(source: string, propertySlug?: string) {
  gtag('form_view', { form_source: source, property_slug: propertySlug })
}

export function trackFormStart(source: string) {
  gtag('form_start', { form_source: source })
}

export function trackFormSubmit(source: string, stage?: number) {
  gtag('form_submit', { form_source: source, stage })
}

export function trackLeadCaptured(source: string, campaignSlug?: string) {
  gtag('lead_captured', {
    form_source: source,
    campaign_slug: campaignSlug,
    value: 1,
    currency: 'INR',
  })
}

// ─── Popup Events ────────────────────────────────────────────

export function trackPopupShown(trigger: string, type: string) {
  gtag('popup_shown', { trigger, popup_type: type })
}

export function trackPopupClosed(trigger: string, type: string) {
  gtag('popup_closed', { trigger, popup_type: type })
}

export function trackPopupConverted(trigger: string) {
  gtag('popup_converted', { trigger })
}

// ─── CTA Events ──────────────────────────────────────────────

export function trackWhatsAppClick(propertySlug?: string) {
  gtag('whatsapp_click', { property_slug: propertySlug })
}

export function trackCallClick(propertySlug?: string) {
  gtag('call_click', { property_slug: propertySlug })
}

export function trackBrochureDownload(propertySlug?: string) {
  gtag('brochure_download', { property_slug: propertySlug })
}

export function trackSiteVisitRequest(propertySlug?: string) {
  gtag('site_visit_request', { property_slug: propertySlug })
}

// ─── A/B Test Events ─────────────────────────────────────────

export function trackABImpression(testId: string, variant: 'A' | 'B') {
  gtag('ab_impression', { test_id: testId, variant })
}

export function trackABConversion(testId: string, variant: 'A' | 'B') {
  gtag('ab_conversion', { test_id: testId, variant })
}

// ─── Scroll Events ───────────────────────────────────────────

export function trackScrollDepth(percentage: number) {
  gtag('scroll_depth', { percentage })
}

// ─── Listen to internal event bus ────────────────────────────

export function initAnalyticsListeners() {
  if (typeof window === 'undefined') return

  window.addEventListener('digisoft:lead_captured', ((e: CustomEvent) => {
    const { source, campaign, stage, serverSuccess } = e.detail
    trackLeadCaptured(source || 'unknown', campaign)
  }) as EventListener)

  window.addEventListener('digisoft:popup_triggered', ((e: CustomEvent) => {
    const { source, config } = e.detail
    trackPopupShown(source, config.type)
  }) as EventListener)

  window.addEventListener('digisoft:ab_event', ((e: CustomEvent) => {
    const { testId, variant, event } = e.detail
    if (event === 'impression') trackABImpression(testId, variant)
    if (event === 'conversion') trackABConversion(testId, variant)
  }) as EventListener)
}
