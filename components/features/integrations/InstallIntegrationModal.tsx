'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useInstallIntegration } from '@/lib/hooks'

interface InstallIntegrationModalProps {
  isOpen: boolean
  onClose: () => void
  integrationId: string
  integrationName: string
  agentId: string
}

export function InstallIntegrationModal({
  isOpen,
  onClose,
  integrationId,
  integrationName,
  agentId,
}: InstallIntegrationModalProps) {
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [baseDomain, setBaseDomain] = useState('')
  const [isOAuthLoading, setIsOAuthLoading] = useState(false)
  const [oauthError, setOauthError] = useState<string | null>(null)

  const { mutate: installIntegration, isPending } = useInstallIntegration(agentId)

  const handleInstall = () => {
    installIntegration(integrationId, {
      onSuccess: () => {
        onClose()
        setClientId('')
        setClientSecret('')
      },
    })
  }

  const handleOAuthInstall = async () => {
    if (!baseDomain.trim()) {
      setOauthError('Введите поддомен Kommo')
      return
    }

    setIsOAuthLoading(true)
    setOauthError(null)

    try {
      // Get current tenant ID from URL
      const pathParts = window.location.pathname.split('/')
      const tenantId = pathParts[2] // /manage/[tenantId]/...

      const response = await fetch(`/api/agents/${agentId}/integrations/kommo/oauth/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseDomain: baseDomain.trim(),
          tenantId,
        }),
      })

      const data = await response.json()

      if (data.success && data.authUrl) {
        // Redirect to Kommo OAuth
        window.location.href = data.authUrl
      } else {
        setOauthError(data.error || 'Не удалось запустить OAuth авторизацию')
        setIsOAuthLoading(false)
      }
    } catch (error) {
      console.error('OAuth start error:', error)
      setOauthError('Произошла ошибка при запуске OAuth авторизации')
      setIsOAuthLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Установить {integrationName}</DialogTitle>
          <DialogDescription>
            Выберите способ подключения интеграции к вашему агенту
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="oauth" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="oauth">OAuth (Рекомендуется)</TabsTrigger>
            <TabsTrigger value="manual">Вручную</TabsTrigger>
          </TabsList>

          <TabsContent value="oauth" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Безопасный способ подключения через OAuth 2.0. Вы будете перенаправлены на страницу{' '}
                  {integrationName} для авторизации.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseDomain">Поддомен Kommo</Label>
                <Input
                  id="baseDomain"
                  placeholder="example (без .kommo.com)"
                  value={baseDomain}
                  onChange={(e) => {
                    setBaseDomain(e.target.value)
                    setOauthError(null)
                  }}
                  disabled={isOAuthLoading}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Введите поддомен вашего аккаунта Kommo (например, если ваш адрес example.kommo.com,
                  введите &quot;example&quot;)
                </p>
              </div>

              {oauthError && (
                <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
                  <p className="text-sm text-red-800 dark:text-red-400">{oauthError}</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isOAuthLoading}>
                Отмена
              </Button>
              <Button onClick={handleOAuthInstall} disabled={isOAuthLoading || !baseDomain.trim()}>
                {isOAuthLoading ? 'Перенаправление...' : 'Подключить через OAuth'}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID</Label>
                <Input
                  id="clientId"
                  placeholder="Введите Client ID"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientSecret">Client Secret</Label>
                <Input
                  id="clientSecret"
                  type="password"
                  placeholder="Введите Client Secret"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  disabled={isPending}
                />
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Получите Client ID и Client Secret в настройках вашего аккаунта {integrationName}.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isPending}>
                Отмена
              </Button>
              <Button
                onClick={handleInstall}
                disabled={isPending || !clientId || !clientSecret}
              >
                {isPending ? 'Установка...' : 'Установить'}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
