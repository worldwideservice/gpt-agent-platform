'use client'

import { useState } from 'react'
import { Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { CRMConfig } from '@/types/crm'

interface CRMSelectorProps {
  onSelect: (crmConfig: CRMConfig) => void
  connectedCRMs: string[]
}

// Список поддерживаемых CRM систем
const supportedCRMs: CRMConfig[] = [
  {
    id: 'kommo',
    name: 'Kommo CRM',
    logo: '/logos/kommo.svg',
    description: 'Популярная CRM система для управления продажами и клиентами. Более 100,000 компаний используют Kommo для автоматизации продаж.',
    authType: 'oauth2',
    baseUrl: 'https://kommo.com/api/v4',
    scopes: ['crm:read', 'crm:write', 'leads:read', 'leads:write'],
    fields: []
  },
  {
    id: 'zoho',
    name: 'Zoho CRM',
    logo: '/logos/zoho.svg',
    description: 'Комплексная CRM платформа от Zoho. Включает управление продажами, маркетинг и аналитику.',
    authType: 'oauth2',
    baseUrl: 'https://www.zohoapis.com/crm/v2',
    scopes: ['ZohoCRM.modules.ALL', 'ZohoCRM.users.ALL'],
    fields: []
  }
]

export const CRMSelector = ({ onSelect, connectedCRMs }: CRMSelectorProps) => {
  const [selectedCRM, setSelectedCRM] = useState<string>('')

  const handleSelect = (crmConfig: CRMConfig) => {
    setSelectedCRM(crmConfig.id)
    onSelect(crmConfig)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Выберите CRM систему</h2>
        <p className="text-gray-600">
          Подключите вашу CRM систему для автоматической синхронизации данных
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {supportedCRMs.map((crm) => {
          const isConnected = connectedCRMs.includes(crm.id)
          const isSelected = selectedCRM === crm.id

          return (
            <Card
              key={crm.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected ? 'ring-2 ring-primary-500 bg-primary-50' : ''
              } ${isConnected ? 'border-green-200 bg-green-50' : ''}`}
              onClick={() => !isConnected && handleSelect(crm)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-600">
                        {crm.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{crm.name}</h3>
                      <p className="text-sm text-gray-500">{crm.authType.toUpperCase()}</p>
                    </div>
                  </div>
                  
                  {isConnected && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Подключено</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4">{crm.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Поддерживаемые функции:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {crm.scopes.slice(0, 3).map((scope) => (
                      <span
                        key={scope}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {scope.replace(':', ' ')}
                      </span>
                    ))}
                    {crm.scopes.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{crm.scopes.length - 3} еще
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {isConnected ? (
                    <Button variant="outline" size="sm" disabled>
                      <Check className="w-4 h-4 mr-2" />
                      Подключено
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSelect(crm)}
                      size="sm"
                      className="w-full"
                    >
                      Подключить
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Не видите вашу CRM систему?{' '}
          <a href="/support" className="text-primary-600 hover:text-primary-700">
            Свяжитесь с нами
          </a>
        </p>
      </div>
    </div>
  )
}
