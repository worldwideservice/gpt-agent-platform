'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'

interface AccountSettings {
  stopOnHumanReply?: boolean
}

interface UserData {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  locale: string | null
}

const AccountPage = () => {
  const [user, setUser] = useState<UserData | null>(null)
  const [settings, setSettings] = useState<AccountSettings>({})
  const [stopOnHumanReply, setStopOnHumanReply] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchAccountData = useCallback(async () => {
    try {
      const [userResponse, settingsResponse] = await Promise.all([
        fetch('/api/account'),
        fetch('/api/organization/settings'),
      ])

      if (userResponse.ok) {
        const userPayload = (await userResponse.json()) as { success: boolean; data: UserData }
        if (userPayload.success) {
          setUser(userPayload.data)
        }
      }

      if (settingsResponse.ok) {
        const settingsPayload = (await settingsResponse.json()) as {
          success: boolean
          data: { settings: AccountSettings }
        }
        if (settingsPayload.success) {
          setSettings(settingsPayload.data.settings)
          setStopOnHumanReply(settingsPayload.data.settings.stopOnHumanReply ?? false)
        }
      }
    } catch (error) {
      console.error('Failed to fetch account data', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAccountData()
  }, [fetchAccountData])

  const handleSave = useCallback(async () => {
    setIsSaving(true)

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

      if (!response.ok) {
        throw new Error('Не удалось сохранить настройки')
      }

      const payload = (await response.json()) as { success: boolean }

      if (!payload.success) {
        throw new Error('Не удалось сохранить настройки')
      }

      alert('Настройки успешно сохранены')
    } catch (error) {
      console.error('Failed to save settings', error)
      alert('Не удалось сохранить настройки. Попробуйте еще раз.')
    } finally {
      setIsSaving(false)
    }
  }, [stopOnHumanReply])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">Настройки аккаунта</h1>
          <p className="text-sm text-slate-500">Загрузка...</p>
        </header>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Настройки аккаунта</h1>
        <p className="text-sm text-slate-500">Управление поведением AI-агентов и уведомлениями</p>
      </header>

      <Card className="shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Профиль пользователя</h2>
            <p className="mt-1 text-sm text-slate-500">Информация о вашем аккаунте</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Имя"
              value={user?.fullName ?? ''}
              placeholder="Ваше имя"
              disabled
            />
            <Input
              label="Email"
              type="email"
              value={user?.email ?? ''}
              placeholder="email@example.com"
              disabled
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Общие настройки</h2>
            <p className="mt-1 text-sm text-slate-500">
              Если включить, агенты перестанут отвечать, как только человек отправит сообщение в этом чате.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Toggle
              checked={stopOnHumanReply}
              onChange={setStopOnHumanReply}
              label="Останавливать агентов ИИ при ответе человека"
              description="Агенты автоматически отключаются после сообщения менеджера."
            />
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="gap-2 text-sm">
            {isSaving ? 'Сохранение…' : 'Сохранить изменения'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default AccountPage

