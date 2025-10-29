'use client'

import { BookOpen, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { Textarea } from '@/components/ui/Textarea'

interface KnowledgeBaseSettingsProps {
  allCategoriesEnabled: boolean
  createTaskOnNotFound: boolean
  notFoundMessage: string
  onAllCategoriesToggle: (enabled: boolean) => void
  onCreateTaskToggle: (enabled: boolean) => void
  onMessageChange: (message: string) => void
  onOpenKnowledgeBase: () => void
  disabled?: boolean
}

export const KnowledgeBaseSettings = ({
  allCategoriesEnabled,
  createTaskOnNotFound,
  notFoundMessage,
  onAllCategoriesToggle,
  onCreateTaskToggle,
  onMessageChange,
  onOpenKnowledgeBase,
  disabled = false,
}: KnowledgeBaseSettingsProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-slate-500" />
        <h2 className="text-lg font-semibold text-slate-900">База знаний</h2>
      </div>

      <div className="space-y-6">
        <Toggle
          checked={allCategoriesEnabled}
          onChange={onAllCategoriesToggle}
          label="Разрешить доступ ко всем категориям"
          description="Агент сможет использовать все статьи из базы знаний"
          disabled={disabled}
        />

        <Toggle
          checked={createTaskOnNotFound}
          onChange={onCreateTaskToggle}
          label="Создавать задачу, если ответ не найден"
          description="После неудачного поиска создается задача в CRM для менеджера"
          disabled={disabled}
        />

        {createTaskOnNotFound ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Сообщение при отсутствии ответа</label>
            <Textarea
              value={notFoundMessage}
              onChange={(event) => onMessageChange(event.target.value)}
              rows={3}
              placeholder="Например: Передам вопрос специалисту и вернусь с ответом в течение рабочего дня."
              className="mb-2"
              disabled={disabled}
            />
            <p className="text-xs text-slate-500">
              Сообщение будет отправлено клиенту и добавлено в комментарий задачи.
            </p>
          </div>
        ) : null}

        <div className="border-t border-slate-200 pt-4">
          <Button onClick={onOpenKnowledgeBase} variant="outline" disabled={disabled}>
            <BookOpen className="mr-2 h-4 w-4" />
            Открыть базу знаний
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

