import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'TON 18 - create infinity',
  description: 'Обучаемый виртуальный сотрудник для автоматизации общения с клиентами',
  manifest: '/manifest.json',
  metadataBase: new URL(process.env.NODE_ENV === 'production'
    ? 'https://gpt-agent-kwid-1i1j7zlgl-world-wide-services-62780b79.vercel.app'
    : 'http://localhost:3000'
  ),
  appleWebApp: {
    capable: false,
    statusBarStyle: 'default',
    title: 'TON 18',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'TON 18',
    title: 'TON 18 - create infinity',
    description: 'Обучаемый виртуальный сотрудник для автоматизации общения с клиентами',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TON 18 Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TON 18 - create infinity',
    description: 'Обучаемый виртуальный сотрудник для автоматизации общения с клиентами',
    images: ['/og-image.png'],
  },
  robots: {
 index: true,
 follow: true,
 googleBot: {
 index: true,
 follow: true,
 'max-video-preview': -1,
 'max-image-preview': 'large',
 'max-snippet': -1,
 },
 },
 verification: {
 google: 'your-google-site-verification-code',
 },
}

export const viewport: Viewport = {
 width: 'device-width',
 initialScale: 1,
 maximumScale: 5,
 themeColor: '#3b82f6',
}

interface RootLayoutProps {
 children: React.ReactNode
 params?: Promise<{ locale?: string }>
}

const RootLayout = async ({ children, params }: RootLayoutProps) => {
 // Since we don't use [locale] segment, always use default locale 'ru'
 const locale = 'ru'
 
 // Temporarily disable next-intl to isolate the issue
 // Will re-enable once the base layout works
 // Используем unknown вместо any согласно Context7 best practices
 const messages: Record<string, unknown> = {}
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'TON 18',
    description: 'Обучаемый виртуальный сотрудник для автоматизации общения с клиентами',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'RUB',
    },
    creator: {
      '@type': 'Organization',
      name: 'TON 18',
    },
 featureList: [
 'AI-powered customer communication',
 'CRM integration',
 'Knowledge base management',
 'Automated workflows',
 'Multi-language support',
 ],
 screenshot: '/screenshot-desktop.png',
 softwareVersion: '1.0.5',
 }

 return (
 <html lang={locale} className="light" suppressHydrationWarning>
 <head>
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
 />
 </head>
 <body className={inter.className}>
 {children}
 <Analytics />
 </body>
 </html>
 )
}
export default RootLayout
