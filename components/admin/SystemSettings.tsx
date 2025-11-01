'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Settings,
  Database,
  RefreshCw,
  Shield,
  Mail,
  Zap,
  HardDrive,
  Activity
} from 'lucide-react'

export const SystemSettings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    featureFlags: {
      advancedAi: false,
      realTimeChat: true,
      analytics: false,
    },
    rateLimits: {
      free: { requests: 50, tokens: 10000 },
      premium: { requests: 200, tokens: 50000 },
      vip: { requests: 1000, tokens: 500000 },
    },
  })

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings)
    // Here you would save to backend
  }

  const handleSystemAction = async (action: string) => {
    try {
      const response = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        console.log(`${action} completed successfully`)
      } else {
        console.error(`Failed to ${action}`)
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Системные настройки</h2>
          <p className="text-muted-foreground">
            Управление настройками и состоянием системы
          </p>
        </div>
        <Button onClick={handleSaveSettings}>
          <Settings className="h-4 w-4 mr-2" />
          Сохранить изменения
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Общие настройки
          </CardTitle>
          <CardDescription>
            Основные параметры работы платформы
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="maintenance">Режим обслуживания</Label>
              <p className="text-sm text-muted-foreground">
                Временно отключить доступ к платформе для всех пользователей
              </p>
            </div>
            <Switch
              id="maintenance"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, maintenanceMode: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="registration">Регистрация пользователей</Label>
              <p className="text-sm text-muted-foreground">
                Разрешить новым пользователям создавать аккаунты
              </p>
            </div>
            <Switch
              id="registration"
              checked={settings.allowRegistration}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, allowRegistration: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email уведомления</Label>
              <p className="text-sm text-muted-foreground">
                Отправлять автоматические email уведомления
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Feature Flags
          </CardTitle>
          <CardDescription>
            Управление экспериментальными функциями
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(settings.featureFlags).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={key}>
                  {key === 'advancedAi' && 'Расширенные AI модели'}
                  {key === 'realTimeChat' && 'Real-time чат'}
                  {key === 'analytics' && 'Расширенная аналитика'}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {key === 'advancedAi' && 'Доступ к премиум AI моделям'}
                  {key === 'realTimeChat' && 'Мгновенные ответы без задержек'}
                  {key === 'analytics' && 'Детальные отчеты и метрики'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={enabled ? 'default' : 'secondary'}>
                  {enabled ? 'Включено' : 'Отключено'}
                </Badge>
                <Switch
                  id={key}
                  checked={enabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      featureFlags: {
                        ...settings.featureFlags,
                        [key]: checked,
                      },
                    })
                  }
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rate Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Rate Limits
          </CardTitle>
          <CardDescription>
            Ограничения по тарифным планам
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(settings.rateLimits).map(([tier, limits]) => (
              <div key={tier} className="space-y-3 p-4 border rounded-lg">
                <h4 className="font-medium capitalize">{tier}</h4>
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm">API запросов/мин</Label>
                    <Input
                      type="number"
                      value={limits.requests}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          rateLimits: {
                            ...settings.rateLimits,
                            [tier]: {
                              ...limits,
                              requests: parseInt(e.target.value),
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Токенов/месяц</Label>
                    <Input
                      type="number"
                      value={limits.tokens}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          rateLimits: {
                            ...settings.rateLimits,
                            [tier]: {
                              ...limits,
                              tokens: parseInt(e.target.value),
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Системные действия
          </CardTitle>
          <CardDescription>
            Критические операции с системой
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={() => handleSystemAction('clear_cache')}
              className="flex flex-col items-center gap-2 h-20"
            >
              <Database className="h-6 w-6" />
              <span className="text-sm">Очистить кэш</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleSystemAction('restart_worker')}
              className="flex flex-col items-center gap-2 h-20"
            >
              <RefreshCw className="h-6 w-6" />
              <span className="text-sm">Перезапустить worker</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleSystemAction('backup_database')}
              className="flex flex-col items-center gap-2 h-20"
            >
              <HardDrive className="h-6 w-6" />
              <span className="text-sm">Создать backup</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleSystemAction('send_test_email')}
              className="flex flex-col items-center gap-2 h-20"
            >
              <Mail className="h-6 w-6" />
              <span className="text-sm">Тестовый email</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Системные логи</CardTitle>
          <CardDescription>
            Последние системные события и ошибки
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Системные логи будут отображаться здесь..."
            className="min-h-[200px] font-mono text-sm"
            readOnly
          />
        </CardContent>
      </Card>
    </div>
  )
}
