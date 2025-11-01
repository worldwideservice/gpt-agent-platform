'use client'

import { useState, useEffect } from 'react'
import { Copy, RefreshCw, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { KwidButton, KwidInput, KwidTabs, KwidTabsContent } from '@/components/kwid'
import { Card, CardContent } from '@/components/ui/Card'
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
  accessToken: string
  domain?: string // для Kommo
  isConnected: boolean
  lastSyncAt?: Date
}

export const CRMConfigModal = ({ isOpen, onClose, crmType, onSave }: CRMConfigModalProps) => {
  const [activeTab, setActiveTab] = useState('description')
  const [config, setConfig] = useState<CRMConnectionConfig>({
    id: '',
    crmType,
    accessToken: '',
    domain: '',
    isConnected: false,
    lastSyncAt: undefined
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Простое подключение по токену
  const handleConnect = async () => {
    if (!config.accessToken) {
      alert('Введите Access Token')
      return
    }

    setIsConnecting(true)
    try {
      // Простая проверка токена
      const response = await fetch('/api/crm/test-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crmType,
          accessToken: config.accessToken,
          domain: config.domain
        })
      })
      const data = await response.json()
      
      if (data.success) {
        setConfig(prev => ({
          ...prev,
          isConnected: true,
          lastSyncAt: new Date()
        }))
        
        onSave(config)
        onClose()
      } else {
        alert(`Ошибка: ${data.error}`)
      }
    } catch (error) {
      console.error('Error testing token:', error)
      alert('Ошибка при проверке токена')
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
            '3. Создайте новое приложение или используйте существующее',
            '4. Скопируйте Access Token из настроек приложения',
            '5. Вставьте токен в поле ниже и нажмите "Подключить"'
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{crmInfo.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{crmInfo.description}</p>
          </div>
        </div>

        {/* Вкладки */}
        <KwidTabs value={activeTab} onValueChange={setActiveTab} tabs={[
          { value: 'description', label: 'Описание' },
          { value: 'keys', label: 'Ключи и доступы' },
          { value: 'access', label: 'Выданные доступы' },
        ]}>
          {/* Вкладка: Описание */}
          <KwidTabsContent value="description">
            <Card>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 dark:text-white">Описание интеграции</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {crmInfo.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2 dark:text-white">Инструкция по подключению:</h3>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside dark:text-gray-400">
                    {crmInfo.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-800">
                  <h4 className="text-sm font-medium text-blue-900 mb-2 dark:text-blue-400">Статус подключения:</h4>
                  <div className="flex items-center space-x-2">
                    {config.isConnected ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-green-700 dark:text-green-400">Подключено</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Не подключено</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </KwidTabsContent>

          {/* Вкладка: Подключение */}
          <KwidTabsContent value="keys">
            <Card>
              <CardContent className="space-y-6">
                {/* Access Token */}
                <KwidInput
                  label="Access Token"
                  type="password"
                  value={config.accessToken}
                  onChange={(e) => setConfig(prev => ({ ...prev, accessToken: e.target.value }))}
                  placeholder="Вставьте Access Token из CRM"
                  required
                  hint="Получите в настройках приложения CRM"
                />

                {/* Domain (только для Kommo) */}
                {crmType === 'kommo' && (
                  <KwidInput
                    label="Домен Kommo"
                    value={config.domain || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, domain: e.target.value }))}
                    placeholder="your-domain.kommo.com"
                    required
                    hint="Ваш домен в Kommo CRM"
                  />
                )}

                {/* Кнопка подключения */}
                <div className="pt-4 border-t dark:border-gray-800">
                  <KwidButton
                    onClick={handleConnect}
                    disabled={!config.accessToken || isConnecting}
                    variant="primary"
                    className="w-full gap-2"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Подключение...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        Подключить к CRM
                      </>
                    )}
                  </KwidButton>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Проверим токен и подключимся к CRM
                  </p>
                </div>
              </CardContent>
            </Card>
          </KwidTabsContent>

          {/* Вкладка: Выданные доступы */}
          <KwidTabsContent value="access">
            <Card>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 dark:text-white">Текущие подключения</h3>
                  {config.isConnected ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 dark:bg-green-900/20 dark:border-green-800">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-green-900 dark:text-green-400">Подключено</span>
                      </div>
                      <div className="text-sm text-green-700 space-y-1 dark:text-green-400">
                        <p>CRM: {crmInfo.name}</p>
                        <p>Последняя синхронизация: {config.lastSyncAt?.toLocaleString('ru-RU') || 'Никогда'}</p>
                        <p>Access Token: {config.accessToken ? '✓ Установлен' : '✗ Отсутствует'}</p>
                        <p>Домен: {config.domain || 'Не указан'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 dark:bg-gray-800 dark:border-gray-700">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <span className="font-medium text-gray-600 dark:text-gray-300">Не подключено</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Для подключения перейдите на вкладку "Ключи и доступы"
                      </p>
                    </div>
                  )}
                </div>

                {config.isConnected && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Действия</h3>
                    <div className="space-y-2">
                      <KwidButton variant="outline" size="sm" className="w-full">
                        Синхронизировать данные
                      </KwidButton>
                      <KwidButton variant="outline" size="sm" className="w-full">
                        Обновить токены
                      </KwidButton>
                      <KwidButton variant="danger" size="sm" className="w-full">
                        Отключить
                      </KwidButton>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </KwidTabsContent>
        </KwidTabs>
      </div>
    </Modal>
  )
}
