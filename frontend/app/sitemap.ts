import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://digisoftnexus.com'
  const now = new Date()

  const staticRoutes = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/properties`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/projects/godrej-properties`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/projects/dlf`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/projects/m3m`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/gurugram`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/delhi-ncr`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/noida`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/luxury`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/affordable`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/pre-launch`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/new-launch`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/calculator/emi`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/calculator/roi`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/calculator/stamp-duty`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/blog`, priority: 0.7, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/about`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/contact`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/why-us`, priority: 0.6, changeFrequency: 'monthly' as const },
  ]

  // TODO: Add dynamic property + blog slugs from API

  return staticRoutes.map(route => ({
    url: route.url,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
