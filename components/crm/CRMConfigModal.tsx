'use client'

import { useState, useEffect } from 'react'
import { Copy, RefreshCw, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'

interface CRMConfigModalProps {
  isOpen: boolean
  onClose: () => void
  crmType: 'kommo' | 'zoho' | 'bitrix24'
  onSave: (config: CRMConnectionConfig) => void
}

interface CRMConnectionConfig {
  id: string
  crmType: string
  clientId: string
  clientSecret: string
  redirectUri: string
  domain?: string // для Kommo
  isConnected: boolean
  accessToken?: string
  refreshToken?: string
  expiresAt?: Date
  lastSyncAt?: Date
}

export const CRMConfigModal = ({ isOpen, onClose, crmType, onSave }: CRMConfigModalProps) => {
  const [activeTab, setActiveTab] = useState('description')
  const [config, setConfig] = useState<CRMConnectionConfig>({
    id: '',
    crmType,
    clientId: '',
    clientSecret: '',
    redirectUri: '',
    domain: '',
    isConnected: false,
    accessToken: '',
    refreshToken: '',
    expiresAt: undefined,
    lastSyncAt: undefined
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // OAuth авторизация
  const startOAuthFlow = async () => {
    if (!config.clientId || !config.clientSecret || !config.redirectUri) {
      alert('Заполните все обязательные поля: Client ID, Client Secret, Redirect URI')
      return
    }

    setIsConnecting(true)
    try {
      const response = await fetch('/api/crm/oauth/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crmType,
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          redirectUri: config.redirectUri,
          domain: config.domain
        })
      })
      const data = await response.json()
      
      if (data.success && data.authUrl) {
        // Открываем OAuth авторизацию в новом окне
        window.open(data.authUrl, 'oauth', 'width=600,height=700,scrollbars=yes,resizable=yes')
        
        // Слушаем сообщения от popup окна
        const messageListener = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return
          
          if (event.data.type === 'oauth-success') {
            setConfig(prev => ({
              ...prev,
              isConnected: true,
              accessToken: event.data.accessToken,
              refreshToken: event.data.refreshToken,
              expiresAt: event.data.expiresAt,
              lastSyncAt: new Date()
            }))
            
            onSave(config)
            onClose()
            window.removeEventListener('message', messageListener)
          } else if (event.data.type === 'oauth-error') {
            alert(`Ошибка авторизации: ${event.data.error}`)
            window.removeEventListener('message', messageListener)
          }
        }
        
        window.addEventListener('message', messageListener)
      }
    } catch (error) {
      console.error('Error starting OAuth flow:', error)
      alert('Ошибка при запуске авторизации')
    } finally {
      setIsConnecting(false)
    }
  }

  // Копирование в буфер обмена
  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }


  const getCRMInfo = () => {
    switch (crmType) {
      case 'kommo':
        return {
          name: 'Kommo CRM',
          description: 'АИ Агент - автоматизация чатов/писем с ИИ',
          logo: '📊',
          instructions: [
            '1. Войдите в ваш аккаунт Kommo CRM',
            '2. Перейдите в Настройки → Интеграции → API',
            '3. Создайте новое приложение',
            '4. Скопируйте Client ID и Client Secret',
            '5. Укажите Redirect URI: https://ваш-домен.com/api/crm/oauth/callback',
            '6. Нажмите "Авторизоваться" для получения токенов'
          ]
        }
      case 'zoho':
        return {
          name: 'Zoho CRM',
          description: 'Интеграция с Zoho CRM для автоматизации продаж',
          logo: '🏢',
          instructions: [
            '1. Войдите в Zoho CRM',
            '2. Перейдите в Setup → Developer Space → APIs',
            '3. Создайте новое приложение',
            '4. Используйте сгенерированные ключи'
          ]
        }
      default:
        return {
          name: 'CRM System',
          description: 'Подключение CRM системы',
          logo: '🔗',
          instructions: []
        }
    }
  }

  const crmInfo = getCRMInfo()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Настройка ${crmInfo.name}`} size="lg">
      <div className="space-y-6">
        {/* Заголовок с логотипом */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">{crmInfo.logo}</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{crmInfo.name}</h2>
            <p className="text-sm text-gray-600">{crmInfo.description}</p>
          </div>
        </div>

        {/* Вкладки */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="description">Описание</TabsTrigger>
            <TabsTrigger value="keys">Ключи и доступы</TabsTrigger>
            <TabsTrigger value="access">Выданные доступы</TabsTrigger>
          </TabsList>

          {/* Вкладка: Описание */}
          <TabsContent value="description">
            <Card>
              <CardBody className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Описание интеграции</h3>
                  <p className="text-sm text-gray-600">
                    {crmInfo.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Инструкция по подключению:</h3>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    {crmInfo.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Статус подключения:</h4>
                  <div className="flex items-center space-x-2">
                    {config.isConnected ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">Подключено</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Не подключено</span>
                      </>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </TabsContent>

          {/* Вкладка: Ключи и доступы */}
          <TabsContent value="keys">
            <Card>
              <CardBody className="space-y-6">
                {/* Client ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client ID <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={config.clientId}
                    onChange={(e) => setConfig(prev => ({ ...prev, clientId: e.target.value }))}
                    placeholder="Введите Client ID из CRM"
                    className="flex-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Получите в настройках приложения CRM
                  </p>
                </div>

                {/* Client Secret */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Secret <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="password"
                    value={config.clientSecret}
                    onChange={(e) => setConfig(prev => ({ ...prev, clientSecret: e.target.value }))}
                    placeholder="Введите Client Secret из CRM"
                    className="flex-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Секретный ключ приложения
                  </p>
                </div>

                {/* Redirect URI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Redirect URI <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={config.redirectUri}
                    onChange={(e) => setConfig(prev => ({ ...prev, redirectUri: e.target.value }))}
                    placeholder="https://ваш-домен.com/api/crm/oauth/callback"
                    className="flex-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL для возврата после авторизации
                  </p>
                </div>

                {/* Domain (только для Kommo) */}
                {crmType === 'kommo' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Домен Kommo <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={config.domain || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, domain: e.target.value }))}
                      placeholder="your-domain.kommo.com"
                      className="flex-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ваш домен в Kommo CRM
                    </p>
                  </div>
                )}

                {/* Кнопка авторизации */}
                <div className="pt-4 border-t">
                  <Button
                    onClick={startOAuthFlow}
                    disabled={!config.clientId || !config.clientSecret || !config.redirectUri || isConnecting}
                    className="w-full"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Авторизация...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Авторизоваться в CRM
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Откроется окно авторизации CRM
                  </p>
                </div>
              </CardBody>
            </Card>
          </TabsContent>

          {/* Вкладка: Выданные доступы */}
          <TabsContent value="access">
            <Card>
              <CardBody className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Текущие подключения</h3>
                  {config.isConnected ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-900">Подключено</span>
                      </div>
                      <div className="text-sm text-green-700 space-y-1">
                        <p>CRM: {crmInfo.name}</p>
                        <p>Последняя синхронизация: {config.lastSyncAt?.toLocaleString('ru-RU') || 'Никогда'}</p>
                        <p>Access Token: {config.accessToken ? '✓ Установлен' : '✗ Отсутствует'}</p>
                        <p>Refresh Token: {config.refreshToken ? '✓ Установлен' : '✗ Отсутствует'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-600">Не подключено</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Для подключения перейдите на вкладку "Ключи и доступы"
                      </p>
                    </div>
                  )}
                </div>

                {config.isConnected && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Действия</h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        Синхронизировать данные
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        Обновить токены
                      </Button>
                      <Button variant="danger" size="sm" className="w-full">
                        Отключить
                      </Button>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Modal>
  )
}
