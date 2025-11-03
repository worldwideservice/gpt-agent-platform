'use client'

import { useState } from 'react'
import { Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui'
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
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Выберите CRM систему</h2>
        <p className="text-gray-600">
          Подключите вашу CRM систему для автоматической синхронизации данных
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {supportedCRMs.map((crm) => {
          const isConnected = connectedCRMs.includes(crm.id)
          const isSelected = selectedCRM === crm.id

          return (
            <Card
              key={crm.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected ? 'bg-custom-50 ring-2 ring-custom-500' : ''
              } ${isConnected ? 'border-green-200 bg-green-50' : ''}`}
              onClick={() => !isConnected && handleSelect(crm)}
            >
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-white">
                      <span className="text-lg font-bold text-gray-600">
                        {crm.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{crm.name}</h3>
                      <p className="text-sm text-gray-500">{crm.authType}</p>
                    </div>
                  </div>
                  
                  {isConnected && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Подключено</span>
                    </div>
                  )}
                </div>

                <p className="mb-4 text-sm text-gray-600">
                  {crm.description}
                </p>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Поддерживаемые функции:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {crm.scopes.slice(0, 3).map((scope) => (
                      <span
                        key={scope}
                        className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"
                      >
                        {scope.replace(':', ' ')}
                      </span>
                    ))}
                    {crm.scopes.length > 3 && (
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                        +{crm.scopes.length - 3} еще
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {isConnected ? (
                    <Button variant="outline" disabled className="gap-2">
                      <Check className="w-4 h-4" />
                      Подключено
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSelect(crm)}
                      variant="default"
                      className="w-full gap-2"
                    >
                      Подключить
                      <ExternalLink className="w-4 h-4" />
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
