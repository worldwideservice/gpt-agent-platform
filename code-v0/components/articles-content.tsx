"use client"

import { useState } from "react"
import Link from "next/link"
import { SearchIcon, FilterIcon, GridIcon, ListIcon, EditIcon, TrashIcon, XIcon } from "./icons"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function ArticlesContent() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [itemsPerPage, setItemsPerPage] = useState("10")
  const [activeFilters, setActiveFilters] = useState([{ label: "Категория: Общее", value: "category:general" }])

  const removeFilter = (value: string) => {
    setActiveFilters(activeFilters.filter((f) => f.value !== value))
  }

  const clearAllFilters = () => {
    setActiveFilters([])
  }

  return (
    <main className="flex-1 overflow-y-auto bg-white">
      <div className="mx-auto max-w-[1400px] p-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <span>Статьи</span>
          <span className="text-gray-400">{">"}</span>
          <span>Список</span>
        </div>

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-900">Статьи</h1>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">Создать</Button>
        </div>

        {/* Search and View Toolbar */}
        <div className="mb-4 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск"
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <FilterIcon className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1 rounded-lg border border-gray-300">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"}`}
              >
                <ListIcon className="h-4 w-4 text-gray-700" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}
              >
                <GridIcon className="h-4 w-4 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Активные фильтры</span>
              {activeFilters.map((filter) => (
                <div
                  key={filter.value}
                  className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700"
                >
                  <span>{filter.label}</span>
                  <button onClick={() => removeFilter(filter.value)} className="hover:text-blue-900">
                    <XIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={clearAllFilters} className="text-sm text-gray-500 hover:text-gray-700">
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Table */}
        <div className="rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="w-12 px-4 py-3">
                  <Checkbox />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  <button className="flex items-center gap-2 hover:text-gray-900">
                    <span>ID</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Заголовок</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Активно</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Категории</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Связанные статьи</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  <button className="flex items-center gap-2 hover:text-gray-900">
                    <span>Дата создания</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </th>
                <th className="w-48 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4">
                  <Checkbox />
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">4285</td>
                <td className="px-4 py-4 text-sm text-gray-900">Test Article for Edit</td>
                <td className="px-4 py-4">
                  <Switch defaultChecked />
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    Общее
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900"></td>
                <td className="px-4 py-4 text-sm text-gray-600">ноя 7, 2025 12:41:36</td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href="/articles/4285/edit"
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <EditIcon className="h-4 w-4" />
                      <span>Редактировать</span>
                    </Link>
                    <button className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700">
                      <TrashIcon className="h-4 w-4" />
                      <span>Удалить</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div>Показано с 1 по 1 из 1</div>
          <div className="flex items-center gap-2">
            <span>на страницу</span>
            <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </main>
  )
}
