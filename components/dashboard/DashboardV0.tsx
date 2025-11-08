"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"

interface DashboardStats {
  monthlyResponses: number
  weeklyResponses: number
  dailyResponses: number
  agentsCount: number
  monthlyChange: number
}

export function DashboardV0() {
  const [stats, setStats] = useState<DashboardStats>({
    monthlyResponses: 0,
    weeklyResponses: 0,
    dailyResponses: 0,
    agentsCount: 0,
    monthlyChange: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard')
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats')
        }
        const result = await response.json()
        
        if (result.success && result.data) {
          const data = result.data
          // Маппинг данных из API на формат компонента
          setStats({
            monthlyResponses: data.monthlyResponses || data.totalResponses || 0,
            weeklyResponses: data.weeklyResponses || 0,
            dailyResponses: data.dailyResponses || 0,
            agentsCount: data.agentsCount || data.totalAgents || 0,
            monthlyChange: data.monthlyChange || 0,
          })
        } else {
          // Fallback на временные данные при ошибке
          setStats({
            monthlyResponses: 0,
            weeklyResponses: 0,
            dailyResponses: 0,
            agentsCount: 0,
            monthlyChange: 0,
          })
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
        // Fallback на временные данные при ошибке
        setStats({
          monthlyResponses: 0,
          weeklyResponses: 0,
          dailyResponses: 0,
          agentsCount: 0,
          monthlyChange: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="p-8">Загрузка...</div>
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="mx-auto max-w-[1400px] p-8">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-2">Ответы ИИ за этот месяц</div>
            <div className="text-4xl font-bold mb-2">{stats.monthlyResponses}</div>
            <div className="flex items-center gap-2 text-sm text-blue-600 mb-3">
              <span>{stats.monthlyChange > 0 ? '+' : ''}{stats.monthlyChange}% к прошлому месяцу</span>
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 12L8 4M8 4L4 8M8 4L12 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <svg className="w-full h-12" viewBox="0 0 200 40" preserveAspectRatio="none">
              <polyline points="0,35 50,30 100,25 150,20 200,30" fill="none" stroke="#3b82f6" strokeWidth="2" />
            </svg>
          </Card>

          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-2">Ответы ИИ за последние 7 дней</div>
            <div className="text-4xl font-bold mb-2">{stats.weeklyResponses}</div>
            <div className="flex items-center gap-2 text-sm text-blue-600 mb-3">
              <span>Последние 7 дней</span>
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="4" width="10" height="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M3 6h10M6 2v3M10 2v3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <svg className="w-full h-12" viewBox="0 0 200 40" preserveAspectRatio="none">
              <polyline
                points="0,38 30,32 60,28 90,22 120,18 150,15 180,20 200,25"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />
            </svg>
          </Card>

          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-2">Ответы ИИ сегодня</div>
            <div className="text-4xl font-bold mb-2">{stats.dailyResponses}</div>
            <div className="h-8 mb-3"></div>
            <svg className="w-full h-12" viewBox="0 0 200 40" preserveAspectRatio="none">
              <line x1="0" y1="20" x2="200" y2="20" stroke="#3b82f6" strokeWidth="2" />
            </svg>
          </Card>

          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-2">Агенты</div>
            <div className="text-4xl font-bold mb-2">{stats.agentsCount}</div>
            <div className="flex items-center gap-2 text-sm text-blue-600 mb-3">
              <span>Всего агентов</span>
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <circle cx="5" cy="7" r="1" fill="currentColor" />
                <circle cx="11" cy="7" r="1" fill="currentColor" />
                <path
                  d="M5 10c1 1 2 1.5 3 1.5s2-.5 3-1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <svg className="w-full h-12" viewBox="0 0 200 40" preserveAspectRatio="none">
              <line x1="0" y1="20" x2="200" y2="20" stroke="#3b82f6" strokeWidth="2" />
            </svg>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Ответы ИИ за этот месяц</h3>
            <div className="relative h-[300px]">
              <svg className="w-full h-full" viewBox="0 0 600 300" preserveAspectRatio="none">
                <text x="10" y="20" className="text-xs fill-gray-400">20 000</text>
                <text x="10" y="80" className="text-xs fill-gray-400">15 000</text>
                <text x="10" y="140" className="text-xs fill-gray-400">10 000</text>
                <text x="10" y="200" className="text-xs fill-gray-400">5 000</text>
                <text x="10" y="260" className="text-xs fill-gray-400">0</text>
                <polyline
                  points="60,220 120,180 180,140 240,100 300,80 360,60 420,240 480,280"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                <circle cx="60" cy="220" r="3" fill="#3b82f6" />
                <circle cx="120" cy="180" r="3" fill="#3b82f6" />
                <circle cx="180" cy="140" r="3" fill="#3b82f6" />
                <circle cx="240" cy="100" r="3" fill="#3b82f6" />
                <circle cx="300" cy="80" r="3" fill="#3b82f6" />
                <circle cx="360" cy="60" r="3" fill="#3b82f6" />
                <circle cx="420" cy="240" r="3" fill="#3b82f6" />
                <circle cx="480" cy="280" r="3" fill="#3b82f6" />
                <text x="50" y="295" className="text-xs fill-gray-400">июнь 2025</text>
                <text x="120" y="295" className="text-xs fill-gray-400">июль 2025</text>
                <text x="180" y="295" className="text-xs fill-gray-400">август 2025</text>
                <text x="240" y="295" className="text-xs fill-gray-400">сентябрь 2025</text>
                <text x="310" y="295" className="text-xs fill-gray-400">октябрь 2025</text>
                <text x="400" y="295" className="text-xs fill-gray-400">ноябрь 2025</text>
              </svg>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Активность агентов</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    АИ
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">АИ ассистент</div>
                    <div className="text-sm text-gray-500">924 ответа</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">Активен</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

