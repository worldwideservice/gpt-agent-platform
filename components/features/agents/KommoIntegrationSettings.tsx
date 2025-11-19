'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RefreshCw, CheckCircle2, XCircle } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Switch,
  useToast,
  Badge,
} from '@/components/ui'
import { useCrmSync } from '@/lib/hooks'

interface Agent {
  id: string
  name: string
  kommoActive?: boolean | null
}

interface KommoIntegrationSettingsProps {
  agent: Agent
  tenantId: string
}

export function KommoIntegrationSettings({ agent, tenantId }: KommoIntegrationSettingsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { syncCrm, isSyncing } = useCrmSync({ agentId: agent.id })
  const [isActive, setIsActive] = useState(agent.kommoActive ?? true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'active' | 'inactive' | 'error'>('inactive')
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)

  // Проверка статуса подключения
  const checkStatus = async () => {
    setIsCheckingStatus(true)
    try {
      // Реальный запрос к API для проверки статуса
      const res = await fetch(`/api/agents/${agent.id}/integrations/kommo/status`)

      if (!res.ok) {
        throw new Error('Failed to check status')
      }

      const data = await res.json()
      setStatus(data.status || 'active')

      toast({
        title: 'Успешно',
        description: 'Синхронизация с Kommo CRM выполнена успешно',
      })
    } catch (e) {
      setStatus('error')
      toast({
        title: 'Ошибка',
        description: 'Ошибка синхронизации с Kommo CRM',
        variant: 'destructive',
      })
    } finally {
      setIsCheckingStatus(false)
    }
  }

  // Проверяем статус при монтировании
  useEffect(() => {
    if (isActive) {
      checkStatus()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/agents/${agent.id}/integrations/kommo`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update Kommo integration')
      }

      toast({
        title: 'Успешно',
        description: 'Настройки интеграции Kommo обновлены',
      })

      router.push(`/manage/${tenantId}/ai-agents/${agent.id}/available-integrations`)
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить интеграцию Kommo',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Статус подключения Kommo CRM */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Логотип Kommo */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                K
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  Kommo CRM
                  {status === 'active' && isActive && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Активно
                    </Badge>
                  )}
                  {(status === 'inactive' || !isActive) && (
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-600 hover:bg-gray-100"
                    >
                      Не подключено
                    </Badge>
                  )}
                  {status === 'error' && isActive && (
                    <Badge
                      variant="secondary"
                      className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
                    >
                      <XCircle className="w-3 h-3 mr-1" /> Ошибка
                    </Badge>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Автоматическое создание сделок и синхронизация переписки
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={checkStatus}
              disabled={isCheckingStatus || isSyncing}
              className="min-w-[160px]"
            >
              {isCheckingStatus || isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Проверка...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Синхронизировать
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Общие настройки */}
      <Card>
        <CardHeader>
          <CardTitle>Общие настройки</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="kommo-active" className="text-base font-medium">
                Активировать интеграцию
              </Label>
              <p className="text-sm text-muted-foreground">
                Включить автоматическую синхронизацию агента с Kommo CRM
              </p>
            </div>
            <Switch
              id="kommo-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </CardContent>
      </Card>

      {/* Кнопки действий */}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
        <Button
          asChild
          variant="outline"
          disabled={isSubmitting}
        >
          <Link href={`/manage/${tenantId}/ai-agents/${agent.id}/available-integrations`}>
            Отменить
          </Link>
        </Button>
      </div>
    </form>
  )
}
