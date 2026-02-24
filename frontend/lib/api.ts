import axios from 'axios'
import type { ApiResponse, PaginatedResponse, CapturedLead, Property } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,       // Send cookies (refresh token)
  timeout: 15000,
})

// Attach access token from memory/store to each request
apiClient.interceptors.request.use((config) => {
  // Access token is stored in-memory via Zustand (not localStorage for XSS protection)
  const { accessToken } = (() => {
    try {
      return (window as any).__digisoft_auth || { accessToken: null }
    } catch {
      return { accessToken: null }
    }
  })()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// ==========================================
// LEAD APIs
// ==========================================
export const leadApi = {
  capture: async (data: Partial<CapturedLead>): Promise<ApiResponse<{ id: string }>> => {
    const res = await apiClient.post('/leads/capture/', data)
    return res.data
  },

  updateStage: async (
    leadId: string,
    data: Partial<CapturedLead>
  ): Promise<ApiResponse<null>> => {
    const res = await apiClient.patch(`/leads/${leadId}/update-stage/`, data)
    return res.data
  },
}

// ==========================================
// PROPERTY APIs
// ==========================================
export const propertyApi = {
  list: async (params?: {
    city?: string
    developer?: string
    minPrice?: number
    maxPrice?: number
    bhk?: string
    propertyType?: string
    possessionStatus?: string
    page?: number
    pageSize?: number
    search?: string
  }): Promise<PaginatedResponse<Property>> => {
    const res = await apiClient.get('/properties/', { params })
    return res.data
  },

  detail: async (slug: string): Promise<Property> => {
    const res = await apiClient.get(`/properties/${slug}/`)
    return res.data
  },

  featured: async (): Promise<Property[]> => {
    const res = await apiClient.get('/properties/featured/')
    return res.data
  },

  byDeveloper: async (developerSlug: string): Promise<Property[]> => {
    const res = await apiClient.get(`/properties/developer/${developerSlug}/`)
    return res.data
  },
}

// ==========================================
// CAMPAIGN APIs
// ==========================================
export const campaignApi = {
  detail: async (slug: string) => {
    const res = await apiClient.get(`/campaigns/${slug}/`)
    return res.data
  },

  trackClick: async (slug: string, meta: { ip?: string; userAgent?: string }) => {
    const res = await apiClient.post(`/campaigns/${slug}/click/`, meta)
    return res.data
  },
}

// ==========================================
// BLOG APIs
// ==========================================
export const blogApi = {
  list: async (params?: {
    category?: string
    page?: number
    pageSize?: number
  }): Promise<PaginatedResponse<any>> => {
    const res = await apiClient.get('/blog/', { params })
    return res.data
  },

  detail: async (slug: string): Promise<any> => {
    const res = await apiClient.get(`/blog/${slug}/`)
    return res.data
  },

  featured: async (): Promise<any[]> => {
    const res = await apiClient.get('/blog/featured/')
    return res.data
  },
}

// ==========================================
// CALCULATOR APIs
// ==========================================
export const calculatorApi = {
  stampDuty: async (params: { state: string; price: number; isFirstTime?: boolean }) => {
    const res = await apiClient.post('/calculators/stamp-duty/', params)
    return res.data
  },
}
