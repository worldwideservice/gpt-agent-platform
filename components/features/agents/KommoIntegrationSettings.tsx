'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RefreshCw } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Switch,
  useToast,
} from '@/components/ui'

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
  const [isActive, setIsActive] = useState(agent.kommoActive ?? true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSyncCRM = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch(`/api/agents/${agent.id}/sync-crm`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to sync CRM')
      }

      toast({
        title: 'Успешно',
        description: 'Синхронизация с CRM выполнена успешно',
      })

      router.refresh()
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось синхронизировать с CRM',
        variant: 'destructive',
      })
    } finally {
      setIsSyncing(false)
    }
  }

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
      {/* Общие настройки */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Общие настройки</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSyncCRM}
              disabled={isSyncing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              Синхронизировать настройки CRM
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="kommo-active">Активно</Label>
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
