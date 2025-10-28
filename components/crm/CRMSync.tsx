'use client'

import { useState } from 'react'
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { useKommo } from '@/hooks/useKommo'

interface CRMSyncProps {
  agentId: string
  agentName: string
}

export const CRMSync = ({ agentId, agentName }: CRMSyncProps) => {
  const { loading, error, createLead, getPipelines, getUsers } = useKommo()
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')
  const [lastSync, setLastSync] = useState<Date | null>(null)

  const handleSync = async () => {
    setSyncStatus('syncing')

    try {
      // Пример: создание тестовой сделки
      const lead = await createLead({
        name: `Тестовая сделка от агента ${agentName}`,
        price: 5000,
      })

      if (lead) {
        setSyncStatus('success')
        setLastSync(new Date())
      } else {
        setSyncStatus('error')
      }
    } catch (err) {
      console.error('Sync error:', err)
      setSyncStatus('error')
    }
  }

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'syncing':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
      default:
        return <RefreshCw className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h3 className="font-semibold text-gray-900">Синхронизация с CRM</h3>
              <p className="text-sm text-gray-600">
                {lastSync
                  ? `Последняя синхронизация: ${lastSync.toLocaleString('ru-RU')}`
                  : 'Ещё не синхронизировано'}
              </p>
            </div>
          </div>
          <Button onClick={handleSync} disabled={loading || syncStatus === 'syncing'}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Синхронизировать
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            Ошибка: {error}
          </div>
        )}

        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Автосоздание сделок
            </span>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-primary-600 rounded border-gray-300"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Синхронизация контактов
            </span>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-primary-600 rounded border-gray-300"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Добавление примечаний в CRM
            </span>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-primary-600 rounded border-gray-300"
            />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

