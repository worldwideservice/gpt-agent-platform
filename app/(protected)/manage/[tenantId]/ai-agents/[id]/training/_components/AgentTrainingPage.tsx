'use client'

import { useCallback, useEffect, useState } from 'react'
import { BookOpen, FileText, MessageSquare, Target, Upload, X } from 'lucide-react'

import { FileUpload } from '@/app/(protected)/agents/[id]/training/_components/FileUpload'

import { KwidButton, KwidInput, KwidSelect, KwidTextarea, KwidTabs, KwidTabsContent } from '@/components/kwid'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

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
  tenantId?: string
}

export const AgentTrainingPage = ({ agentId, agentName, tenantId }: AgentTrainingPageProps) => {
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
        setKnowledgeForm({
          category: 'company_info',
          title: '',
          content: '',
          priority: 0,
          isGlobal: true,
        })
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
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Обучение агента: {agentName}</h1>
        <p className="text-sm text-slate-500 dark:text-gray-400">
          Загрузите знания о компании, продукты, услуги, скрипты продаж и процессы работы
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-400" role="alert">
          {error}
        </div>
      )}

      <KwidTabs
        value={activeTab}
        onValueChange={setActiveTab}
        tabs={[
          { value: 'knowledge', label: 'Знания', icon: BookOpen },
          { value: 'scripts', label: 'Скрипты', icon: MessageSquare },
          { value: 'objections', label: 'Возражения', icon: FileText },
          { value: 'files', label: 'Файлы', icon: Upload },
          { value: 'memory', label: 'Память', icon: Target },
        ]}
        listClassName="grid w-full grid-cols-5"
      >
        {/* Вкладка: Структурированные знания */}
        <KwidTabsContent value="knowledge" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Добавить новое знание</h2>
              <p className="text-sm text-slate-500 dark:text-gray-400">
                Структурированная информация о компании для обучения агента
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <KwidSelect
                  label="Категория"
                  value={knowledgeForm.category}
                  onChange={(value: string) => setKnowledgeForm({ ...knowledgeForm, category: value as typeof knowledgeForm.category })}
                  options={categoryOptions}
                />
                <KwidInput
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

              <KwidInput
                label="Название"
                placeholder="Например: Наш основной продукт X"
                value={knowledgeForm.title}
                onChange={(e) => setKnowledgeForm({ ...knowledgeForm, title: e.target.value })}
                required
              />

              <KwidTextarea
                label="Содержание"
                placeholder="Подробное описание..."
                rows={8}
                value={knowledgeForm.content}
                onChange={(e) => setKnowledgeForm({ ...knowledgeForm, content: e.target.value })}
                required
              />

              <div className="flex items-center justify-end gap-3">
                <KwidButton variant="outline" onClick={() => setKnowledgeForm({
                  category: 'company_info',
                  title: '',
                  content: '',
                  priority: 0,
                  isGlobal: true,
                })}>
                  Очистить
                </KwidButton>
                <KwidButton variant="primary" onClick={handleCreateKnowledge} disabled={isSaving}>
                  {isSaving ? 'Сохранение...' : 'Сохранить знание'}
                </KwidButton>
              </div>
            </CardContent>
          </Card>

          {/* Список знаний */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Загруженные знания ({knowledge.length})
              </h2>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center text-sm text-slate-500 dark:text-gray-400">Загрузка...</div>
              ) : knowledge.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center dark:border-gray-800 dark:bg-gray-800">
                  <BookOpen className="mx-auto h-12 w-12 text-slate-400 dark:text-gray-500" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Нет знаний</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
                    Добавьте знания о компании, чтобы агент мог осмысленно отвечать на вопросы
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {knowledge.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-custom-100 px-2 py-1 text-xs font-medium text-custom-700 dark:bg-custom-900/30 dark:text-custom-400">
                              {item.category}
                            </span>
                            <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                            {item.priority > 0 && (
                              <span className="text-xs text-slate-500 dark:text-gray-400">Приоритет: {item.priority}</span>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">{item.content.slice(0, 200)}...</p>
                        </div>
                        <button
                          type="button"
                          className="text-slate-400 transition-colors hover:text-rose-500 dark:text-gray-500 dark:hover:text-rose-400"
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
        </KwidTabsContent>

        {/* Вкладка: Скрипты продаж */}
        <KwidTabsContent value="scripts" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Скрипты продаж</h2>
              <p className="text-sm text-slate-500 dark:text-gray-400">
                Создайте скрипты для разных этапов воронки продаж
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-4 space-y-4 dark:border-gray-800">
                <KwidInput
                  label="Название скрипта"
                  placeholder="Например: Приветствие для нового клиента"
                  value={scriptForm.title}
                  onChange={(e) => setScriptForm({ ...scriptForm, title: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <KwidSelect
                    label="Тип скрипта"
                    value={scriptForm.scriptType}
                    onChange={(value: string) => setScriptForm({ ...scriptForm, scriptType: value as SalesScript['scriptType'] })}
                    options={[
                      { value: 'greeting', label: 'Приветствие' },
                      { value: 'qualification', label: 'Квалификация' },
                      { value: 'presentation', label: 'Презентация' },
                      { value: 'objection_handling', label: 'Обработка возражений' },
                      { value: 'closing', label: 'Закрытие сделки' },
                    ]}
                  />
                </div>
                <KwidTextarea
                  label="Содержание скрипта"
                  placeholder="Введите текст скрипта..."
                  rows={8}
                  value={scriptForm.content}
                  onChange={(e) => setScriptForm({ ...scriptForm, content: e.target.value })}
                  required
                />
                <div className="flex items-center justify-end gap-3">
                  <KwidButton variant="outline" onClick={() => setScriptForm({
                    title: '',
                    scriptType: 'greeting',
                    content: '',
                    pipelineStageId: null,
                  })}>
                    Очистить
                  </KwidButton>
                  <KwidButton variant="primary" onClick={handleCreateScript} disabled={isSaving || !scriptForm.title.trim() || !scriptForm.content.trim()}>
                    {isSaving ? 'Сохранение...' : 'Сохранить скрипт'}
                  </KwidButton>
                </div>
              </div>

              {scripts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center dark:border-gray-800 dark:bg-gray-800">
                  <MessageSquare className="mx-auto h-12 w-12 text-slate-400 dark:text-gray-500" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Нет скриптов</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
                    Создайте скрипты для разных этапов воронки продаж
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scripts.map((script) => (
                    <div
                      key={script.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-custom-100 px-2 py-1 text-xs font-medium text-custom-700 dark:bg-custom-900/30 dark:text-custom-400">
                              {script.scriptType}
                            </span>
                            <h3 className="font-semibold text-slate-900 dark:text-white">{script.title}</h3>
                          </div>
                          <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">{script.content.slice(0, 200)}...</p>
                        </div>
                        <button
                          type="button"
                          className="text-slate-400 transition-colors hover:text-rose-500 dark:text-gray-500 dark:hover:text-rose-400"
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
        </KwidTabsContent>

        {/* Вкладка: Загрузка файлов */}
        <KwidTabsContent value="files" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Загрузка файлов</h2>
              <p className="text-sm text-slate-500 dark:text-gray-400">
                Загрузите документы о компании, они будут автоматически обработаны и добавлены в базу знаний.
              </p>
            </CardHeader>
            <CardContent>
              <FileUpload agentId={agentId} onUploadComplete={fetchKnowledge} />
            </CardContent>
          </Card>
        </KwidTabsContent>

        {/* Вкладка: Возражения */}
        <KwidTabsContent value="objections" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Ответы на возражения</h2>
              <p className="text-sm text-slate-500 dark:text-gray-400">
                Создайте готовые ответы на типичные возражения клиентов
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-4 space-y-4 dark:border-gray-800">
                <KwidSelect
                  label="Тип возражения"
                  value={objectionForm.objectionType}
                  onChange={(value: string) => setObjectionForm({ ...objectionForm, objectionType: value as ObjectionResponse['objectionType'] })}
                  options={[
                    { value: 'price', label: 'Цена' },
                    { value: 'timing', label: 'Время' },
                    { value: 'need', label: 'Нет потребности' },
                    { value: 'competitor', label: 'Конкурент' },
                    { value: 'trust', label: 'Доверие' },
                    { value: 'other', label: 'Другое' },
                  ]}
                />
                <KwidInput
                  label="Пример возражения (опционально)"
                  placeholder="Например: Это слишком дорого"
                  value={objectionForm.objectionText || ''}
                  onChange={(e) => setObjectionForm({ ...objectionForm, objectionText: e.target.value })}
                />
                <KwidTextarea
                  label="Ответ на возражение"
                  placeholder="Введите ответ, который должен дать агент..."
                  rows={8}
                  value={objectionForm.responseScript}
                  onChange={(e) => setObjectionForm({ ...objectionForm, responseScript: e.target.value })}
                  required
                />
                <div className="flex items-center justify-end gap-3">
                  <KwidButton variant="outline" onClick={() => setObjectionForm({
                    objectionType: 'price',
                    objectionText: '',
                    responseScript: '',
                  })}>
                    Очистить
                  </KwidButton>
                  <KwidButton variant="primary" onClick={handleCreateObjection} disabled={isSaving || !objectionForm.responseScript.trim()}>
                    {isSaving ? 'Сохранение...' : 'Сохранить ответ'}
                  </KwidButton>
                </div>
              </div>

              {objections.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center dark:border-gray-800 dark:bg-gray-800">
                  <MessageSquare className="mx-auto h-12 w-12 text-slate-400 dark:text-gray-500" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Нет ответов на возражения</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
                    Создайте готовые ответы на типичные возражения клиентов
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {objections.map((objection) => (
                    <div
                      key={objection.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              {objection.objectionType}
                            </span>
                            {objection.objectionText && (
                              <span className="text-sm text-slate-600 italic dark:text-gray-300">
                                "{objection.objectionText}"
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-slate-700 dark:text-gray-300">{objection.responseScript}</p>
                        </div>
                        <button
                          type="button"
                          className="text-slate-400 transition-colors hover:text-rose-500 dark:text-gray-500 dark:hover:text-rose-400"
                          aria-label="Удалить"
                          onClick={async () => {
                            if (!confirm('Удалить этот ответ на возражение?')) return

                            try {
                              const response = await fetch(`/api/agents/${agentId}/objections/${objection.id}`, {
                                method: 'DELETE',
                              })

                              if (!response.ok) {
                                throw new Error('Не удалось удалить ответ')
                              }

                              await fetchObjections()
                            } catch (error) {
                              console.error('Failed to delete objection', error)
                              alert('Ошибка удаления ответа')
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
        </KwidTabsContent>

        {/* Вкладка: Память агента */}
        <KwidTabsContent value="memory" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Долгосрочная память</h2>
              <p className="text-sm text-slate-500 dark:text-gray-400">
                Агент автоматически запоминает важные факты из взаимодействий с клиентами
              </p>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center dark:border-gray-800 dark:bg-gray-800">
                <Target className="mx-auto h-12 w-12 text-slate-400 dark:text-gray-500" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Память агента</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
                  Память формируется автоматически на основе диалогов с клиентами
                </p>
              </div>
            </CardContent>
          </Card>
        </KwidTabsContent>
      </KwidTabs>
    </div>
  )
}

