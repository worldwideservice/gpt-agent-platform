'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, ChevronDown, ChevronUp, X, Plus } from 'lucide-react'
import { KwidButton, KwidSwitch, KwidTextarea, KwidSelect } from '@/components/kwid'
import { Badge } from '@/components/ui/shadcn/badge'
import { useCRMData } from '@/hooks/useCRMData'
import type { UniversalPipeline, UniversalStage, CRMConnection } from '@/types/crm'

interface PipelineSettings {
 id: string
 name: string
 isActive: boolean
 allStages: boolean
 selectedStages: string[]
 stageInstructions?: Record<string, string>
}

interface CRMSyncProps {
 connection: CRMConnection | null
 pipelineSettings: PipelineSettings[]
 onPipelineUpdate: (pipelineId: string, updates: Partial<PipelineSettings>) => void
}

export const CRMSync = ({ connection, pipelineSettings, onPipelineUpdate }: CRMSyncProps) => {
 const [expandedPipelines, setExpandedPipelines] = useState<Set<string>>(new Set())
 
 const { 
 pipelines, 
 isLoading, 
 error, 
 syncData, 
 isConnected 
 } = useCRMData(connection)

 // Автоматически разворачиваем первую активную воронку
 useEffect(() => {
 if (pipelines.length > 0 && expandedPipelines.size === 0) {
 const firstActivePipeline = pipelines.find(p => p.isActive)
 if (firstActivePipeline) {
 setExpandedPipelines(new Set([firstActivePipeline.id]))
 }
 }
 }, [pipelines, expandedPipelines.size])

 const handleSync = async () => {
 await syncData()
 }

 const togglePipeline = (pipelineId: string) => {
 const newExpanded = new Set(expandedPipelines)
 if (newExpanded.has(pipelineId)) {
 newExpanded.delete(pipelineId)
 } else {
 newExpanded.add(pipelineId)
 }
 setExpandedPipelines(newExpanded)
 }

 const toggleStage = (pipelineId: string, stageId: string) => {
 const settings = pipelineSettings.find(p => p.id === pipelineId)
 if (!settings) return

 const newSelectedStages = settings.selectedStages.includes(stageId)
 ? settings.selectedStages.filter(id => id !== stageId)
 : [...settings.selectedStages, stageId]

 onPipelineUpdate(pipelineId, { selectedStages: newSelectedStages })
 }

 const removeStage = (pipelineId: string, stageId: string) => {
 const settings = pipelineSettings.find(p => p.id === pipelineId)
 if (!settings) return

 const newSelectedStages = settings.selectedStages.filter(id => id !== stageId)
 onPipelineUpdate(pipelineId, { selectedStages: newSelectedStages })
 }

 // Получаем настройки для воронки или создаем дефолтные
 const getPipelineSettings = (pipelineId: string): PipelineSettings => {
 const settings = pipelineSettings.find(p => p.id === pipelineId)
 if (settings) return settings

 // Создаем дефолтные настройки
 const pipeline = pipelines.find(p => p.id === pipelineId)
 return {
 id: pipelineId,
 name: pipeline?.name || 'Неизвестная воронка',
 isActive: false,
 allStages: false,
 selectedStages: [],
 stageInstructions: {},
 }
 }

 return (
 <div className="space-y-6">
 {/* Кнопка синхронизации и описание */}
 <div className="flex items-center justify-between mb-4">
 <div className="flex-1"></div>
 <KwidButton 
 onClick={handleSync} 
 disabled={isLoading}
 variant="outline"
 size="sm"
 className="gap-2"
 >
 <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
 Синхронизировать настройки CRM
 </KwidButton>
 </div>

 <div className="space-y-4">
 {pipelines.map((pipeline) => {
 const settings = getPipelineSettings(pipeline.id)
 return (
 <div key={pipeline.id} className="border border-gray-200 rounded-lg
 {/* Pipeline Header */}
 <div className="flex items-center justify-between p-4 bg-gray-50
 <div className="flex items-center space-x-3 flex-1">
 <button
 onClick={() => togglePipeline(pipeline.id)}
 className="text-gray-400 hover:text-gray-600 transition-colors
 aria-label={expandedPipelines.has(pipeline.id) ? 'Свернуть' : 'Развернуть'}
 >
 {expandedPipelines.has(pipeline.id) ? (
 <ChevronUp className="w-5 h-5" />
 ) : (
 <ChevronDown className="w-5 h-5" />
 )}
 </button>
 <h3 className="font-medium text-gray-900 uppercase
 </div>
 
 <KwidSwitch
 checked={settings.isActive}
 onCheckedChange={(checked) => onPipelineUpdate(pipeline.id, { isActive: checked })}
 />
 </div>

 {/* Pipeline Content */}
 {expandedPipelines.has(pipeline.id) && (
 <div className="px-4 pb-4 space-y-4 border-t border-gray-100
 {/* All Stages Toggle */}
 <div className="flex items-center justify-between">
 <KwidSwitch
 checked={settings.allStages}
 onCheckedChange={(checked) => onPipelineUpdate(pipeline.id, { 
 allStages: checked,
 selectedStages: checked ? pipeline.stages.map(s => s.id) : []
 })}
 label="Все этапы сделок"
 />
 </div>

 {/* Selected Stages */}
 {!settings.allStages && (
 <div>
 <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2
 Выберите этапы сделок
 <span className="text-red-500">*</span>
 <button
 type="button"
 className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100
 title="Информация о выборе этапов сделок"
 >
 <span className="text-xs">i</span>
 </button>
 </label>
 
 {/* Selected Stages Tags */}
 <div className="flex flex-wrap gap-2 mb-3">
 {settings.selectedStages.map((stageId) => {
 const stage = pipeline.stages.find(s => s.id === stageId)
 return stage ? (
 <Badge key={stageId} variant="secondary" className="flex items-center space-x-1">
 <span>{stage.name}</span>
 <button
 onClick={() => removeStage(pipeline.id, stageId)}
 className="ml-1 hover:text-red-600"
 >
 <X className="w-3 h-3" />
 </button>
 </Badge>
 ) : null
 })}
 </div>

 {/* Available Stages Dropdown */}
 <KwidSelect
 options={[
 { value: '', label: 'Выбрать вариант' },
 ...pipeline.stages
 .filter(stage => !settings.selectedStages.includes(stage.id))
 .map((stage) => ({ value: stage.id, label: stage.name })),
 ]}
 value=""
 onChange={(value) => {
 if (value) {
 toggleStage(pipeline.id, value)
 }
 }}
 />
 </div>
 )}

 {/* Instructions for Deal Stage */}
 {settings.selectedStages.length > 0 && (
 <div className="space-y-3">
 <div>
 <h4 className="text-sm font-medium text-gray-700 mb-2">
 Инструкции для этапа сделки
 </h4>
 <p className="text-sm text-gray-600 mb-3">
 Настройте, как агент отвечает на каждом этапе сделки
 </p>
 </div>
 {settings.selectedStages.map((stageId) => {
 const stage = pipeline.stages.find(s => s.id === stageId)
 if (!stage) return null

 const instructions = (settings.stageInstructions as Record<string, string>) || {}
 const currentInstruction = instructions[stageId] || ''

 return (
 <div key={stageId} className="border border-gray-200 rounded-lg p-3
 <label className="block text-sm font-medium text-gray-700 mb-2
 {stage.name}
 </label>
 <KwidTextarea
 placeholder="Введите инструкции для этого этапа..."
 value={currentInstruction}
 onChange={(e) => {
 const newInstructions = {
 ...instructions,
 [stageId]: e.target.value,
 }
 onPipelineUpdate(pipeline.id, {
 stageInstructions: newInstructions,
 })
 }}
 rows={3}
 />
 <p className="mt-1 text-xs text-gray-500
 Эти инструкции будут использоваться агентом при работе с этой стадией сделки
 </p>
 </div>
 )
 })}
 </div>
 )}
 </div>
 )}
 </div>
 )
 })}
 </div>
 </div>
 )
}
