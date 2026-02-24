/**
 * DigiSoft Nexus — A/B Test Definitions
 *
 * Each test has:
 *   - id: unique string key
 *   - splitRatio: probability of variant A (0.5 = 50/50)
 *   - variants: what each variant changes
 *   - hypothesis: what we're testing
 */

export interface ABTest {
  id: string
  splitRatio: number
  hypothesis: string
  variants: {
    A: Record<string, string>
    B: Record<string, string>
  }
}

export const AB_TESTS: Record<string, ABTest> = {
  /**
   * TEST 1: Popup headline copy
   * Hypothesis: Urgency-framed CTA vs. value-framed CTA
   */
  'popup-headline': {
    id: 'popup-headline',
    splitRatio: 0.5,
    hypothesis: 'Does urgency framing outperform value framing for lead capture?',
    variants: {
      A: {
        headline: 'Before You Leave — Get Your Free Report',
        subheadline: 'Download the Gurugram 2026 Investment ROI Forecast',
        cta: 'Send Me the Free Report',
        badge: 'Limited Time',
      },
      B: {
        headline: 'Gurugram 2026 Investment ROI Forecast',
        subheadline: 'Expert analysis of which sectors will deliver 20%+ returns',
        cta: 'Get Instant Access — Free',
        badge: 'HNI Favourite',
      },
    },
  },

  /**
   * TEST 2: Scroll popup timing
   * Hypothesis: Shorter delay = more impressions but lower quality?
   */
  'scroll-popup-timing': {
    id: 'scroll-popup-timing',
    splitRatio: 0.5,
    hypothesis: '35% scroll depth vs 50% — which produces higher conversion rate?',
    variants: {
      A: { triggerAt: '35' },  // 35% scroll depth
      B: { triggerAt: '50' },  // 50% scroll depth
    },
  },

  /**
   * TEST 3: Lead form CTA button text
   * Hypothesis: Action verbs vs. benefit statements
   */
  'lead-form-cta': {
    id: 'lead-form-cta',
    splitRatio: 0.5,
    hypothesis: 'Direct action CTA vs benefit-focused CTA',
    variants: {
      A: {
        buttonText: 'Get Free Consultation',
        buttonIcon: 'phone',
      },
      B: {
        buttonText: 'Unlock VIP Pricing',
        buttonIcon: 'lock',
      },
    },
  },

  /**
   * TEST 4: Progressive form vs. single-step form
   * Hypothesis: Progressive profiling produces higher-quality leads despite lower volume
   */
  'form-type': {
    id: 'form-type',
    splitRatio: 0.5,
    hypothesis: 'Progressive multi-step form vs. single compact form',
    variants: {
      A: { type: 'progressive' },
      B: { type: 'compact' },
    },
  },

  /**
   * TEST 5: Exit-intent popup appearance
   * Hypothesis: Lead magnet selection popup vs. simple form popup
   */
  'exit-intent-type': {
    id: 'exit-intent-type',
    splitRatio: 0.5,
    hypothesis: 'Lead magnet chooser vs. simple phone-first form',
    variants: {
      A: { type: 'lead-magnet-chooser' },
      B: { type: 'phone-first-form' },
    },
  },
}
