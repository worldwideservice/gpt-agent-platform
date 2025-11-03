'use client'

import { BookOpen, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/shadcn/textarea'

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
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-gray-950/5">
      <div className="mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-900">База знаний</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="mb-1 text-sm font-medium text-gray-700">Разрешить доступ ко всем категориям</p>
            <p className="text-sm text-gray-500">Агент сможет использовать все статьи из базы знаний</p>
          </div>
          <Switch
            checked={allCategoriesEnabled}
            onCheckedChange={onAllCategoriesToggle}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="mb-1 text-sm font-medium text-gray-700">Создавать задачу, если ответ не найден</p>
            <p className="text-sm text-gray-500">При неудачном поиске создается задача в CRM для менеджера</p>
          </div>
          <Switch
            checked={createTaskOnNotFound}
            onCheckedChange={onCreateTaskToggle}
            disabled={disabled}
          />
        </div>

        {createTaskOnNotFound ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Сообщение при отсутствии ответа
            </label>
            <Textarea
              value={notFoundMessage}
              onChange={(event) => onMessageChange(event.target.value)}
              rows={3}
              placeholder="Например: Передам вопрос специалисту и вернусь с ответом в течение рабочего дня."
              disabled={disabled}
              className="resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Сообщение будет отправлено клиенту и добавлено в комментарий задачи.
            </p>
          </div>
        ) : null}

        <div className="border-t border-gray-200 pt-4">
          <Button onClick={onOpenKnowledgeBase} variant="outline" size="sm" disabled={disabled} className="gap-2">
            <BookOpen className="h-4 w-4" />
            Открыть базу знаний
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
