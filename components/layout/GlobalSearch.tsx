'use client'

import { useState, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  title: string
  type: 'agent' | 'article' | 'setting'
  url: string
}

export function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        setQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length > 0) {
        setIsLoading(true)
        setIsOpen(true)

        // TODO: Implement actual search API call
        // For now, returning empty results
        try {
          // const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
          // const data = await response.json()
          // setResults(data.results)
          setResults([])
        } catch (error) {
          console.error('Search error:', error)
          setResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Глобальный поиск"
          className="h-10 w-full rounded-lg border-gray-200 bg-gray-50 pl-10 pr-4 text-sm transition-colors focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:focus:bg-gray-900"
          aria-label="Глобальный поиск"
        />
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
      </div>

      {isOpen && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="max-h-80 overflow-y-auto p-2">
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-gray-500">Поиск...</div>
            ) : results.length > 0 ? (
              results.map((result) => (
                <a
                  key={result.id}
                  href={result.url}
                  className="block rounded-md px-4 py-3 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="font-medium text-gray-900 dark:text-gray-50">{result.title}</div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{result.type}</div>
                </a>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">Ничего не найдено.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
