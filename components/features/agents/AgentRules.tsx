'use client'

import { useCallback, useEffect, useState } from 'react'

import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Label, Textarea } from '@/components/ui'

type Condition = { field: string; operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'changed_to' | 'not_empty'; value?: string }
type Action = {
  type: 'send_message' | 'change_stage' | 'create_task' | 'update_field' | 'send_email' | 'webhook' | 'ai_response'
  template?: string
  targetField?: string
  newValue?: string
  channel?: string
  webhookUrl?: string
  aiPrompt?: string
}

type Rule = {
  id: string
  name: string
  description?: string | null
  trigger_type: string
  is_active: boolean
  priority: number
  conditions: Condition[]
  actions: Action[]
}

interface AgentRulesProps {
  agentId: string
}

export function AgentRules({ agentId }: AgentRulesProps) {
  const [rules, setRules] = useState<Rule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    triggerType: 'message_received',
  })
  const [conditionDraft, setConditionDraft] = useState({ field: 'source', operator: 'equals', value: '' })
  const [conditions, setConditions] = useState<Condition[]>([{ field: 'source', operator: 'equals', value: '' }])
  const [actionDraft, setActionDraft] = useState<Action>({ type: 'send_message', template: '' })
  const [actions, setActions] = useState<Action[]>([{ type: 'send_message', template: 'Спасибо! Мы свяжемся с вами' }])
  const [creating, setCreating] = useState(false)
  const [previewResult, setPreviewResult] = useState<string | null>(null)
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null)

  const loadRules = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/agents/${agentId}/rules`)
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось загрузить правила')
      }
      setRules(
        payload.data.map((rule: Rule) => ({
          ...rule,
          conditions: rule.conditions ?? [],
          actions: rule.actions ?? [],
        })),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки правил')
    } finally {
      setLoading(false)
    }
  }, [agentId])

  useEffect(() => {
    void loadRules()
  }, [loadRules])

  const handleCreateRule = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!newRule.name.trim()) {
      setError('Введите название правила')
      return
    }
    setCreating(true)
    setError(null)
    try {
      const method = editingRuleId ? 'PATCH' : 'POST'
      const endpoint = editingRuleId ? `/api/rules/${editingRuleId}` : `/api/agents/${agentId}/rules`

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRule.name,
          description: newRule.description,
          trigger_type: newRule.triggerType,
          conditions,
          actions,
        }),
      })
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось создать правило')
      }
      setNewRule({ name: '', description: '', triggerType: 'message_received' })
      setConditions([{ field: 'source', operator: 'equals', value: '' }])
      setActions([{ type: 'send_message', template: 'Спасибо! Мы свяжемся с вами' }])
      const updatedRule = payload.data

      if (editingRuleId) {
        setRules((prev) =>
          prev.map((rule) =>
            rule.id === editingRuleId
              ? {
                  ...rule,
                  name: updatedRule.name,
                  trigger_type: updatedRule.trigger_type,
                  conditions,
                  actions,
                }
              : rule,
          ),
        )
      } else {
      await loadRules()
      }

      setPreviewResult(editingRuleId ? 'Правило обновлено.' : 'Правило создано. Обновите список, чтобы увидеть изменения.')
      setEditingRuleId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания правила')
    } finally {
      setCreating(false)
    }
  }

  const handlePreview = async () => {
    setPreviewResult(null)
    try {
    const response = await fetch(`/api/agents/${agentId}/rules?preview=true`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        triggerType: 'manual',
        triggerData: {},
      }),
    })
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось выполнить правила')
      }
      setPreviewResult('Правила выполнены. Проверьте логи выполнения.')
    } catch (err) {
      setPreviewResult(err instanceof Error ? err.message : 'Ошибка выполнения правил')
    }
  }

  const toggleRule = async (rule: Rule) => {
    setError(null)
    try {
      const response = await fetch(`/api/rules/${rule.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !rule.is_active }),
      })
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось обновить правило')
      }
      setRules((prev) => prev.map((item) => (item.id === rule.id ? { ...item, is_active: !item.is_active } : item)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления правила')
    }
  }

  const deleteRule = async (ruleId: string) => {
    if (!confirm('Удалить правило?')) {
      return
    }
    setError(null)
    try {
      const response = await fetch(`/api/rules/${ruleId}`, { method: 'DELETE' })
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось удалить правило')
      }
      setRules((prev) => prev.filter((rule) => rule.id !== ruleId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления правила')
    }
  }

  const handleAddCondition = () => {
    if (!conditionDraft.field) {
      return
    }

    setConditions((prev) => [
      ...prev,
      { field: conditionDraft.field, operator: conditionDraft.operator, value: conditionDraft.value },
    ])
    setConditionDraft({ field: conditionDraft.field, operator: 'equals', value: '' })
  }

  const handleAddAction = () => {
    setActions((prev) => [...prev, { ...actionDraft }])
    setActionDraft({ type: actionDraft.type, template: '', targetField: '', newValue: '', channel: '', webhookUrl: '', aiPrompt: '' })
  }

  const updateCondition = (index: number, field: keyof Condition, value: string) => {
    setConditions((prev) =>
      prev.map((condition, idx) =>
        idx === index
          ? {
              ...condition,
              [field]: value,
            }
          : condition,
      ),
    )
  }

  const removeCondition = (index: number) => {
    setConditions((prev) => prev.filter((_, idx) => idx !== index))
  }

  const updateAction = (index: number, field: keyof Action, value: string) => {
    setActions((prev) =>
      prev.map((action, idx) =>
        idx === index
          ? {
              ...action,
              [field]: value,
            }
          : action,
      ),
    )
  }

  const removeAction = (index: number) => {
    setActions((prev) => prev.filter((_, idx) => idx !== index))
  }

  const renderActionForm = () => {
    switch (actionDraft.type) {
      case 'send_message':
        return (
          <Textarea
            rows={3}
            value={actionDraft.template ?? ''}
            onChange={(event) => setActionDraft((prev) => ({ ...prev, template: event.target.value }))}
            placeholder="Текст сообщения"
          />
        )
      case 'change_stage':
        return (
          <Input
            value={actionDraft.newValue ?? ''}
            onChange={(event) => setActionDraft((prev) => ({ ...prev, newValue: event.target.value }))}
            placeholder="ID этапа"
          />
        )
      case 'create_task':
        return (
          <Textarea
            rows={2}
            value={actionDraft.template ?? ''}
            onChange={(event) => setActionDraft((prev) => ({ ...prev, template: event.target.value }))}
            placeholder="Описание задачи"
          />
        )
      case 'update_field':
        return (
          <div className="grid gap-2 md:grid-cols-2">
            <Input
              placeholder="Поле"
              value={actionDraft.targetField ?? ''}
              onChange={(event) => setActionDraft((prev) => ({ ...prev, targetField: event.target.value }))}
            />
            <Input
              placeholder="Новое значение"
              value={actionDraft.newValue ?? ''}
              onChange={(event) => setActionDraft((prev) => ({ ...prev, newValue: event.target.value }))}
            />
          </div>
        )
      case 'webhook':
        return (
          <Input
            placeholder="Webhook URL"
            value={actionDraft.webhookUrl ?? ''}
            onChange={(event) => setActionDraft((prev) => ({ ...prev, webhookUrl: event.target.value }))}
          />
        )
      default:
        return (
          <Textarea
            rows={3}
            value={actionDraft.template ?? ''}
            onChange={(event) => setActionDraft((prev) => ({ ...prev, template: event.target.value }))}
            placeholder="Описание действия"
          />
        )
    }
  }

  const CONDITION_FIELDS = [
    { value: 'source', label: 'Источник' },
    { value: 'stage', label: 'Этап воронки' },
    { value: 'status', label: 'Статус сделки' },
    { value: 'message', label: 'Сообщение' },
  ]

  const ACTION_TYPES = [
    { value: 'send_message', label: 'Отправить сообщение' },
    { value: 'change_stage', label: 'Сменить этап' },
    { value: 'create_task', label: 'Создать задачу' },
    { value: 'update_field', label: 'Обновить поле' },
    { value: 'webhook', label: 'Webhook' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rule Engine</CardTitle>
        <CardDescription>Правила автоматизации для этого агента.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {error && <p className="text-rose-500">{error}</p>}
        {loading ? (
          <p className="text-gray-500">Загрузка правил…</p>
        ) : rules.length === 0 ? (
          <p className="text-gray-500">Правила ещё не созданы.</p>
        ) : (
      <ul className="space-y-2">
            {rules.map((rule) => (
              <li key={rule.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-50">{rule.name}</p>
                    <p className="text-xs text-gray-500">Триггер: {rule.trigger_type} · Приоритет {rule.priority}</p>
                    {rule.conditions.length > 0 && (
                      <p className="text-xs text-gray-500">
                        Условия:{' '}
                        {rule.conditions
                          .slice(0, 2)
                          .map((condition) => `${condition.field} ${condition.operator} ${condition.value ?? '—'}`)
                          .join(', ')}
                        {rule.conditions.length > 2 && ` …(+${rule.conditions.length - 2})`}
                      </p>
                    )}
                    {rule.actions.length > 0 && (
                      <p className="text-xs text-gray-500">
                        Действия: {rule.actions.map((action) => action.type).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      className="rounded border px-2 py-1"
                      onClick={() => toggleRule(rule)}
                    >
                      {rule.is_active ? 'Выключить' : 'Включить'}
                    </button>
                    <button type="button" className="rounded border px-2 py-1" onClick={() => deleteRule(rule.id)}>
                      Удалить
                    </button>
                    <button
                      type="button"
                      className="rounded border px-2 py-1"
                      onClick={() => {
                        setEditingRuleId(rule.id)
                        setNewRule({
                          name: rule.name,
                          description: rule.description ?? '',
                          triggerType: rule.trigger_type,
                        })
                        setConditions(rule.conditions ?? [{ field: 'source', operator: 'equals', value: '' }])
                        setActions(rule.actions.length ? rule.actions : [{ type: 'send_message', template: 'Спасибо! Мы свяжемся с вами' }])
                      }}
                    >
                      Редактировать
                    </button>
                  </div>
                </div>
                {rule.description && <p className="text-xs text-gray-500">{rule.description}</p>}
              </li>
            ))}
          </ul>
        )}

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Создать простое правило</p>
            <Button type="button" variant="outline" size="sm" onClick={handlePreview}>
              Запустить предпросмотр
            </Button>
          </div>
          {editingRuleId && (
            <div className="mt-2 flex items-center justify-between rounded border border-dashed px-3 py-2 text-xs text-amber-700">
              <span>Редактирование правила #{editingRuleId.slice(0, 6)}</span>
              <button
                type="button"
                className="text-sm font-medium text-primary hover:underline"
                onClick={() => {
                  setEditingRuleId(null)
                  setNewRule({ name: '', description: '', triggerType: 'message_received' })
                  setConditions([{ field: 'source', operator: 'equals', value: '' }])
                  setActions([{ type: 'send_message', template: 'Спасибо! Мы свяжемся с вами' }])
                }}
              >
                Отмена
              </button>
            </div>
          )}
        <form className="mt-4 space-y-3" onSubmit={handleCreateRule}>
          <div className="space-y-2">
            <Label htmlFor="rule-name">Название</Label>
            <Input
              id="rule-name"
              value={newRule.name}
              onChange={(event) => setNewRule((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Ответ новым сообщениям"
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Триггер</Label>
              <select
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                value={newRule.triggerType}
                onChange={(event) => setNewRule((prev) => ({ ...prev, triggerType: event.target.value }))}
              >
                <option value="message_received">Новое сообщение</option>
                <option value="lead_created">Создан лид</option>
                <option value="lead_updated">Обновлён лид</option>
                <option value="manual">Ручной запуск</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Условия</Label>
            <div className="grid gap-2 md:grid-cols-3">
              <select
                className="rounded-md border border-input bg-transparent px-2 py-1 text-sm"
                data-testid="rule-condition-field"
                value={conditionDraft.field}
                onChange={(event) => setConditionDraft((prev) => ({ ...prev, field: event.target.value }))}
              >
                {CONDITION_FIELDS.map((field) => (
                  <option key={field.value} value={field.value}>
                    {field.label}
                  </option>
                ))}
              </select>
              <select
                className="rounded-md border border-input bg-transparent px-2 py-1 text-sm"
                value={conditionDraft.operator}
                onChange={(event) =>
                  setConditionDraft((prev) => ({ ...prev, operator: event.target.value as Condition['operator'] }))
                }
              >
                <option value="equals">equals</option>
                <option value="contains">contains</option>
                <option value="greater_than">greater than</option>
                <option value="less_than">less than</option>
                <option value="changed_to">changed to</option>
                <option value="not_empty">not empty</option>
              </select>
              <Input
                placeholder="Значение"
                value={conditionDraft.value}
                onChange={(event) => setConditionDraft((prev) => ({ ...prev, value: event.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={handleAddCondition}>
                Добавить условие
              </Button>
            </div>
            <ul className="space-y-1 text-xs text-gray-500">
              {conditions.map((condition, index) => (
                <li key={`${condition.field}-${index}`} className="flex items-center justify-between">
                  <span>
                    {condition.field} {condition.operator} {condition.value || '—'}
                  </span>
                  <button type="button" className="text-rose-500" onClick={() => removeCondition(index)}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <Label>Действия</Label>
            <div className="grid gap-2 md:grid-cols-3">
              <select
                className="rounded-md border border-input bg-transparent px-2 py-1 text-sm"
                data-testid="rule-action-type"
                value={actionDraft.type}
                onChange={(event) => setActionDraft((prev) => ({ ...prev, type: event.target.value as Action['type'] }))}
              >
                {ACTION_TYPES.map((actionType) => (
                  <option key={actionType.value} value={actionType.value}>
                    {actionType.label}
                  </option>
                ))}
              </select>
              <div className="md:col-span-2">{renderActionForm()}</div>
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={handleAddAction}>
                Добавить действие
              </Button>
            </div>
            <ul className="space-y-1 text-xs text-gray-500">
              {actions.map((action, index) => (
                <li key={`${action.type}-${index}`} className="flex items-center justify-between">
                  <span>
                    {action.type}
                    {action.template && ` · ${action.template}`}
                    {action.newValue && ` · ${action.newValue}`}
                  </span>
                  <button type="button" onClick={() => removeAction(index)} className="text-rose-500">
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
            <div className="space-y-2">
              <Label htmlFor="rule-template">Текст сообщения (первое действие)</Label>
              <Textarea
                id="rule-template"
                rows={4}
                value={actions[0]?.template ?? ''}
                onChange={(event) => {
                  const updatedTemplate = event.target.value
                  setActions((prev) => {
                    if (prev.length === 0) {
                      return [{ type: 'send_message', template: updatedTemplate }]
                    }
                    const updated = [...prev]
                    updated[0] = { ...updated[0], template: updatedTemplate }
                    return updated
                  })
                }}
              />
              <p className="text-xs text-gray-500">
                Текст синхронизируется с первым действием (обычно отправка сообщения). Добавьте дополнительные действия ниже.
              </p>
            </div>
            <Button type="submit" disabled={creating}>
              {creating ? 'Сохраняем…' : 'Создать правило'}
            </Button>
          </form>
          {previewResult && <p className="mt-2 text-xs text-gray-500">{previewResult}</p>}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-gray-500">Полноценный редактор правил появится в следующих релизах.</p>
      </CardFooter>
    </Card>
  )
}
