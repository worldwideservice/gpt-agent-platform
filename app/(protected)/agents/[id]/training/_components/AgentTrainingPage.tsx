'use client'

import { useCallback, useEffect, useState } from 'react'
import { BookOpen, FileText, MessageSquare, Target, Upload, X } from 'lucide-react'

import { FileUpload } from './FileUpload'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Textarea } from '@/components/ui/Textarea'

interface KnowledgeItem {
  id: string
  category: string
  title: string
  content: string
  priority: number
}

interface SalesScript {
  id: string
  title: string
  scriptType: 'greeting' | 'qualification' | 'presentation' | 'objection_handling' | 'closing'
  content: string
  pipelineStageId?: string | null
}

interface ObjectionResponse {
  id: string
  objectionType: 'price' | 'timing' | 'need' | 'competitor' | 'trust' | 'other'
  objectionText?: string | null
  responseScript: string
}

interface AgentTrainingPageProps {
  agentId: string
  agentName: string
}

export const AgentTrainingPage = ({ agentId, agentName }: AgentTrainingPageProps) => {
  const [activeTab, setActiveTab] = useState('knowledge')
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([])
  const [scripts, setScripts] = useState<SalesScript[]>([])
  const [objections, setObjections] = useState<ObjectionResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Формы для создания знаний
  const [knowledgeForm, setKnowledgeForm] = useState({
    category: 'company_info' as const,
    title: '',
    content: '',
    priority: 0,
    isGlobal: true,
  })

  const [isSaving, setIsSaving] = useState(false)

  // Формы для скриптов
  const [scriptForm, setScriptForm] = useState({
    title: '',
    scriptType: 'greeting' as SalesScript['scriptType'],
    content: '',
    pipelineStageId: null as string | null,
  })

  // Формы для возражений
  const [objectionForm, setObjectionForm] = useState({
    objectionType: 'price' as ObjectionResponse['objectionType'],
    objectionText: '',
    responseScript: '',
  })

  // Загрузка существующих знаний
  const fetchKnowledge = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/agents/${agentId}/knowledge`)
      if (!response.ok) {
        throw new Error('Не удалось загрузить знания')
      }

      const payload = (await response.json()) as {
        success: boolean
        data: KnowledgeItem[]
      }

      if (payload.success) {
        setKnowledge(payload.data)
      }
    } catch (err) {
      console.error('Failed to fetch knowledge', err)
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      setIsLoading(false)
    }
  }, [agentId])

  // Загрузка скриптов
  const fetchScripts = useCallback(async () => {
    try {
      const response = await fetch(`/api/agents/${agentId}/scripts`)
      if (!response.ok) {
        throw new Error('Не удалось загрузить скрипты')
      }

      const payload = (await response.json()) as {
        success: boolean
        data: SalesScript[]
      }

      if (payload.success) {
        setScripts(payload.data)
      }
    } catch (err) {
      console.error('Failed to fetch scripts', err)
    }
  }, [agentId])

  // Загрузка возражений
  const fetchObjections = useCallback(async () => {
    try {
      const response = await fetch(`/api/agents/${agentId}/objections`)
      if (!response.ok) {
        throw new Error('Не удалось загрузить возражения')
      }

      const payload = (await response.json()) as {
        success: boolean
        data: ObjectionResponse[]
      }

      if (payload.success) {
        setObjections(payload.data)
      }
    } catch (err) {
      console.error('Failed to fetch objections', err)
    }
  }, [agentId])

  useEffect(() => {
    void Promise.all([fetchKnowledge(), fetchScripts(), fetchObjections()]).finally(() => {
      setIsLoading(false)
    })
  }, [fetchKnowledge, fetchScripts, fetchObjections])

  // Создание нового знания
  const handleCreateKnowledge = useCallback(async () => {
    if (!knowledgeForm.title.trim() || !knowledgeForm.content.trim()) {
      setError('Заполните все обязательные поля')
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      const response = await fetch(`/api/agents/${agentId}/knowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(knowledgeForm),
      })

      if (!response.ok) {
        throw new Error('Не удалось создать знание')
      }

      const payload = (await response.json()) as { success: boolean }

      if (payload.success) {
        // Очищаем форму
        setKnowledgeForm({
          category: 'company_info',
          title: '',
          content: '',
          priority: 0,
          isGlobal: true,
        })

        // Обновляем список
        await fetchKnowledge()
      }
    } catch (err) {
      console.error('Failed to create knowledge', err)
      setError(err instanceof Error ? err.message : 'Ошибка создания')
    } finally {
      setIsSaving(false)
    }
  }, [agentId, knowledgeForm, fetchKnowledge])

  // Создание скрипта
  const handleCreateScript = useCallback(async () => {
    if (!scriptForm.title.trim() || !scriptForm.content.trim()) {
      setError('Заполните все обязательные поля')
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      const response = await fetch(`/api/agents/${agentId}/scripts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scriptForm),
      })

      if (!response.ok) {
        throw new Error('Не удалось создать скрипт')
      }

      const payload = (await response.json()) as { success: boolean }

      if (payload.success) {
        setScriptForm({
          title: '',
          scriptType: 'greeting',
          content: '',
          pipelineStageId: null,
        })
        await fetchScripts()
      }
    } catch (err) {
      console.error('Failed to create script', err)
      setError(err instanceof Error ? err.message : 'Ошибка создания')
    } finally {
      setIsSaving(false)
    }
  }, [agentId, scriptForm, fetchScripts])

  // Создание ответа на возражение
  const handleCreateObjection = useCallback(async () => {
    if (!objectionForm.responseScript.trim()) {
      setError('Заполните ответ на возражение')
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      const response = await fetch(`/api/agents/${agentId}/objections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objectionType: objectionForm.objectionType,
          objectionText: objectionForm.objectionText || null,
          responseScript: objectionForm.responseScript,
        }),
      })

      if (!response.ok) {
        throw new Error('Не удалось создать ответ на возражение')
      }

      const payload = (await response.json()) as { success: boolean }

      if (payload.success) {
        setObjectionForm({
          objectionType: 'price',
          objectionText: '',
          responseScript: '',
        })
        await fetchObjections()
      }
    } catch (err) {
      console.error('Failed to create objection', err)
      setError(err instanceof Error ? err.message : 'Ошибка создания')
    } finally {
      setIsSaving(false)
    }
  }, [agentId, objectionForm, fetchObjections])

  const categoryOptions = [
    { value: 'company_info', label: 'Информация о компании' },
    { value: 'product', label: 'Продукты' },
    { value: 'service', label: 'Услуги' },
    { value: 'process', label: 'Процессы' },
    { value: 'script', label: 'Скрипты' },
    { value: 'objection', label: 'Возражения' },
  ]

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Обучение агента: {agentName}</h1>
        <p className="text-sm text-slate-500">
          Загрузите знания о компании, продукты, услуги, скрипты продаж и процессы работы
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">
          {error}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="knowledge">
            <BookOpen className="mr-2 h-4 w-4" /> Знания
          </TabsTrigger>
          <TabsTrigger value="scripts">
            <MessageSquare className="mr-2 h-4 w-4" /> Скрипты
          </TabsTrigger>
          <TabsTrigger value="objections">
            <FileText className="mr-2 h-4 w-4" /> Возражения
          </TabsTrigger>
          <TabsTrigger value="files">
            <Upload className="mr-2 h-4 w-4" /> Файлы
          </TabsTrigger>
          <TabsTrigger value="memory">
            <Target className="mr-2 h-4 w-4" /> Память
          </TabsTrigger>
        </TabsList>

        {/* Вкладка: Структурированные знания */}
        <TabsContent value="knowledge" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">Добавить новое знание</h2>
              <p className="text-sm text-slate-500">
                Структурированная информация о компании для обучения агента
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Категория"
                    value={knowledgeForm.category}
                    onChange={(value: string) => setKnowledgeForm({ ...knowledgeForm, category: value as typeof knowledgeForm.category })}
                    options={categoryOptions}
                  />
                </div>
                <div>
                  <Input
                    label="Приоритет (0-100)"
                    type="number"
                    min="0"
                    max="100"
                    value={knowledgeForm.priority.toString()}
                    onChange={(e) =>
                      setKnowledgeForm({ ...knowledgeForm, priority: Number.parseInt(e.target.value, 10) || 0 })
                    }
                  />
                </div>
              </div>

              <Input
                label="Название"
                placeholder="Например: Наш основной продукт X"
                value={knowledgeForm.title}
                onChange={(e) => setKnowledgeForm({ ...knowledgeForm, title: e.target.value })}
                required
              />

              <Textarea
                label="Содержание"
                placeholder="Подробное описание..."
                rows={8}
                value={knowledgeForm.content}
                onChange={(e) => setKnowledgeForm({ ...knowledgeForm, content: e.target.value })}
                required
              />

              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => setKnowledgeForm({
                  category: 'company_info',
                  title: '',
                  content: '',
                  priority: 0,
                  isGlobal: true,
                })}>
                  Очистить
                </Button>
                <Button onClick={handleCreateKnowledge} disabled={isSaving}>
                  {isSaving ? 'Сохранение...' : 'Сохранить знание'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Список знаний */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">
                Загруженные знания ({knowledge.length})
              </h2>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center text-sm text-slate-500">Загрузка...</div>
              ) : knowledge.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">Нет знаний</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Добавьте знания о компании, чтобы агент мог осмысленно отвечать на вопросы
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {knowledge.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700">
                              {item.category}
                            </span>
                            <h3 className="font-semibold text-slate-900">{item.title}</h3>
                            {item.priority > 0 && (
                              <span className="text-xs text-slate-500">Приоритет: {item.priority}</span>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-slate-600">{item.content.slice(0, 200)}...</p>
                        </div>
                        <button
                          type="button"
                          className="text-slate-400 transition-colors hover:text-rose-500"
                          aria-label="Удалить"
                          onClick={async () => {
                            if (!confirm('Удалить это знание?')) return

                            try {
                              const response = await fetch(`/api/agents/${agentId}/knowledge/${item.id}`, {
                                method: 'DELETE',
                              })

                              if (!response.ok) {
                                throw new Error('Не удалось удалить знание')
                              }

                              await fetchKnowledge()
                            } catch (error) {
                              console.error('Failed to delete knowledge', error)
                              alert('Ошибка удаления знания')
                            }
                          }}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка: Скрипты продаж */}
        <TabsContent value="scripts" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">Скрипты продаж</h2>
              <p className="text-sm text-slate-500">
                Создайте скрипты для разных этапов воронки продаж
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Форма создания скрипта */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-4">
                <Input
                  label="Название скрипта"
                  placeholder="Например: Приветствие для нового клиента"
                  value={scriptForm.title}
                  onChange={(e) => setScriptForm({ ...scriptForm, title: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Тип скрипта"
                    value={scriptForm.scriptType}
                    onChange={(value) => setScriptForm({ ...scriptForm, scriptType: value as SalesScript['scriptType'] })}
                    options={[
                      { value: 'greeting', label: 'Приветствие' },
                      { value: 'qualification', label: 'Квалификация' },
                      { value: 'presentation', label: 'Презентация' },
                      { value: 'objection_handling', label: 'Обработка возражений' },
                      { value: 'closing', label: 'Закрытие сделки' },
                    ]}
                  />
                </div>
                <Textarea
                  label="Содержание скрипта"
                  placeholder="Введите текст скрипта..."
                  rows={8}
                  value={scriptForm.content}
                  onChange={(e) => setScriptForm({ ...scriptForm, content: e.target.value })}
                  required
                />
                <div className="flex items-center justify-end gap-3">
                  <Button variant="outline" onClick={() => setScriptForm({
                    title: '',
                    scriptType: 'greeting',
                    content: '',
                    pipelineStageId: null,
                  })}>
                    Очистить
                  </Button>
                  <Button onClick={handleCreateScript} disabled={isSaving || !scriptForm.title.trim() || !scriptForm.content.trim()}>
                    {isSaving ? 'Сохранение...' : 'Сохранить скрипт'}
                  </Button>
                </div>
              </div>

              {/* Список скриптов */}
              {scripts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">Нет скриптов</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Создайте скрипты для разных этапов воронки продаж
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scripts.map((script) => (
                    <div
                      key={script.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700">
                              {script.scriptType}
                            </span>
                            <h3 className="font-semibold text-slate-900">{script.title}</h3>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">{script.content.slice(0, 200)}...</p>
                        </div>
                        <button
                          type="button"
                          className="text-slate-400 transition-colors hover:text-rose-500"
                          aria-label="Удалить"
                          onClick={async () => {
                            if (!confirm('Удалить этот скрипт?')) return

                            try {
                              const response = await fetch(`/api/agents/${agentId}/scripts/${script.id}`, {
                                method: 'DELETE',
                              })

                              if (!response.ok) {
                                throw new Error('Не удалось удалить скрипт')
                              }

                              await fetchScripts()
                            } catch (error) {
                              console.error('Failed to delete script', error)
                              alert('Ошибка удаления скрипта')
                            }
                          }}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка: Загрузка файлов */}
        <TabsContent value="files" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">Загрузка файлов</h2>
              <p className="text-sm text-slate-500">
                Загрузите документы о компании, они будут автоматически обработаны и добавлены в базу знаний.
                Система автоматически извлечет Knowledge Graph (сущности и связи) для осмысленного понимания контента.
              </p>
            </CardHeader>
            <CardContent>
              <FileUpload agentId={agentId} onUploadComplete={fetchKnowledge} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка: Возражения */}
        <TabsContent value="objections" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">Ответы на возражения</h2>
              <p className="text-sm text-slate-500">
                Создайте готовые ответы на типичные возражения клиентов
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Форма создания ответа на возражение */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-4">
                <Select
                  label="Тип возражения"
                  value={objectionForm.objectionType}
                  onChange={(value) => setObjectionForm({ ...objectionForm, objectionType: value as ObjectionResponse['objectionType'] })}
                  options={[
                    { value: 'price', label: 'Цена' },
                    { value: 'timing', label: 'Время' },
                    { value: 'need', label: 'Нет потребности' },
                    { value: 'competitor', label: 'Конкурент' },
                    { value: 'trust', label: 'Доверие' },
                    { value: 'other', label: 'Другое' },
                  ]}
                />
                <Input
                  label="Пример возражения (опционально)"
                  placeholder="Например: Это слишком дорого"
                  value={objectionForm.objectionText || ''}
                  onChange={(e) => setObjectionForm({ ...objectionForm, objectionText: e.target.value })}
                />
                <Textarea
                  label="Ответ на возражение"
                  placeholder="Введите ответ, который должен дать агент..."
                  rows={8}
                  value={objectionForm.responseScript}
                  onChange={(e) => setObjectionForm({ ...objectionForm, responseScript: e.target.value })}
                  required
                />
                <div className="flex items-center justify-end gap-3">
                  <Button variant="outline" onClick={() => setObjectionForm({
                    objectionType: 'price',
                    objectionText: '',
                    responseScript: '',
                  })}>
                    Очистить
                  </Button>
                  <Button onClick={handleCreateObjection} disabled={isSaving || !objectionForm.responseScript.trim()}>
                    {isSaving ? 'Сохранение...' : 'Сохранить ответ'}
                  </Button>
                </div>
              </div>

              {/* Список ответов на возражения */}
              {objections.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">Нет ответов на возражения</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Создайте готовые ответы на типичные возражения клиентов
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {objections.map((objection) => (
                    <div
                      key={objection.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                              {objection.objectionType}
                            </span>
                            {objection.objectionText && (
                              <span className="text-sm text-slate-600 italic">
                                "{objection.objectionText}"
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-slate-700">{objection.responseScript}</p>
                        </div>
                        <button
                          type="button"
                          className="text-slate-400 transition-colors hover:text-rose-500"
                          aria-label="Удалить"
                          onClick={async () => {
                            if (!confirm('Удалить этот скрипт?')) return

                            try {
                              const response = await fetch(`/api/agents/${agentId}/scripts/${script.id}`, {
                                method: 'DELETE',
                              })

                              if (!response.ok) {
                                throw new Error('Не удалось удалить скрипт')
                              }

                              await fetchScripts()
                            } catch (error) {
                              console.error('Failed to delete script', error)
                              alert('Ошибка удаления скрипта')
                            }
                          }}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка: Память агента */}
        <TabsContent value="memory" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">Долгосрочная память</h2>
              <p className="text-sm text-slate-500">
                Агент автоматически запоминает важные факты из взаимодействий с клиентами
              </p>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                <Target className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">Память агента</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Память формируется автоматически на основе диалогов с клиентами
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

