'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'

interface AgentPipelinesPageProps {
  params: {
    id: string
  }
}

interface Pipeline {
  id: string
  name: string
  stages: Stage[]
}

interface Stage {
  id: string
  name: string
  color: string
}

const mockPipelines: Pipeline[] = [
  {
    id: '1',
    name: 'Основная воронка',
    stages: [
      { id: '1', name: 'Не распределена', color: '#gray' },
      { id: '2', name: 'Распределена', color: '#blue' },
      { id: '3', name: 'Первичный контакт', color: '#cyan' },
      { id: '4', name: 'Квалификация', color: '#yellow' },
      { id: '5', name: 'Презентация', color: '#orange' },
      { id: '6', name: 'Переговоры', color: '#purple' },
      { id: '7', name: 'Закрыто успешно', color: '#green' },
      { id: '8', name: 'Закрыто неуспешно', color: '#red' },
    ],
  },
  {
    id: '2',
    name: 'Квалификация лидов',
    stages: [
      { id: '9', name: 'Новый лид', color: '#blue' },
      { id: '10', name: 'Квалифицирован', color: '#green' },
      { id: '11', name: 'Не квалифицирован', color: '#gray' },
    ],
  },
  {
    id: '3',
    name: 'Поддержка клиентов',
    stages: [
      { id: '12', name: 'Открыто', color: '#blue' },
      { id: '13', name: 'В работе', color: '#yellow' },
      { id: '14', name: 'Решено', color: '#green' },
    ],
  },
]

const AgentPipelinesPage = ({ params }: AgentPipelinesPageProps) => {
  const router = useRouter()
  const [selectedPipelines, setSelectedPipelines] = useState<string[]>(['1'])
  const [selectedStages, setSelectedStages] = useState<Record<string, string[]>>({
    '1': ['1', '2', '3', '4'],
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleBack = () => {
    router.push(`/agents/${params.id}`)
  }

  const handlePipelineToggle = (pipelineId: string) => {
    setSelectedPipelines(prev => {
      if (prev.includes(pipelineId)) {
        const newSelected = prev.filter(id => id !== pipelineId)
        const newStages = { ...selectedStages }
        delete newStages[pipelineId]
        setSelectedStages(newStages)
        return newSelected
      } else {
        return [...prev, pipelineId]
      }
    })
  }

  const handleStageToggle = (pipelineId: string, stageId: string) => {
    setSelectedStages(prev => {
      const pipelineStages = prev[pipelineId] || []
      if (pipelineStages.includes(stageId)) {
        return {
          ...prev,
          [pipelineId]: pipelineStages.filter(id => id !== stageId),
        }
      } else {
        return {
          ...prev,
          [pipelineId]: [...pipelineStages, stageId],
        }
      }
    })
  }

  const handleSelectAllStages = (pipelineId: string) => {
    const pipeline = mockPipelines.find(p => p.id === pipelineId)
    if (pipeline) {
      setSelectedStages(prev => ({
        ...prev,
        [pipelineId]: pipeline.stages.map(s => s.id),
      }))
    }
  }

  const handleDeselectAllStages = (pipelineId: string) => {
    setSelectedStages(prev => ({
      ...prev,
      [pipelineId]: [],
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Здесь будет сохранение настроек
    setTimeout(() => {
      setIsSaving(false)
      router.push(`/agents/${params.id}`)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Настройка воронок и этапов
            </h1>
            <p className="text-gray-600 mt-1">
              Выберите воронки и этапы сделок, где агент должен работать
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-5 h-5 mr-2" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardBody>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">!</span>
            </div>
            <div>
              <p className="font-semibold text-blue-900 mb-1">
                Рекомендация для тестирования
              </p>
              <p className="text-sm text-blue-800">
                Создайте тестовую воронку в Kommo и предоставьте доступ Агенту ИИ только к
                этой воронке. Это позволит безопасно тестировать Агента ИИ, не влияя на
                другие процессы.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="space-y-6">
        {mockPipelines.map(pipeline => {
          const isPipelineSelected = selectedPipelines.includes(pipeline.id)
          const pipelineStages = selectedStages[pipeline.id] || []

          return (
            <Card key={pipeline.id}>
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPipelineSelected}
                      onChange={() => handlePipelineToggle(pipeline.id)}
                      className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-lg font-semibold text-gray-900">
                      {pipeline.name}
                    </span>
                  </label>
                  {isPipelineSelected && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectAllStages(pipeline.id)}
                      >
                        Выбрать все
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeselectAllStages(pipeline.id)}
                      >
                        Снять все
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              {isPipelineSelected && (
                <CardBody>
                  <div className="space-y-2">
                    {pipeline.stages.map(stage => (
                      <label
                        key={stage.id}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={pipelineStages.includes(stage.id)}
                          onChange={() => handleStageToggle(pipeline.id, stage.id)}
                          className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                        />
                        <div className="flex items-center space-x-2 flex-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                stage.color === '#gray'
                                  ? '#9ca3af'
                                  : stage.color === '#blue'
                                  ? '#3b82f6'
                                  : stage.color === '#cyan'
                                  ? '#06b6d4'
                                  : stage.color === '#yellow'
                                  ? '#eab308'
                                  : stage.color === '#orange'
                                  ? '#f97316'
                                  : stage.color === '#purple'
                                  ? '#a855f7'
                                  : stage.color === '#green'
                                  ? '#22c55e'
                                  : stage.color === '#red'
                                  ? '#ef4444'
                                  : '#6b7280',
                            }}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {stage.name}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Выбрано этапов: <span className="font-semibold">{pipelineStages.length}</span>{' '}
                      из {pipeline.stages.length}
                    </p>
                  </div>
                </CardBody>
              )}
            </Card>
          )
        })}
      </div>

      {selectedPipelines.length === 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardBody>
            <p className="text-yellow-800">
              ⚠️ Не выбрано ни одной воронки. Агент не будет работать, пока вы не выберете
              хотя бы одну воронку и этап.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  )
}

export default AgentPipelinesPage

