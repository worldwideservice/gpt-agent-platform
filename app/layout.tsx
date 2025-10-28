import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'

import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'AI Agent Platform - Управление ИИ-агентами',
  description: 'Платформа для управления AI-агентами, интеграциями и базой знаний',
}

interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="min-h-screen">
          <Sidebar />
          <Header />
          <main className="ml-64 pt-16">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}

export default RootLayout

