import { Bot, MessageSquare, Calendar, Activity } from 'lucide-react'

import { StatCard } from '@/components/dashboard/StatCard'
import type { DashboardStats } from '@/types'

const getDashboardStats = async (): Promise<DashboardStats> => {
  // В реальном приложении здесь будет запрос к API
  return {
    monthlyResponses: 45230,
    monthlyChange: 12.5,
    weeklyResponses: 10458,
    todayResponses: 1247,
    totalAgents: 8,
  }
}

const DashboardPage = async () => {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Инфопанель</h1>
          <p className="text-gray-600 mt-1">
            Обзор активности ИИ-агентов и системы
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('ru-RU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ответы ИИ за месяц"
          value={stats.monthlyResponses}
          change={stats.monthlyChange}
          icon={MessageSquare}
        />
        
        <StatCard
          title="Ответы за 7 дней"
          value={stats.weeklyResponses}
          subtitle={`За период ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')} - ${new Date().toLocaleDateString('ru-RU')}`}
          icon={Calendar}
        />
        
        <StatCard
          title="Ответы ИИ сегодня"
          value={stats.todayResponses}
          icon={Activity}
        />
        
        <StatCard
          title="Всего агентов"
          value={stats.totalAgents}
          icon={Bot}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Активность за последние 7 дней
          </h3>
          <div className="space-y-3">
            {[
              { day: 'Понедельник', value: 1450 },
              { day: 'Вторник', value: 1520 },
              { day: 'Среда', value: 1380 },
              { day: 'Четверг', value: 1620 },
              { day: 'Пятница', value: 1710 },
              { day: 'Суббота', value: 1430 },
              { day: 'Воскресенье', value: 1348 },
            ].map((item) => {
              const maxValue = 1710
              const percentage = (item.value / maxValue) * 100
              
              return (
                <div key={item.day} className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-600 w-32">
                    {item.day}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                    {item.value}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Последние обновления
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 pb-4 border-b border-gray-100">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Агент "Консультант" активирован
                </p>
                <p className="text-xs text-gray-500">2 часа назад</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 pb-4 border-b border-gray-100">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Добавлена новая интеграция с Kommo CRM
                </p>
                <p className="text-xs text-gray-500">5 часов назад</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 pb-4 border-b border-gray-100">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  База знаний обновлена: +15 статей
                </p>
                <p className="text-xs text-gray-500">1 день назад</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Создан новый агент "Поддержка"
                </p>
                <p className="text-xs text-gray-500">2 дня назад</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

