'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/use-toast'

/**
 * Секция "Общие настройки" согласно KWID
 * Настройка: "Останавливать агентов ИИ при ответе человека"
 */
export function GeneralSettingsSection() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    stopAiAgentsOnManualMessage: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    // Загрузка настроек при монтировании
    fetch('/api/account/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings)
        }
      })
      .catch(() => {
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить настройки',
          variant: 'destructive',
        })
      })
      .finally(() => setIsFetching(false))
  }, [toast])

  const handleSave = async () => {
    setIsLoading(true)

    try {
      const res = await fetch('/api/account/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update settings')
      }

      toast({
        title: 'Настройки сохранены',
        description: 'Ваши настройки были успешно обновлены.',
      })
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-20 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Общие</CardTitle>
        <CardDescription>Управление общими настройками приложения</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="stopAiAgents" className="text-base font-medium">
              Останавливать агентов ИИ при ответе человека
            </Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Если включено, агенты ИИ перестанут отвечать в этом чате после того, как человек
              отправит сообщение.
            </p>
          </div>
          <Switch
            id="stopAiAgents"
            checked={settings.stopAiAgentsOnManualMessage}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, stopAiAgentsOnManualMessage: checked })
            }
          />
        </div>

        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </CardContent>
    </Card>
  )
}
