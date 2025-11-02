import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'], display: 'swap' })

export const metadata: Metadata = {
  title: 'AI Agent Platform',
  description: 'Минимальная стартовая сборка с Supabase и Kommo.',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ru">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  )
}

export default RootLayout
