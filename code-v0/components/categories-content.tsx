"use client"

import { useState } from "react"
import { FilterIcon, GridIcon, ListIcon, FolderIcon, EditIcon, TrashIcon } from "./icons"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function CategoriesContent() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [itemsPerPage, setItemsPerPage] = useState("10")

  return (
    <main className="flex-1 overflow-y-auto bg-white">
      <div className="mx-auto max-w-[1400px] p-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <span>Категории</span>
          <span className="text-gray-400">{">"}</span>
          <span>Список</span>
        </div>

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-900">Категории</h1>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">Создать</Button>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex items-center justify-end gap-3">
          <div className="relative">
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <FilterIcon className="h-4 w-4" />
              <span className="min-w-[20px] text-center">0</span>
            </button>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-gray-300">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}
            >
              <GridIcon className="h-4 w-4 text-gray-700" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"}`}
            >
              <ListIcon className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="w-12 px-4 py-3">
                  <Checkbox />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <span>Заголовок</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Подкатегории</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Статьи</th>
                <th className="w-32 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4">
                  <Checkbox />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <FolderIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-900">Общее</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">0</td>
                <td className="px-4 py-4 text-sm text-gray-900">1</td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <FolderIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-blue-50 rounded">
                      <EditIcon className="h-4 w-4 text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded">
                      <TrashIcon className="h-4 w-4 text-red-600" />
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
