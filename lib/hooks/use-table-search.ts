import { useState, useMemo } from 'react'

interface UseTableSearchOptions<T> {
  items: T[]
  searchFields: (keyof T)[]
}

export function useTableSearch<T extends Record<string, any>>({
  items,
  searchFields,
}: UseTableSearchOptions<T>) {
  const [search, setSearch] = useState('')

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items

    const searchLower = search.toLowerCase()
    return items.filter((item) =>
      searchFields.some((field) => {
        const value = item[field]
        return value && String(value).toLowerCase().includes(searchLower)
      })
    )
  }, [items, search, searchFields])

  return {
    search,
    setSearch,
    filteredItems,
  }
}
