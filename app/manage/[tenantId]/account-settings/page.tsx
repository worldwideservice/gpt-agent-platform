'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Info } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/toast-context'

interface OrganizationSettings {
  stopOnHumanReply?: boolean
}

export default function AccountSettingsPage() {
  const params = useParams()
  const tenantId = (params?.tenantId as string) || ''
  const { push } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [stopOnHumanReply, setStopOnHumanReply] = useState(false)

  // Загружаем настройки
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/organization/settings')
        const data = await response.json()

        if (data.success && data.data?.settings) {
          const settings = data.data.settings as OrganizationSettings
          setStopOnHumanReply(settings.stopOnHumanReply ?? false)
        }
      } catch (error) {
        console.error('Failed to load settings', error)
        push({
          title: 'Ошибка',
          description: 'Не удалось загрузить настройки',
          variant: 'error',
        })
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [push])

  const handleSave = async () => {
    setSaving(true)

    try {
      const response = await fetch('/api/organization/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stopOnHumanReply,
        }),
      })

      const data = await response.json()

      if (data.success) {
        push({
          title: 'Успешно',
          description: 'Настройки сохранены',
          variant: 'success',
        })
      } else {
        throw new Error(data.error || 'Не удалось сохранить настройки')
      }
    } catch (error) {
      console.error('Failed to save settings', error)
      push({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось сохранить настройки',
        variant: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/manage/${tenantId}`}>Инфопанель</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Настройки аккаунта</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-2xl font-semibold mb-6 mt-4">Настройки аккаунта</h1>

        <div className="space-y-8">
          {/* Секция "Общие" */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Общие</h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Switch
                  id="stopOnHumanReply"
                  checked={stopOnHumanReply}
                  onCheckedChange={setStopOnHumanReply}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <Label htmlFor="stopOnHumanReply" className="text-base font-medium cursor-pointer">
                    Останавливать агентов ИИ при ответе человека
                  </Label>
                  <p className="text-sm text-gray-600">
                    Если включено, агенты ИИ перестанут отвечать в этом чате после того, как человек отправит сообщение.
                  </p>
                  <div className="flex items-start space-x-2 text-xs text-gray-500">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Это поможет избежать конфликтов, когда агент и человек пытаются отвечать одновременно.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Кнопка сохранения */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

