'use client'

import { useState } from 'react'
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
}

export const KnowledgeBaseSettings = ({
  allCategoriesEnabled,
  createTaskOnNotFound,
  notFoundMessage,
  onAllCategoriesToggle,
  onCreateTaskToggle,
  onMessageChange,
  onOpenKnowledgeBase
}: KnowledgeBaseSettingsProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <BookOpen className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">База знаний</h2>
      </div>

      <div className="space-y-6">
        {/* All Categories Access */}
        <Toggle
          checked={allCategoriesEnabled}
          onChange={onAllCategoriesToggle}
          label="Разрешить доступ ко всем категориям"
          description="Агент сможет использовать все статьи из базы знаний"
        />

        {/* Create Task on Not Found */}
        <Toggle
          checked={createTaskOnNotFound}
          onChange={onCreateTaskToggle}
          label="Создать задачу, если ответ не найден"
          description="Автоматически создавать задачу в сделке CRM, если в базе знаний не найдена релевантная информация"
        />

        {/* Message when no answer found */}
        {createTaskOnNotFound && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Сообщение при отсутствии ответа
            </label>
            <Textarea
              value={notFoundMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              rows={3}
              placeholder="Введите сообщение для клиента..."
              className="mb-2"
            />
            <p className="text-sm text-gray-500">
              Это сообщение будет показано, когда агент не сможет найти релевантную информацию в базе знаний.
            </p>
          </div>
        )}

        {/* Open Knowledge Base Button */}
        <div className="pt-4 border-t border-gray-200">
          <Button onClick={onOpenKnowledgeBase} variant="outline">
            <BookOpen className="w-4 h-4 mr-2" />
            Открыть базу знаний
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

