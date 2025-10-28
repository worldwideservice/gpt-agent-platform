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
  secretKey: string
  integrationId: string
  longTermToken?: string
  authCode?: string
  authCodeExpiresAt?: Date
  isConnected: boolean
  accessToken?: string
  refreshToken?: string
  lastSyncAt?: Date
}

export const CRMConfigModal = ({ isOpen, onClose, crmType, onSave }: CRMConfigModalProps) => {
  const [activeTab, setActiveTab] = useState('description')
  const [config, setConfig] = useState<CRMConnectionConfig>({
    id: '',
    crmType,
    secretKey: '',
    integrationId: '',
    longTermToken: '',
    authCode: '',
    authCodeExpiresAt: undefined,
    isConnected: false,
    accessToken: '',
    refreshToken: '',
    lastSyncAt: undefined
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Генерация Secret Key
  const generateSecretKey = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/crm/generate-secret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crmType })
      })
      const data = await response.json()
      
      if (data.success) {
        setConfig(prev => ({
          ...prev,
          secretKey: data.secretKey,
          integrationId: data.integrationId
        }))
      }
    } catch (error) {
      console.error('Error generating secret key:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Генерация Long-term Token
  const generateLongTermToken = async () => {
    if (!config.secretKey) {
      alert('Сначала сгенерируйте Secret Key')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/crm/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          crmType,
          secretKey: config.secretKey,
          integrationId: config.integrationId
        })
      })
      const data = await response.json()
      
      if (data.success) {
        setConfig(prev => ({
          ...prev,
          longTermToken: data.longTermToken
        }))
      }
    } catch (error) {
      console.error('Error generating long-term token:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Генерация Authorization Code
  const generateAuthCode = async () => {
    if (!config.secretKey) {
      alert('Сначала сгенерируйте Secret Key')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/crm/generate-auth-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          crmType,
          secretKey: config.secretKey,
          integrationId: config.integrationId
        })
      })
      const data = await response.json()
      
      if (data.success) {
        const expiresAt = new Date(Date.now() + 20 * 60 * 1000) // 20 минут
        setConfig(prev => ({
          ...prev,
          authCode: data.authCode,
          authCodeExpiresAt: expiresAt
        }))
      }
    } catch (error) {
      console.error('Error generating auth code:', error)
    } finally {
      setIsGenerating(false)
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

  // Подключение к CRM
  const handleConnect = async () => {
    if (!config.authCode) {
      alert('Сначала сгенерируйте Authorization Code')
      return
    }

    setIsConnecting(true)
    try {
      const response = await fetch('/api/crm/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crmType,
          authCode: config.authCode,
          integrationId: config.integrationId
        })
      })
      const data = await response.json()
      
      if (data.success) {
        setConfig(prev => ({
          ...prev,
          isConnected: true,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          lastSyncAt: new Date()
        }))
        
        // Сохраняем конфигурацию
        onSave(config)
        onClose()
      }
    } catch (error) {
      console.error('Error connecting to CRM:', error)
    } finally {
      setIsConnecting(false)
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
            '3. Создайте новое приложение или используйте существующее',
            '4. Используйте сгенерированные ключи для подключения'
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
                {/* Secret Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Секретный ключ (Secret key)
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      value={config.secretKey}
                      readOnly
                      placeholder="Сгенерируйте секретный ключ"
                      className="flex-1"
                    />
                    <Button
                      onClick={generateSecretKey}
                      disabled={isGenerating}
                      variant="outline"
                      size="sm"
                    >
                      {isGenerating ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        'Сгенерировать новый ключ'
                      )}
                    </Button>
                    {config.secretKey && (
                      <Button
                        onClick={() => copyToClipboard(config.secretKey, 'secretKey')}
                        variant="ghost"
                        size="sm"
                      >
                        {copiedField === 'secretKey' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Integration ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID интеграции (Integration ID)
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      value={config.integrationId}
                      readOnly
                      placeholder="2a5c1463-43dd-4ccc-abd0-79516f785e57"
                      className="flex-1"
                    />
                    {config.integrationId && (
                      <Button
                        onClick={() => copyToClipboard(config.integrationId, 'integrationId')}
                        variant="ghost"
                        size="sm"
                      >
                        {copiedField === 'integrationId' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Long-term Token */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Долгосрочный токен (Long-term token)
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      value={config.longTermToken || ''}
                      readOnly
                      placeholder="Сгенерируйте долгосрочный токен"
                      className="flex-1"
                    />
                    <Button
                      onClick={generateLongTermToken}
                      disabled={isGenerating || !config.secretKey}
                      variant="outline"
                      size="sm"
                    >
                      {isGenerating ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        'Сгенерировать токен'
                      )}
                    </Button>
                    {config.longTermToken && (
                      <Button
                        onClick={() => copyToClipboard(config.longTermToken!, 'longTermToken')}
                        variant="ghost"
                        size="sm"
                      >
                        {copiedField === 'longTermToken' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Authorization Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Код авторизации (действителен 20 минут)
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      value={config.authCode || ''}
                      readOnly
                      placeholder="def50200a98af1eeb65c962dbe5c96f9e00..."
                      className="flex-1"
                    />
                    <Button
                      onClick={generateAuthCode}
                      disabled={isGenerating || !config.secretKey}
                      variant="outline"
                      size="sm"
                    >
                      {isGenerating ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        'Сгенерировать код'
                      )}
                    </Button>
                    {config.authCode && (
                      <Button
                        onClick={() => copyToClipboard(config.authCode!, 'authCode')}
                        variant="ghost"
                        size="sm"
                      >
                        {copiedField === 'authCode' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  {config.authCodeExpiresAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Истекает: {config.authCodeExpiresAt.toLocaleString('ru-RU')}
                    </p>
                  )}
                </div>

                {/* Кнопка подключения */}
                <div className="pt-4 border-t">
                  <Button
                    onClick={handleConnect}
                    disabled={!config.authCode || isConnecting}
                    className="w-full"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Подключение...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Подключить к CRM
                      </>
                    )}
                  </Button>
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
