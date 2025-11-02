'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DemoPage() {
  const router = useRouter()

  useEffect(() => {
    // Автоматически перенаправляем на главную страницу
    router.push('/')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Демо режим активирован</h1>
        <p className="text-gray-600">Перенаправление на главную страницу...</p>
      </div>
    </div>
  )
}
