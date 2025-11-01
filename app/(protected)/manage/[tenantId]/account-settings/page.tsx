'use client'

import { useEffect, useState } from 'react'
import { KwidButton, KwidInput, KwidSection, KwidSwitch } from '@/components/kwid'

interface UserData {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
}

interface ChatPageProps {
  params: Promise<{ tenantId: string }>
}

const AccountPage = ({ params }: ChatPageProps) => {
  const [resolvedParams, setResolvedParams] = useState<{ tenantId: string } | null>(null)
  const [user, setUser] = useState<UserData | null>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [stopOnHumanReply, setStopOnHumanReply] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/account')
        if (response.ok) {
          const data = (await response.json()) as { success: boolean; data: UserData }
          if (data.success) {
            setUser(data.data)
            setFullName(data.data.fullName || '')
            setEmail(data.data.email || '')
          }
        }
      } catch (error) {
        console.error('Failed to fetch user', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleSave = async () => {
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

      if (response.ok) {
        alert('Настройки сохранены')
      } else {
        throw new Error('Не удалось сохранить настройки')
      }
    } catch (error) {
      console.error('Failed to save settings', error)
      alert('Ошибка сохранения настроек')
    } finally {
      setIsSaving(false)
    }
  }

  if (!resolvedParams || isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        {/* Kwid: "Account Settings" */}
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Управляйте настройками вашего аккаунта и организации</p>
      </div>

      <KwidSection
        title="Профиль"
        description="Основная информация о вашем аккаунте"
      >
        <div className="space-y-4">
          <KwidInput
            label="Имя"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ваше имя"
          />
          <KwidInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
            hint="Email нельзя изменить"
          />
        </div>
      </KwidSection>

      <KwidSection
        title="Общие настройки"
        description="Если включить, агенты перестанут отвечать, как только человек отправит сообщение в этом чате."
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Останавливать агентов ИИ при ответе человека</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Агенты автоматически отключаются после сообщения менеджера.
              </p>
            </div>
            <KwidSwitch
              checked={stopOnHumanReply}
              onCheckedChange={setStopOnHumanReply}
            />
          </div>

          <div className="fi-form-actions pt-4">
            <KwidButton onClick={handleSave} disabled={isSaving} variant="primary" size="md">
              {isSaving ? 'Сохранение…' : 'Сохранить изменения'}
            </KwidButton>
          </div>
        </div>
      </KwidSection>
    </div>
  )
}

export default AccountPage

