'use client'

import { useEffect, useState } from 'react'
// @ts-ignore - swagger-ui-react types issue
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null)

  useEffect(() => {
    // Загружаем спецификацию OpenAPI
    fetch('/api/docs')
      .then(res => res.json())
      .then(setSpec)
      .catch(console.error)
  }, [])

  if (!spec) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            API Документация
          </h1>
          <p className="text-slate-600">
            Интерактивная документация GPT Agent Platform API
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <SwaggerUI spec={spec} />
        </div>
      </div>
    </div>
  )
}
