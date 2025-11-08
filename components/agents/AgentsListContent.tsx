"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { EditIcon, TrashIcon, SearchIcon, ListIcon } from "@/components/icons"

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

export function AgentsListContent() {
  const params = useParams()
  const tenantId = params?.tenantId as string
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null)
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: "АИ ассистент",
      active: true,
      model: "OpenAI GPT-5",
    },
  ])

  // TODO: Интегрировать с API /api/agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        // const response = await fetch(`/api/agents?tenantId=${tenantId}`)
        // const data = await response.json()
        // setAgents(data)
      } catch (error) {
        console.error("Failed to fetch agents:", error)
      }
    }
    if (tenantId) {
      fetchAgents()
    }
  }, [tenantId])

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="mx-auto max-w-[1400px] p-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <Link href={`/manage/${tenantId}/ai-agents`} className="hover:text-gray-700">
            Агенты ИИ
          </Link>
          <span className="text-gray-400">{">"}</span>
          <span>Список</span>
        </div>

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-900">Агенты ИИ</h1>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">Создать</Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-4 flex items-center justify-end gap-3">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск"
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50">
            <ListIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="w-12 px-6 py-3">
                  <Checkbox />
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Название</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Активно</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Модель ИИ</th>
                <th className="w-48 px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Checkbox
                      checked={selectedAgent === agent.id}
                      onCheckedChange={(checked) => setSelectedAgent(checked ? agent.id : null)}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{agent.name}</td>
                  <td className="px-6 py-4">
                    <Switch checked={agent.active} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{agent.model}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <Link
                        href={`/manage/${tenantId}/ai-agents/${agent.id}/edit`}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <EditIcon className="h-4 w-4" />
                        Изменить
                      </Link>
                      <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                        <CopyIcon className="h-4 w-4" />
                        Копировать
                      </button>
                      <button className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700">
                        <TrashIcon className="h-4 w-4" />
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            <div className="text-sm text-gray-600">Показано с 1 по 1 из 1</div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">на страницу</span>
              <Select defaultValue="10">
                <SelectTrigger className="w-20">
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
      </div>
    </div>
  )
}
