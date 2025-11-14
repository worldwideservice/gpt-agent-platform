'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
  useToast,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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

// Zod schema for field update rules
const fieldUpdateRuleSchema = z.object({
  id: z.string(),
  fieldValue: z.string().min(1, 'Поле обязательно'),
  overwriteExisting: z.boolean(),
  updateCondition: z.string().min(1, 'Условие обновления обязательно').max(500, 'Условие не должно превышать 500 символов'),
})

// Zod schema for the entire form
const leadsContactsSchema = z.object({
  selectedLeadFields: z.array(z.string()).min(1, 'Выберите хотя бы одно поле сделки'),
  selectedContactFields: z.array(z.string()).min(1, 'Выберите хотя бы одно поле контакта'),
  leadUpdateRules: z.array(fieldUpdateRuleSchema).min(1, 'Должно быть хотя бы одно правило'),
  contactUpdateRules: z.array(fieldUpdateRuleSchema).min(1, 'Должно быть хотя бы одно правило'),
})

type LeadsContactsFormData = z.infer<typeof leadsContactsSchema>

interface FieldUpdateRule {
  id: string
  fieldValue: string
  overwriteExisting: boolean
  updateCondition: string
}

export function AgentLeadsContactsForm({ agent, tenantId }: AgentLeadsContactsFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSyncing, setIsSyncing] = useState(false)

  // UI state (not part of form)
  const [leadDataExpanded, setLeadDataExpanded] = useState(true)
  const [contactDataExpanded, setContactDataExpanded] = useState(true)
  const [leadInputExpanded, setLeadInputExpanded] = useState(false)
  const [contactInputExpanded, setContactInputExpanded] = useState(false)

  // React Hook Form setup
  const form = useForm<LeadsContactsFormData>({
    resolver: zodResolver(leadsContactsSchema),
    defaultValues: {
      selectedLeadFields: ['name', 'responsible_user_id'],
      selectedContactFields: ['name', 'tags'],
      leadUpdateRules: [
        {
          id: '1',
          fieldValue: 'cf_564832',
          overwriteExisting: false,
          updateCondition: 'Когда клиент говорит о услуге которая его интересует',
        },
      ],
      contactUpdateRules: [
        {
          id: '1',
          fieldValue: 'cf_438092',
          overwriteExisting: true,
          updateCondition: 'Когда клиент указывает свой email',
        },
      ],
    },
  })

  const { fields: leadRuleFields, append: appendLeadRule, remove: removeLeadRule } = useFieldArray({
    control: form.control,
    name: 'leadUpdateRules',
  })

  const { fields: contactRuleFields, append: appendContactRule, remove: removeContactRule } = useFieldArray({
    control: form.control,
    name: 'contactUpdateRules',
  })

  const handleSyncCRM = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch(`/api/agents/${agent.id}/sync-crm`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to sync CRM')
      }

      toast({
        title: 'Успешно',
        description: 'Синхронизация с CRM выполнена успешно',
      })

      router.refresh()
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось синхронизировать с CRM',
        variant: 'destructive',
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const onSubmit = async (data: LeadsContactsFormData) => {
    try {
      const response = await fetch(`/api/agents/${agent.id}/leads-contacts`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update agent')
      }

      toast({
        title: 'Успешно',
        description: 'Настройки сделок и контактов обновлены',
      })

      router.refresh()
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить настройки',
        variant: 'destructive',
      })
    }
  }

  const handleCancel = () => {
    router.push(`/manage/${tenantId}/ai-agents`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <FormField
                  control={form.control}
                  name="selectedLeadFields"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Выберите поля сделки <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={LEAD_FIELDS}
                          selected={field.value}
                          onChange={field.onChange}
                          placeholder="Выберите поля, к которым агент сможет получить доступ..."
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        Выбирайте только необходимые поля. Дополнительные поля добавляют лишний контекст и могут снизить точность ответов
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="selectedContactFields"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Выберите поля контакта <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={CONTACT_FIELDS}
                          selected={field.value}
                          onChange={field.onChange}
                          placeholder="Выберите поля, к которым агент сможет получить доступ..."
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        Выбирайте только необходимые поля. Большее количество полей добавляет дополнительный контекст и может снизить точность ответов.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                {leadRuleFields.map((field, index) => (
                  <div key={field.id} className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Правило {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLeadRule(index)}
                        disabled={leadRuleFields.length === 1}
                      >
                        Удалить
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name={`leadUpdateRules.${index}.fieldValue`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Поле <span className="text-rose-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <MultiSelect
                              options={LEAD_FIELDS}
                              selected={field.value ? [field.value] : []}
                              onChange={(selected) => field.onChange(selected[0] || '')}
                              placeholder="Выберите поле для обновления"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`leadUpdateRules.${index}.overwriteExisting`}
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel htmlFor={`lead-overwrite-${field.name}`}>
                            Перезаписать существующее значение
                          </FormLabel>
                          <FormControl>
                            <Switch
                              id={`lead-overwrite-${field.name}`}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`leadUpdateRules.${index}.updateCondition`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Условие обновления <span className="text-rose-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Например: когда клиент упоминает цену"
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendLeadRule({
                    id: Date.now().toString(),
                    fieldValue: '',
                    overwriteExisting: false,
                    updateCondition: '',
                  })}
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
                {contactRuleFields.map((field, index) => (
                  <div key={field.id} className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Правило {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContactRule(index)}
                        disabled={contactRuleFields.length === 1}
                      >
                        Удалить
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name={`contactUpdateRules.${index}.fieldValue`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Поле <span className="text-rose-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <MultiSelect
                              options={CONTACT_FIELDS}
                              selected={field.value ? [field.value] : []}
                              onChange={(selected) => field.onChange(selected[0] || '')}
                              placeholder="Выберите поле для обновления"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`contactUpdateRules.${index}.overwriteExisting`}
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel htmlFor={`contact-overwrite-${field.name}`}>
                            Перезаписать существующее значение
                          </FormLabel>
                          <FormControl>
                            <Switch
                              id={`contact-overwrite-${field.name}`}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`contactUpdateRules.${index}.updateCondition`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Условие обновления <span className="text-rose-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Например: когда клиент упоминает цену"
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendContactRule({
                    id: Date.now().toString(),
                    fieldValue: '',
                    overwriteExisting: false,
                    updateCondition: '',
                  })}
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={form.formState.isSubmitting}
        >
          Отмена
        </Button>
      </div>
      </form>
    </Form>
  )
}
