'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, ChevronDown, ChevronRight, Plus } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Textarea,
  Switch,
  MultiSelect,
} from '@/components/ui'
import type { MultiSelectOption } from '@/components/ui'

interface Agent {
  id: string
  name: string
}

interface AgentLeadsContactsFormProps {
  agent: Agent
  tenantId: string
}

// Mock CRM fields - in real app, fetch from API
const LEAD_FIELDS: MultiSelectOption[] = [
  { value: 'name', label: 'Название сделки' },
  { value: 'responsible_user_id', label: 'Ответственный пользователь' },
  { value: 'status_id', label: 'Этап сделки' },
  { value: 'budget', label: 'Бюджет' },
  { value: 'created_at', label: 'Дата создания' },
  { value: 'tags', label: 'Теги' },
  { value: 'cf_564832', label: 'Тип услуги' },
  { value: 'cf_878912', label: 'Email' },
]

const CONTACT_FIELDS: MultiSelectOption[] = [
  { value: 'name', label: 'Имя контакта' },
  { value: 'responsible_user_id', label: 'Ответственный пользователь' },
  { value: 'created_at', label: 'Дата создания' },
  { value: 'tags', label: 'Теги' },
  { value: 'cf_438092', label: 'Email' },
  { value: 'cf_491700', label: 'Страна' },
]

interface FieldUpdateRule {
  id: string
  fieldValue: string
  overwriteExisting: boolean
  updateCondition: string
}

export function AgentLeadsContactsForm({ agent, tenantId }: AgentLeadsContactsFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  // Data access settings state
  const [leadDataExpanded, setLeadDataExpanded] = useState(true)
  const [contactDataExpanded, setContactDataExpanded] = useState(true)
  const [selectedLeadFields, setSelectedLeadFields] = useState<string[]>(['name', 'responsible_user_id'])
  const [selectedContactFields, setSelectedContactFields] = useState<string[]>(['name', 'tags'])

  // Data input settings state
  const [leadInputExpanded, setLeadInputExpanded] = useState(false)
  const [contactInputExpanded, setContactInputExpanded] = useState(false)
  const [leadUpdateRules, setLeadUpdateRules] = useState<FieldUpdateRule[]>([
    {
      id: '1',
      fieldValue: 'cf_564832',
      overwriteExisting: false,
      updateCondition: 'Когда клиент говорит о услуге которая его интересует',
    },
  ])
  const [contactUpdateRules, setContactUpdateRules] = useState<FieldUpdateRule[]>([
    {
      id: '1',
      fieldValue: 'cf_438092',
      overwriteExisting: true,
      updateCondition: 'Когда клиент указывает свой email',
    },
  ])

  const handleSyncCRM = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch(`/api/tenants/${tenantId}/agents/${agent.id}/sync-crm`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to sync CRM')
      }

      router.refresh()
    } catch (error) {
      console.error('Error syncing CRM:', error)
      // TODO: Show error toast
    } finally {
      setIsSyncing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/tenants/${tenantId}/agents/${agent.id}/leads-contacts`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedLeadFields,
          selectedContactFields,
          leadUpdateRules,
          contactUpdateRules,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update agent')
      }

      router.refresh()
    } catch (error) {
      console.error('Error updating agent:', error)
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/manage/${tenantId}/ai-agents`)
  }

  const addLeadUpdateRule = () => {
    setLeadUpdateRules([
      ...leadUpdateRules,
      {
        id: Date.now().toString(),
        fieldValue: '',
        overwriteExisting: false,
        updateCondition: '',
      },
    ])
  }

  const addContactUpdateRule = () => {
    setContactUpdateRules([
      ...contactUpdateRules,
      {
        id: Date.now().toString(),
        fieldValue: '',
        overwriteExisting: false,
        updateCondition: '',
      },
    ])
  }

  const removeLeadUpdateRule = (id: string) => {
    setLeadUpdateRules(leadUpdateRules.filter((rule) => rule.id !== id))
  }

  const removeContactUpdateRule = (id: string) => {
    setContactUpdateRules(contactUpdateRules.filter((rule) => rule.id !== id))
  }

  const updateLeadRule = (id: string, updates: Partial<FieldUpdateRule>) => {
    setLeadUpdateRules(
      leadUpdateRules.map((rule) =>
        rule.id === id ? { ...rule, ...updates } : rule
      )
    )
  }

  const updateContactRule = (id: string, updates: Partial<FieldUpdateRule>) => {
    setContactUpdateRules(
      contactUpdateRules.map((rule) =>
        rule.id === id ? { ...rule, ...updates } : rule
      )
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Настройки доступа к данным */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Настройки доступа к данным</CardTitle>
              <p className="mt-1 text-sm text-gray-500">
                Выберите, какие данные агент может читать и использовать в диалогах
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSyncCRM}
              disabled={isSyncing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              Синхронизировать настройки CRM
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Данные сделки */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setLeadDataExpanded(!leadDataExpanded)}
              className="flex w-full items-center justify-between rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <h3 className="font-medium">Данные сделки</h3>
              {leadDataExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {leadDataExpanded && (
              <div className="space-y-3 pl-6">
                <p className="text-sm text-gray-500">
                  Выберите поля сделки, которые агент может читать
                </p>
                <div className="space-y-2">
                  <Label>
                    Выберите поля сделки <span className="text-rose-500">*</span>
                  </Label>
                  <MultiSelect
                    options={LEAD_FIELDS}
                    selected={selectedLeadFields}
                    onChange={setSelectedLeadFields}
                    placeholder="Выберите поля, к которым агент сможет получить доступ..."
                  />
                  <p className="text-xs text-gray-500">
                    Выбирайте только необходимые поля. Дополнительные поля добавляют лишний контекст и могут снизить точность ответов
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Данные контакта */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setContactDataExpanded(!contactDataExpanded)}
              className="flex w-full items-center justify-between rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <h3 className="font-medium">Данные контакта</h3>
              {contactDataExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {contactDataExpanded && (
              <div className="space-y-3 pl-6">
                <p className="text-sm text-gray-500">
                  Выберите, какие поля контакта агент сможет читать
                </p>
                <div className="space-y-2">
                  <Label>
                    Выберите поля контакта <span className="text-rose-500">*</span>
                  </Label>
                  <MultiSelect
                    options={CONTACT_FIELDS}
                    selected={selectedContactFields}
                    onChange={setSelectedContactFields}
                    placeholder="Выберите поля, к которым агент сможет получить доступ..."
                  />
                  <p className="text-xs text-gray-500">
                    Выбирайте только необходимые поля. Большее количество полей добавляет дополнительный контекст и может снизить точность ответов.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Настройки ввода данных */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Настройки ввода данных</CardTitle>
            <p className="mt-1 text-sm text-gray-500">
              Настройте, как агент может изменять данные сделок и контактов в зависимости от контекста разговора
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Данные сделки - правила обновления */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setLeadInputExpanded(!leadInputExpanded)}
              className="flex w-full items-center justify-between rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <div className="text-left">
                <h3 className="font-medium">Данные сделки</h3>
                <p className="text-xs text-gray-500">
                  Задайте правила автоматического обновления полей сделки во время разговора
                </p>
              </div>
              {leadInputExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {leadInputExpanded && (
              <div className="space-y-4 pl-6">
                {leadUpdateRules.map((rule, index) => (
                  <div key={rule.id} className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Правило {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLeadUpdateRule(rule.id)}
                        disabled={leadUpdateRules.length === 1}
                      >
                        Удалить
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Поле <span className="text-rose-500">*</span>
                      </Label>
                      <MultiSelect
                        options={LEAD_FIELDS}
                        selected={rule.fieldValue ? [rule.fieldValue] : []}
                        onChange={(selected) =>
                          updateLeadRule(rule.id, { fieldValue: selected[0] || '' })
                        }
                        placeholder="Выберите поле для обновления"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor={`lead-overwrite-${rule.id}`}>
                        Перезаписать существующее значение
                      </Label>
                      <Switch
                        id={`lead-overwrite-${rule.id}`}
                        checked={rule.overwriteExisting}
                        onCheckedChange={(checked) =>
                          updateLeadRule(rule.id, { overwriteExisting: checked })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`lead-condition-${rule.id}`}>
                        Условие обновления <span className="text-rose-500">*</span>
                      </Label>
                      <Textarea
                        id={`lead-condition-${rule.id}`}
                        value={rule.updateCondition}
                        onChange={(e) =>
                          updateLeadRule(rule.id, { updateCondition: e.target.value })
                        }
                        placeholder="Например: когда клиент упоминает цену"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLeadUpdateRule}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить поле
                </Button>
              </div>
            )}
          </div>

          {/* Данные контакта - правила обновления */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setContactInputExpanded(!contactInputExpanded)}
              className="flex w-full items-center justify-between rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <div className="text-left">
                <h3 className="font-medium">Данные контакта</h3>
                <p className="text-xs text-gray-500">
                  Определите правила автоматического обновления полей контакта во время разговора
                </p>
              </div>
              {contactInputExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {contactInputExpanded && (
              <div className="space-y-4 pl-6">
                {contactUpdateRules.map((rule, index) => (
                  <div key={rule.id} className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Правило {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContactUpdateRule(rule.id)}
                        disabled={contactUpdateRules.length === 1}
                      >
                        Удалить
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Поле <span className="text-rose-500">*</span>
                      </Label>
                      <MultiSelect
                        options={CONTACT_FIELDS}
                        selected={rule.fieldValue ? [rule.fieldValue] : []}
                        onChange={(selected) =>
                          updateContactRule(rule.id, { fieldValue: selected[0] || '' })
                        }
                        placeholder="Выберите поле для обновления"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor={`contact-overwrite-${rule.id}`}>
                        Перезаписать существующее значение
                      </Label>
                      <Switch
                        id={`contact-overwrite-${rule.id}`}
                        checked={rule.overwriteExisting}
                        onCheckedChange={(checked) =>
                          updateContactRule(rule.id, { overwriteExisting: checked })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`contact-condition-${rule.id}`}>
                        Условие обновления <span className="text-rose-500">*</span>
                      </Label>
                      <Textarea
                        id={`contact-condition-${rule.id}`}
                        value={rule.updateCondition}
                        onChange={(e) =>
                          updateContactRule(rule.id, { updateCondition: e.target.value })
                        }
                        placeholder="Например: когда клиент упоминает цену"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addContactUpdateRule}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить поле
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Кнопки действий */}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Отмена
        </Button>
      </div>
    </form>
  )
}
