'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { KwidButton } from '@/components/kwid'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/shadcn/badge'
import type { SyncResult, UniversalPipeline, UniversalChannel } from '@/types/crm'

interface UniversalSyncProps {
 crmType: string
 onSync: () => Promise<SyncResult>
 lastSyncAt?: Date
 isConnected: boolean
 accessToken?: string
 domain?: string
}

export const UniversalSync = ({ 
 crmType, 
 onSync, 
 lastSyncAt, 
 isConnected,
 accessToken,
 domain
}: UniversalSyncProps) => {
 const [isLoading, setIsLoading] = useState(false)
 const [syncResult, setSyncResult] = useState<SyncResult | null>(null)
 const [lastSync, setLastSync] = useState<Date | null>(lastSyncAt || null)

 const handleSync = async () => {
 if (!isConnected) {
 alert('Сначала подключите CRM систему')
 return
 }

 setIsLoading(true)
 try {
 // Используем новый универсальный API endpoint для синхронизации
 const response = await fetch('/api/crm/sync', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 },
 body: JSON.stringify({
 crmType: crmType.toLowerCase(),
 accessToken: accessToken,
 domain: domain
 })
 })

 const data = await response.json()
 
 if (data.success) {
 setSyncResult(data.data)
 setLastSync(data.data.lastSyncAt)
 } else {
 setSyncResult({
 success: false,
 pipelines: [],
 channels: [],
 contacts: [],
 deals: [],
 tasks: [],
 errors: [data.error || 'Ошибка синхронизации'],
 lastSyncAt: new Date()
 })
 }
 } catch (error) {
 console.error('Ошибка синхронизации:', error)
 setSyncResult({
 success: false,
 pipelines: [],
 channels: [],
 contacts: [],
 deals: [],
 tasks: [],
 errors: [`Ошибка синхронизации: ${error}`],
 lastSyncAt: new Date()
 })
 } finally {
 setIsLoading(false)
 }
 }

 const getStatusIcon = () => {
 if (isLoading) return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
 if (syncResult?.success) return <CheckCircle className="w-4 h-4 text-green-500" />
 if (syncResult && !syncResult.success) return <XCircle className="w-4 h-4 text-red-500" />
 return <AlertCircle className="w-4 h-4 text-gray-400" />
 }

 const getStatusText = () => {
 if (isLoading) return 'Синхронизация...'
 if (syncResult?.success) return 'Синхронизировано'
 if (syncResult && !syncResult.success) return 'Ошибка синхронизации'
 return 'Не синхронизировано'
 }

 const getStatusColor = () => {
 if (isLoading) return 'bg-blue-100 text-blue-800'
 if (syncResult?.success) return 'bg-green-100 text-green-800'
 if (syncResult && !syncResult.success) return 'bg-red-100 text-red-800'
 return 'bg-gray-100 text-gray-800'
 }

 return (
 <div className="space-y-6">
 {/* Статус синхронизации */}
 <Card className="p-6">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center space-x-3">
 <RefreshCw className="w-5 h-5 text-gray-600" />
 <h2 className="text-lg font-semibold text-gray-900">
 Синхронизация с {crmType}
 </h2>
 </div>
 
 <div className="flex items-center space-x-3">
 <Badge className={getStatusColor()}>
 {getStatusIcon()}
 <span className="ml-1">{getStatusText()}</span>
 </Badge>
 
 <KwidButton 
 onClick={handleSync} 
 disabled={isLoading || !isConnected}
 variant="outline"
 size="sm"
 className="gap-2"
 >
 <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
 Синхронизировать
 </KwidButton>
 </div>
 </div>

 {lastSync && (
 <p className="text-sm text-gray-600">
 Последняя синхронизация: {lastSync.toLocaleString('ru-RU')}
 </p>
 )}
 </Card>

 {/* Результаты синхронизации */}
 {syncResult && (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
 <Card className="p-4">
 <div className="flex items-center space-x-2">
 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
 <span className="text-blue-600 font-semibold text-sm">
 {syncResult.pipelines.length}
 </span>
 </div>
 <div>
 <p className="text-sm font-medium text-gray-900">Воронки</p>
 <p className="text-xs text-gray-500">Синхронизировано</p>
 </div>
 </div>
 </Card>

 <Card className="p-4">
 <div className="flex items-center space-x-2">
 <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
 <span className="text-green-600 font-semibold text-sm">
 {syncResult.channels.length}
 </span>
 </div>
 <div>
 <p className="text-sm font-medium text-gray-900">Каналы</p>
 <p className="text-xs text-gray-500">Синхронизировано</p>
 </div>
 </div>
 </Card>

 <Card className="p-4">
 <div className="flex items-center space-x-2">
 <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
 <span className="text-purple-600 font-semibold text-sm">
 {syncResult.contacts.length}
 </span>
 </div>
 <div>
 <p className="text-sm font-medium text-gray-900">Контакты</p>
 <p className="text-xs text-gray-500">Синхронизировано</p>
 </div>
 </div>
 </Card>

 <Card className="p-4">
 <div className="flex items-center space-x-2">
 <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
 <span className="text-orange-600 font-semibold text-sm">
 {syncResult.deals.length}
 </span>
 </div>
 <div>
 <p className="text-sm font-medium text-gray-900">Сделки</p>
 <p className="text-xs text-gray-500">Синхронизировано</p>
 </div>
 </div>
 </Card>
 </div>
 )}

 {/* Ошибки */}
 {syncResult && syncResult.errors.length > 0 && (
 <Card className="p-4 border-red-200 bg-red-50">
 <div className="flex items-start space-x-2">
 <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
 <div>
 <h3 className="text-sm font-medium text-red-800 mb-2">Ошибки синхронизации:</h3>
 <ul className="text-sm text-red-700 space-y-1">
 {syncResult.errors.map((error, index) => (
 <li key={index}>• {error}</li>
 ))}
 </ul>
 </div>
 </div>
 </Card>
 )}

 {/* Синхронизированные данные */}
 {syncResult && syncResult.success && (
 <div className="space-y-4">
 {/* Воронки */}
 {syncResult.pipelines.length > 0 && (
 <Card className="p-4">
 <h3 className="text-sm font-medium text-gray-900 mb-3">Синхронизированные воронки:</h3>
 <div className="space-y-2">
 {syncResult.pipelines.map((pipeline) => (
 <div key={pipeline.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
 <span className="text-sm text-gray-700">{pipeline.name}</span>
 <Badge variant="secondary" className="text-xs">
 {pipeline.stages.length} этапов
 </Badge>
 </div>
 ))}
 </div>
 </Card>
 )}

 {/* Каналы */}
 {syncResult.channels.length > 0 && (
 <Card className="p-4">
 <h3 className="text-sm font-medium text-gray-900 mb-3">Синхронизированные каналы:</h3>
 <div className="flex flex-wrap gap-2">
 {syncResult.channels.map((channel) => (
 <Badge 
 key={channel.id} 
 variant={channel.isActive ? "default" : "secondary"}
 className="text-xs"
 >
 {channel.name}
 </Badge>
 ))}
 </div>
 </Card>
 )}
 </div>
 )}
 </div>
 )
}
