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
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyboard = (event: KeyboardEvent) => {
      // Escape - close search
      if (event.key === 'Escape') {
        setIsOpen(false)
        setQuery('')
        setSelectedIndex(-1)
        return
      }

      // Cmd/Ctrl+K - focus search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        return
      }

      // If search is not open, don't handle other keys
      if (!isOpen || results.length === 0) return

      // Arrow Down - move down
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
      }

      // Arrow Up - move up
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
      }

      // Enter - navigate to selected
      if (event.key === 'Enter' && selectedIndex >= 0 && selectedIndex < results.length) {
        event.preventDefault()
        const selectedResult = results[selectedIndex]
        if (selectedResult) {
          window.location.href = selectedResult.url
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyboard)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyboard)
    }
  }, [isOpen, results, selectedIndex])

  useEffect(() => {
    // Reset selected index when query changes
    setSelectedIndex(-1)

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
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Глобальный поиск (Cmd+K)"
          className="h-10 w-full rounded-lg border-gray-200 bg-gray-50 pl-10 pr-4 text-sm transition-colors focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:focus:bg-gray-900"
          aria-label="Глобальный поиск"
          autoComplete="off"
        />
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
      </div>

      {isOpen && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="max-h-80 overflow-y-auto p-2">
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-gray-500">Поиск...</div>
            ) : results.length > 0 ? (
              results.map((result, index) => (
                <a
                  key={result.id}
                  href={result.url}
                  className={cn(
                    'block rounded-md px-4 py-3 text-sm transition-colors',
                    index === selectedIndex
                      ? 'bg-primary/10 dark:bg-primary/20'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                  onMouseEnter={() => setSelectedIndex(index)}
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
