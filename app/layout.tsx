import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'

import { AppProviders } from '@/components/AppProviders'

import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'GPT Agent - Trainable virtual employee',
  description: 'Обучаемый виртуальный сотрудник для автоматизации общения с клиентами',
  manifest: '/manifest.json',
  metadataBase: new URL(process.env.NODE_ENV === 'production'
    ? 'https://gpt-agent-kwid-1i1j7zlgl-world-wide-services-62780b79.vercel.app'
    : 'http://localhost:3000'
  ),
  appleWebApp: {
    capable: false,
    statusBarStyle: 'default',
    title: 'GPT Agent',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'GPT Agent Platform',
    title: 'GPT Agent - Trainable virtual employee',
    description: 'Обучаемый виртуальный сотрудник для автоматизации общения с клиентами',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GPT Agent Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GPT Agent - Trainable virtual employee',
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
  
  // Enable static rendering by setting request locale
  try {
    setRequestLocale(locale)
  } catch (error) {
    // Ignore if locale already set or if setRequestLocale is not available
  }
  
  // Safe getMessages with error handling
  let messages = {}
  try {
    // Try to get messages through next-intl API first
    messages = await getMessages({ locale })
  } catch (error) {
    console.error('Failed to load messages via getMessages:', error)
    // Fallback: direct import of messages file
    try {
      const messagesModule = await import(`@/messages/${locale}.json`)
      messages = messagesModule.default || {}
    } catch (importError) {
      console.error('Failed to import messages file directly:', importError)
      // Last resort: return empty object
      messages = {}
    }
  }
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'GPT Agent Platform',
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
      name: 'KWID',
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
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default RootLayout