import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return ['/', '/login', '/register', '/workspace'].map((path, index) => ({
    url: `${baseUrl}${path === '/' ? '' : path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: index === 0 ? 1 : path === '/workspace' ? 0.8 : 0.6,
  }))
}
