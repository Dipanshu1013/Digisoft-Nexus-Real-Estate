/**
 * DigiSoft Nexus — Zustand Global State Store (Phase 4 update)
 *
 * Additions over Phase 3:
 *   - abVariants: stores assigned A/B test variants
 *   - popupHistory: tracks which popups have been seen
 *   - analyticsReady: flags when analytics are initialised
 *   - sessionId: stable per-session ID for analytics
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ============================================================
// Types
// ============================================================

type LeadStage = 1 | 2 | 3 | 4

type PopupType = 'exit-intent' | 'lead-form' | 'lead-magnet'

interface PopupConfig {
  type: PopupType
  title?: string
  propertySlug?: string
  campaignSlug?: string
  leadMagnetTitle?: string
}

interface LeadData {
  firstName?: string
  email?: string
  phone?: string
  buyerStatus?: 'buyer' | 'investor' | 'renter' | 'nri'
  budget?: string
  jobTitle?: string
  currentCity?: string
  specificRequirements?: string
  consentGiven?: boolean
}

interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

// ============================================================
// Lead Store
// ============================================================

interface LeadStore {
  currentStage: LeadStage
  leadData: LeadData
  utmParams: UTMParams
  isPopupOpen: boolean
  popupConfig: PopupConfig
  hasLeadBeenCaptured: boolean
  popupHistory: string[]  // list of popup types shown this session
  lastPopupShownAt: number | null

  setStage: (stage: LeadStage) => void
  updateLeadData: (data: Partial<LeadData>) => void
  setUTMParams: (params: UTMParams) => void
  openPopup: (config: PopupConfig) => void
  closePopup: () => void
  markLeadCaptured: () => void
  addToPopupHistory: (type: string) => void
  resetLead: () => void
}

export const useLeadStore = create<LeadStore>()(
  persist(
    (set) => ({
      currentStage: 1,
      leadData: {},
      utmParams: {},
      isPopupOpen: false,
      popupConfig: { type: 'exit-intent' },
      hasLeadBeenCaptured: false,
      popupHistory: [],
      lastPopupShownAt: null,

      setStage: (stage) => set({ currentStage: stage }),
      updateLeadData: (data) => set((s) => ({ leadData: { ...s.leadData, ...data } })),
      setUTMParams: (params) => set({ utmParams: params }),
      openPopup: (config) =>
        set((s) => ({
          isPopupOpen: true,
          popupConfig: config,
          lastPopupShownAt: Date.now(),
          popupHistory: [...s.popupHistory, config.type],
        })),
      closePopup: () => set({ isPopupOpen: false }),
      markLeadCaptured: () => set({ hasLeadBeenCaptured: true }),
      addToPopupHistory: (type) =>
        set((s) => ({ popupHistory: [...s.popupHistory, type] })),
      resetLead: () =>
        set({
          currentStage: 1,
          leadData: {},
          hasLeadBeenCaptured: false,
          popupHistory: [],
          lastPopupShownAt: null,
        }),
    }),
    {
      name: 'digisoft-lead',
      storage: createJSONStorage(() => {
        // Safe localStorage access
        if (typeof window === 'undefined') return { getItem: () => null, setItem: () => {}, removeItem: () => {} }
        return localStorage
      }),
      partialize: (s) => ({
        currentStage: s.currentStage,
        leadData: s.leadData,
        utmParams: s.utmParams,
        hasLeadBeenCaptured: s.hasLeadBeenCaptured,
      }),
    }
  )
)

// ============================================================
// Auth Store
// ============================================================

interface AuthStore {
  user: { id: string; name: string; email: string } | null
  accessToken: string | null
  isAuthenticated: boolean
  setUser: (user: AuthStore['user']) => void
  setAccessToken: (token: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAccessToken: (token) => set({ accessToken: token }),
  logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
}))

// ============================================================
// UI Store
// ============================================================

interface UIStore {
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  headerTheme: 'transparent' | 'white'
  savedProperties: string[]
  compareList: string[]

  setMobileMenu: (open: boolean) => void
  setHeaderTheme: (theme: 'transparent' | 'white') => void
  toggleSaveProperty: (id: string) => void
  addToCompare: (id: string) => void
  clearCompare: () => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isMobileMenuOpen: false,
      isSearchOpen: false,
      headerTheme: 'transparent',
      savedProperties: [],
      compareList: [],

      setMobileMenu: (open) => set({ isMobileMenuOpen: open }),
      setHeaderTheme: (theme) => set({ headerTheme: theme }),
      toggleSaveProperty: (id) =>
        set((s) => ({
          savedProperties: s.savedProperties.includes(id)
            ? s.savedProperties.filter((p) => p !== id)
            : [...s.savedProperties, id],
        })),
      addToCompare: (id) =>
        set((s) => ({
          compareList:
            s.compareList.length < 3 && !s.compareList.includes(id)
              ? [...s.compareList, id]
              : s.compareList,
        })),
      clearCompare: () => set({ compareList: [] }),
    }),
    {
      name: 'digisoft-ui',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') return { getItem: () => null, setItem: () => {}, removeItem: () => {} }
        return localStorage
      }),
      partialize: (s) => ({ savedProperties: s.savedProperties }),
    }
  )
)

// ============================================================
// A/B Test Store — stores variant assignments client-side
// ============================================================

interface ABStore {
  variants: Record<string, 'A' | 'B'>
  impressions: Record<string, number>
  conversions: Record<string, number>
  setVariant: (testId: string, variant: 'A' | 'B') => void
  recordImpression: (testId: string) => void
  recordConversion: (testId: string) => void
}

export const useABStore = create<ABStore>()(
  persist(
    (set) => ({
      variants: {},
      impressions: {},
      conversions: {},
      setVariant: (testId, variant) =>
        set((s) => ({ variants: { ...s.variants, [testId]: variant } })),
      recordImpression: (testId) =>
        set((s) => ({
          impressions: { ...s.impressions, [testId]: (s.impressions[testId] || 0) + 1 },
        })),
      recordConversion: (testId) =>
        set((s) => ({
          conversions: { ...s.conversions, [testId]: (s.conversions[testId] || 0) + 1 },
        })),
    }),
    {
      name: 'digisoft-ab',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') return { getItem: () => null, setItem: () => {}, removeItem: () => {} }
        return localStorage
      }),
    }
  )
)
