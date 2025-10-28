'use client'

import { useState } from 'react'
import { Settings, CheckCircle, XCircle, Plus } from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import type { Integration } from '@/types'

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Kommo CRM',
    type: 'kommo',
    status: 'connected',
    isActive: true,
  },
  {
    id: '2',
    name: 'Telegram Bot',
    type: 'telegram',
    status: 'disconnected',
    isActive: false,
  },
  {
    id: '3',
    name: 'WhatsApp Business',
    type: 'whatsapp',
    status: 'disconnected',
    isActive: false,
  },
  {
    id: '4',
    name: 'Facebook Messenger',
    type: 'facebook',
    status: 'connected',
    isActive: true,
  },
  {
    id: '5',
    name: 'Email Integration',
    type: 'email',
    status: 'connected',
    isActive: false,
  },
]

const IntegrationsPage = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations)
  const [configModalOpen, setConfigModalOpen] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration)
    setConfigModalOpen(true)
  }

  const handleToggleActive = (id: string) => {
    setIntegrations(prev =>
      prev.map(int =>
        int.id === id ? { ...int, isActive: !int.isActive } : int
      )
    )
  }

  const getIntegrationIcon = (type: Integration['type']) => {
    const icons = {
      kommo: '📊',
      telegram: '💬',
      whatsapp: '📱',
      facebook: '👥',
      email: '📧',
    }
    return icons[type]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Интеграции</h1>
          <p className="text-gray-600 mt-1">
            Подключите внешние сервисы для расширения возможностей
          </p>
        </div>
        <Button>
          <Plus className="w-5 h-5 mr-2" />
          Добавить интеграцию
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardBody>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-2xl">
                    {getIntegrationIcon(integration.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {integration.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {integration.status === 'connected' ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <Badge variant="success">Подключено</Badge>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-gray-400" />
                          <Badge variant="default">Не подключено</Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {integration.status === 'connected' && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Активна
                    </span>
                    <button
                      onClick={() => handleToggleActive(integration.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                        integration.isActive ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                      aria-label="Переключить активность"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          integration.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleConfigure(integration)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {integration.status === 'connected' ? 'Настроить' : 'Подключить'}
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        title={`Настройка ${selectedIntegration?.name}`}
        size="lg"
      >
        <div className="space-y-4">
          {selectedIntegration?.status === 'connected' ? (
            <>
              <Input
                label="API Key"
                defaultValue="sk-••••••••••••••••••"
                type="password"
              />
              <Input
                label="Webhook URL"
                defaultValue="https://api.example.com/webhook"
              />
              <div className="flex items-center justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={() => setConfigModalOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={() => setConfigModalOpen(false)}>
                  Сохранить
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-700">
                Для подключения {selectedIntegration?.name} выполните следующие шаги:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Получите API ключ в настройках сервиса</li>
                <li>Скопируйте webhook URL</li>
                <li>Вставьте данные в форму ниже</li>
              </ol>
              <Input label="API Key" placeholder="Введите API ключ" />
              <Input label="Webhook URL" placeholder="Введите webhook URL" />
              <div className="flex items-center justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={() => setConfigModalOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={() => setConfigModalOpen(false)}>
                  Подключить
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default IntegrationsPage

