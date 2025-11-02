'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTenantId } from '@/hooks/useTenantId'
import {
  KwidButton,
  KwidSelect,
  KwidSwitch,
  KwidSection,
} from '@/components/kwid'
import type { Agent } from '@/types'

interface AdvancedSettingsClientProps {
  agentId: string
  initialAgent: Agent
}

export const AdvancedSettingsClient = ({
  agentId,
  initialAgent,
}: AdvancedSettingsClientProps) => {
  const router = useRouter()
  const activeTenantId = useTenantId()
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    model: initialAgent.model || '',
    language: (initialAgent.settings as any)?.language || 'auto',
    responseDelaySeconds: initialAgent.responseDelaySeconds || 0,
  })

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      const payload = {
        model: formData.model,
        settings: {
          ...(initialAgent.settings || {}),
          language: formData.language,
        },
        responseDelaySeconds: formData.responseDelaySeconds,
      }

      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Не удалось сохранить настройки')
      }

      const redirectPath = activeTenantId
        ? `/manage/${activeTenantId}/ai-agents/${agentId}/edit`
        : `/agents/${agentId}/edit`
      router.push(redirectPath)
    } catch (error) {
      console.error('Error saving advanced settings:', error)
      alert('Не удалось сохранить настройки')
    } finally {
      setIsSaving(false)
    }
  }, [agentId, formData, initialAgent.settings, activeTenantId, router])

  return (
    <div className="flex flex-col gap-8">
      {/* Модель ИИ */}
      <KwidSection
        title="Модель ИИ"
        icon={undefined}
      >
        <div className="fi-fo-field-wrp space-y-2">
          <div className="flex items-center gap-x-3 justify-between">
            <label className="fi-fo-field-wrp-label inline-flex items-center gap-x-3">
              <span className="text-sm font-medium leading-6 text-gray-950 dark:text-white">
                Выберите модель ИИ
                <span className="text-red-500">*</span>
              </span>
            </label>
          </div>
          {formData.model && (
            <div className="choices__inner flex flex-wrap gap-2 mb-3">
              <div
                className="choices__item choices__item--selectable inline-flex items-center gap-1 rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                data-item
                data-id={formData.model}
                data-value={formData.model}
                aria-selected="true"
              >
                {formData.model === 'gpt-5'
                  ? 'OpenAI GPT-5 - Новейшая модель OpenAI с надёжными и естественными ответами'
                  : formData.model}
                <button
                  type="button"
                  className="choices__button ml-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                  aria-label="Remove item"
                  data-button
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, model: '' }))
                  }
                >
                  ×
                </button>
              </div>
            </div>
          )}
          <KwidSelect
            options={[
              { value: 'gpt-5', label: 'OpenAI GPT-5 - Новейшая модель OpenAI с надёжными и естественными ответами' },
              { value: 'gpt-4.1', label: 'OpenAI GPT-4.1' },
              { value: 'gpt-4', label: 'OpenAI GPT-4' },
              { value: 'gpt-3.5-turbo', label: 'OpenAI GPT-3.5 Turbo' },
              { value: 'claude-3-opus', label: 'Anthropic Claude 3 Opus' },
              { value: 'claude-3-sonnet', label: 'Anthropic Claude 3 Sonnet' },
              { value: 'claude-3-haiku', label: 'Anthropic Claude 3 Haiku' },
              { value: 'gemini-pro', label: 'Google Gemini Pro' },
              { value: 'gemini-ultra', label: 'Google Gemini Ultra' },
            ]}
            value={formData.model || ''}
            onChange={(value: string) =>
              setFormData((prev) => ({ ...prev, model: value }))
            }
            placeholder="Выберите, насколько умным вы хотите сделать ИИ. Более продвинутые модели стоят дороже."
          />
          <p className="fi-fo-field-wrp-helper-text break-words text-sm text-gray-500 dark:text-gray-400">
            Выберите, насколько умным вы хотите сделать ИИ. Более продвинутые модели стоят дороже.
          </p>
        </div>
      </KwidSection>

      {/* Язык */}
      <KwidSection
        title="Язык"
        icon={undefined}
      >
        <div className="fi-fo-field-wrp">
          <KwidSwitch
            checked={formData.language === 'auto'}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                language: checked ? 'auto' : 'ru',
              }))
            }
            label="Автоматически определять язык пользователя"
          />
        </div>
      </KwidSection>

      {/* Настройки ответа */}
      <KwidSection
        title="Настройки ответа"
        icon={undefined}
      >
        <div className="fi-fo-field-wrp space-y-2">
          <div className="flex items-center gap-x-3 justify-between">
            <label className="fi-fo-field-wrp-label inline-flex items-center gap-x-3">
              <span className="text-sm font-medium leading-6 text-gray-950 dark:text-white">
                Задержка ответа (секунд)
              </span>
            </label>
          </div>
          <input
            type="number"
            id="data.response_delay"
            inputMode="decimal"
            max={900}
            min={0}
            step="any"
            className="fi-input block w-full border-none py-1.5 text-base text-gray-950 transition duration-75 placeholder:text-gray-400 focus:ring-0 disabled:text-gray-500 dark:bg-gray-900 dark:text-white"
            value={formData.responseDelaySeconds}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                responseDelaySeconds: Math.max(0, Number.parseFloat(e.target.value) || 0),
              }))
            }
          />
          <p className="fi-fo-field-wrp-helper-text break-words text-sm text-gray-500 dark:text-gray-400">
            Сколько секунд ждать перед ответом. Рекомендуем установить задержку не менее 30 секунд, чтобы избежать дублирования ответов, если клиент отправит другое сообщение, пока агент отвечает.
          </p>
        </div>
      </KwidSection>

      <div className="fi-ac gap-3 flex flex-wrap items-center justify-start mt-8">
        <KwidButton
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          variant="primary"
          size="md"
          style={{
            '--c-400': 'var(--primary-400)',
            '--c-500': 'var(--primary-500)',
            '--c-600': 'var(--primary-600)',
          } as React.CSSProperties}
          className="fi-color-custom"
        >
          <span className="fi-btn-label">{isSaving ? 'Сохранение…' : 'Сохранить'}</span>
        </KwidButton>
        <KwidButton
          type="button"
          variant="secondary"
          size="md"
          onClick={() => {
            const redirectPath = activeTenantId
              ? `/manage/${activeTenantId}/ai-agents/${agentId}/edit`
              : `/agents/${agentId}/edit`
            router.push(redirectPath)
          }}
        >
          <span className="fi-btn-label">Отмена</span>
        </KwidButton>
      </div>
    </div>
  )
}

