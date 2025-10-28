'use client'

import { useState, useEffect } from 'react'
import { Plus, Settings, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CRMSelector } from '@/components/crm/CRMSelector'
import { UniversalSync } from '@/components/crm/UniversalSync'
import { CRMConfigModal } from '@/components/crm/CRMConfigModal'
import { KommoAPIDebugger } from '@/components/crm/KommoAPIDebugger'
import type { CRMConfig, CRMConnection, SyncResult } from '@/types/crm'

// Mock данные для демонстрации
const mockConnections: CRMConnection[] = [
  {
    id: '1',
    crmType: 'kommo',
    isConnected: true,
    accessToken: 'mock_token',
    lastSyncAt: new Date(Date.now() - 3600000), // 1 час назад
    config: {
      id: 'kommo',
      name: 'Kommo CRM',
      logo: '/logos/kommo.svg',
      description: 'Kommo CRM подключена',
      authType: 'oauth2',
      baseUrl: 'https://kommo.com/api/v4',
      scopes: ['crm:read', 'crm:write'],
      fields: []
    }
  }
]

export default function IntegrationsPage() {
  const [connections, setConnections] = useState<CRMConnection[]>(mockConnections)
  const [showCRMSelector, setShowCRMSelector] = useState(false)
  const [selectedCRM, setSelectedCRM] = useState<CRMConfig | null>(null)
  const [showCRMConfig, setShowCRMConfig] = useState(false)
  const [showDebugger, setShowDebugger] = useState(false)

  const handleSelectCRM = (crmConfig: CRMConfig) => {
    setSelectedCRM(crmConfig)
    setShowCRMSelector(false)
    setShowCRMConfig(true)
  }

  const handleCRMConnection = (connection: any) => {
    const newConnection: CRMConnection = {
      id: connection.id || Date.now().toString(),
      crmType: connection.crmType,
      clientId: connection.clientId || '',
      clientSecret: connection.clientSecret || '',
      redirectUri: connection.redirectUri || '',
      domain: connection.domain || '',
      isConnected: connection.isConnected,
      accessToken: connection.accessToken,
      refreshToken: connection.refreshToken,
      expiresAt: connection.expiresAt,
      lastSyncAt: new Date(),
      config: {
        id: connection.crmType,
        name: connection.crmType === 'kommo' ? 'Kommo CRM' : 'CRM System',
        logo: '/logos/kommo.svg',
        description: `${connection.crmType} подключена`,
        authType: 'oauth2',
        baseUrl: connection.crmType === 'kommo' ? 'https://kommo.com/api/v4' : '',
        scopes: ['crm:read', 'crm:write'],
        fields: []
      }
    }
    
    setConnections(prev => [...prev, newConnection])
    setShowCRMConfig(false)
    setSelectedCRM(null)
  }

  const handleSync = async (crmType: string): Promise<SyncResult> => {
    // Mock синхронизация
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return {
      success: true,
      pipelines: [
        {
          id: '1',
          name: 'GENERATION LEAD',
          isActive: true,
          stages: [
            { id: '1', name: 'Сделка не распределена', pipelineId: '1', order: 1, isActive: true },
            { id: '2', name: 'Сделка распределена', pipelineId: '1', order: 2, isActive: true },
            { id: '3', name: 'Social media', pipelineId: '1', order: 3, isActive: true }
          ]
        }
      ],
      channels: [
        { id: 'email', name: 'Email', type: 'email', isActive: true },
        { id: 'phone', name: 'Телефон', type: 'phone', isActive: true },
        { id: 'chat', name: 'Чат', type: 'chat', isActive: true }
      ],
      contacts: [],
      deals: [],
      tasks: [],
      errors: [],
      lastSyncAt: new Date()
    }
  }

  const handleDisconnect = (connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Интеграции</h1>
          <p className="text-sm text-gray-600 mt-1">
            Подключите CRM системы для автоматической синхронизации данных
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline"
            onClick={() => setShowDebugger(!showDebugger)}
          >
            Отладка API
          </Button>
          <Button onClick={() => setShowCRMSelector(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Подключить CRM
          </Button>
        </div>
      </div>

      {/* CRM Selector */}
      {showCRMSelector && (
        <Card className="p-6">
          <CRMSelector 
            onSelect={handleSelectCRM}
            connectedCRMs={connections.map(conn => conn.crmType)}
          />
        </Card>
      )}

      {/* API Debugger */}
      {showDebugger && (
        <KommoAPIDebugger />
      )}

      {/* CRM Config Modal */}
      {showCRMConfig && selectedCRM && (
        <CRMConfigModal
          isOpen={showCRMConfig}
          onClose={() => {
            setShowCRMConfig(false)
            setSelectedCRM(null)
          }}
          crmType={selectedCRM.id as 'kommo' | 'zoho' | 'bitrix24'}
          onSave={handleCRMConnection}
        />
      )}

      {/* Connected CRMs */}
      {connections.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Подключенные CRM системы</h2>
          
          {connections.map((connection) => (
            <Card key={connection.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-600">
                      {connection.config.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {connection.config.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Подключено {connection.lastSyncAt?.toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Настройки
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDisconnect(connection.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Отключить
                  </Button>
                </div>
              </div>

              {/* Universal Sync Component */}
              <UniversalSync
                crmType={connection.config.name}
                onSync={() => handleSync(connection.crmType)}
                lastSyncAt={connection.lastSyncAt}
                isConnected={connection.isConnected}
                accessToken={connection.accessToken}
                domain={connection.domain}
              />
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {connections.length === 0 && !showCRMSelector && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Нет подключенных CRM систем
          </h3>
          <p className="text-gray-600 mb-6">
            Подключите CRM систему для автоматической синхронизации воронок, статусов и каналов
          </p>
          <Button onClick={() => setShowCRMSelector(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Подключить CRM
          </Button>
        </Card>
      )}
    </div>
  )
}