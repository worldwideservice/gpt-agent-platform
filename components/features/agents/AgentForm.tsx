'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Label, Textarea } from '@/components/ui'
import type { Agent } from '@/types'

interface AgentFormProps {
  tenantId: string
  agent?: Agent
}

export function AgentForm({ tenantId: _tenantId, agent }: AgentFormProps) {
  const router = useRouter()
  const [formState, setFormState] = useState({
    name: agent?.name ?? '',
    status: agent?.status ?? 'draft',
    model: agent?.model ?? '',
    instructions: agent?.instructions ?? '',
    temperature: agent?.temperature ?? 0.7,
    maxTokens: agent?.maxTokens ?? 2048,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange = (key: keyof typeof formState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const handleSelect = (key: keyof typeof formState) => (value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const endpoint = agent ? `/api/agents/${agent.id}` : '/api/agents'
      const method = agent ? 'PATCH' : 'POST'
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          status: formState.status,
          model: formState.model,
          instructions: formState.instructions,
          temperature: Number(formState.temperature),
          maxTokens: Number(formState.maxTokens),
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(payload.error || 'Не удалось сохранить агента')
      }

      router.refresh()
      setSuccess(agent ? 'Изменения сохранены' : 'Агент создан')
      if (!agent) {
        setFormState({
          name: '',
          status: 'draft',
          model: '',
          instructions: '',
          temperature: 0.7,
          maxTokens: 2048,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения агента')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{agent ? 'Редактирование агента' : 'Новый агент'}</CardTitle>
          <CardDescription>Укажите базовые параметры и инструкции для агента.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agent-name">Название</Label>
            <Input
              id="agent-name"
              value={formState.name}
              onChange={handleChange('name')}
              placeholder="AI Sales Assistant"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Статус</Label>
              <select
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                value={formState.status}
                onChange={(event) => handleSelect('status')(event.target.value)}
              >
                <option value="draft">Черновик</option>
                <option value="active">Активен</option>
                <option value="inactive">Выключен</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent-model">Модель</Label>
              <Input
                id="agent-model"
                value={formState.model}
                onChange={handleChange('model')}
                placeholder="openrouter/gpt-4.1-mini"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent-temp">Temperature</Label>
              <Input
                id="agent-temp"
                type="number"
                step="0.1"
                min="0"
                max="2"
                value={formState.temperature}
                onChange={handleChange('temperature')}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="agent-tokens">Max tokens</Label>
              <Input
                id="agent-tokens"
                type="number"
                min="128"
                max="8000"
                value={formState.maxTokens}
                onChange={handleChange('maxTokens')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent-instructions">Инструкции</Label>
            <Textarea
              id="agent-instructions"
              rows={6}
              value={formState.instructions}
              onChange={handleChange('instructions')}
              placeholder="Опишите роль и тональность агента"
            />
          </div>

          {error && <p className="text-sm text-rose-500">{error}</p>}
          {success && <p className="text-sm text-emerald-600">{success}</p>}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Отмена
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Сохраняем…' : agent ? 'Сохранить' : 'Создать агента'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
