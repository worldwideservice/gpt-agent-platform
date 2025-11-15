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

  const handleOAuthInstall = () => {
    // TODO: Redirect to OAuth URL
    console.log('OAuth install for', integrationId)
    // window.location.href = `/api/integrations/${integrationId}/oauth/authorize?agent_id=${agentId}`
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
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Безопасный способ подключения через OAuth 2.0. Вы будете перенаправлены на страницу {integrationName} для авторизации.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isPending}>
                Отмена
              </Button>
              <Button onClick={handleOAuthInstall} disabled={isPending}>
                Подключить через OAuth
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
