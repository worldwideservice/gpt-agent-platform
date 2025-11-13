'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Switch,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  useToast,
} from '@/components/ui'

interface Agent {
  id: string
  name: string
  model?: string | null
  autoDetectLanguage?: boolean | null
  creativity?: 'precise' | 'balanced' | 'creative' | null
  responseDelay?: number | null
}

interface AgentAdvancedSettingsFormProps {
  agent: Agent
  tenantId: string
}

const AI_MODELS = [
  {
    value: 'gpt-4.1',
    label: 'OpenAI GPT-4.1',
    description: 'Строго следует инструкциям',
    disabled: false,
  },
  {
    value: 'gemini-2.5-flash',
    label: 'Google Gemini 2.5 Flash',
    description: 'Молниеносная модель от Google',
    disabled: false,
  },
  {
    value: 'claude-sonnet-4',
    label: 'Claude Sonnet 4',
    description: 'Превосходен в творческом письме',
    disabled: true,
  },
  {
    value: 'gpt-5',
    label: 'OpenAI GPT-5',
    description: 'Новейшая модель OpenAI с надёжными и естественными ответами',
    disabled: false,
  },
]

export function AgentAdvancedSettingsForm({ agent, tenantId }: AgentAdvancedSettingsFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [model, setModel] = useState(agent.model || 'gpt-4.1')
  const [autoDetectLanguage, setAutoDetectLanguage] = useState(agent.autoDetectLanguage ?? true)
  const [creativity, setCreativity] = useState<'precise' | 'balanced' | 'creative'>(
    agent.creativity || 'balanced'
  )
  const [responseDelay, setResponseDelay] = useState(agent.responseDelay || 5)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          settings: {
            autoDetectLanguage,
            creativity,
          },
          responseDelaySeconds: responseDelay,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update agent')
      }

      toast({
        title: 'Успешно',
        description: 'Дополнительные настройки обновлены',
      })

      router.refresh()
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить настройки',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/manage/${tenantId}/ai-agents`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Модель ИИ */}
      <Card>
        <CardHeader>
          <CardTitle>Модель ИИ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ai-model">
              Выберите модель ИИ <span className="text-rose-500">*</span>
            </Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="ai-model">
                <SelectValue placeholder="Выберите модель ИИ" />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((aiModel) => (
                  <SelectItem
                    key={aiModel.value}
                    value={aiModel.value}
                    disabled={aiModel.disabled}
                  >
                    {aiModel.label} - {aiModel.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Выберите, насколько умным вы хотите сделать ИИ. Более продвинутые модели стоят дороже.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Язык */}
      <Card>
        <CardHeader>
          <CardTitle>Язык</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-detect-language">Автоматически определять язык пользователя</Label>
            <Switch
              id="auto-detect-language"
              checked={autoDetectLanguage}
              onCheckedChange={setAutoDetectLanguage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Настройки ответа */}
      <Card>
        <CardHeader>
          <CardTitle>Настройки ответа</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Креативность */}
          <div className="space-y-3">
            <Label>Креативность</Label>
            <RadioGroup value={creativity} onValueChange={(v) => setCreativity(v as any)}>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="precise" id="precise" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="precise" className="font-medium cursor-pointer">
                      Точный
                    </Label>
                    <p className="text-xs text-gray-500">
                      последовательный и предсказуемый, может звучать сухо
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="balanced" id="balanced" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="balanced" className="font-medium cursor-pointer">
                      Сбалансированный
                    </Label>
                    <p className="text-xs text-gray-500">естественный и легко читаемый</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="creative" id="creative" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="creative" className="font-medium cursor-pointer">
                      Креативный
                    </Label>
                    <p className="text-xs text-gray-500">выразительный и разнообразный</p>
                  </div>
                </div>
              </div>
            </RadioGroup>
            <p className="text-xs text-gray-500">
              Управляйте стилем ответов агента. Точный: последовательный и предсказуемый, может
              звучать сухо. Сбалансированный: естественный и легко читаемый. Креативный:
              выразительный и разнообразный.
            </p>
          </div>

          {/* Задержка ответа */}
          <div className="space-y-2">
            <Label htmlFor="response-delay">Задержка ответа (секунд)</Label>
            <Input
              id="response-delay"
              type="number"
              min="0"
              max="300"
              value={responseDelay}
              onChange={(e) => setResponseDelay(parseInt(e.target.value) || 0)}
            />
            <p className="text-xs text-gray-500">
              Сколько секунд ждать перед ответом. Рекомендуем установить задержку не менее 30
              секунд, чтобы избежать дублирования ответов, если клиент отправит другое сообщение,
              пока агент отвечает.
            </p>
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
