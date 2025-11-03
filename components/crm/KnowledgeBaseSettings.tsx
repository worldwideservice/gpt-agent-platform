'use client'

import { BookOpen, ExternalLink } from 'lucide-react'

import { KwidButton, KwidSwitch, KwidTextarea } from '@/components/kwid'

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
 <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-gray-950/5
 <div className="mb-4 flex items-center gap-2">
 <BookOpen className="h-5 w-5 text-gray-500 />
 <h2 className="text-lg font-semibold text-gray-900 знаний</h2>
 </div>

 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div className="flex-1">
 <p className="text-sm font-medium text-gray-700 mb-1">Разрешить доступ ко всем категориям</p>
 <p className="text-sm text-gray-500 сможет использовать все статьи из базы знаний</p>
 </div>
 <KwidSwitch
 checked={allCategoriesEnabled}
 onCheckedChange={onAllCategoriesToggle}
 disabled={disabled}
 />
 </div>

 <div className="flex items-center justify-between">
 <div className="flex-1">
 <p className="text-sm font-medium text-gray-700 mb-1">Создавать задачу, если ответ не найден</p>
 <p className="text-sm text-gray-500 неудачного поиска создается задача в CRM для менеджера</p>
 </div>
 <KwidSwitch
 checked={createTaskOnNotFound}
 onCheckedChange={onCreateTaskToggle}
 disabled={disabled}
 />
 </div>

 {createTaskOnNotFound ? (
 <div>
 <KwidTextarea
 label="Сообщение при отсутствии ответа"
 value={notFoundMessage}
 onChange={(event) => onMessageChange(event.target.value)}
 rows={3}
 placeholder="Например: Передам вопрос специалисту и вернусь с ответом в течение рабочего дня."
 hint="Сообщение будет отправлено клиенту и добавлено в комментарий задачи."
 disabled={disabled}
 />
 </div>
 ) : null}

 <div className="border-t border-gray-200 pt-4
 <KwidButton onClick={onOpenKnowledgeBase} variant="outline" size="md" disabled={disabled} className="gap-2">
 <BookOpen className="h-4 w-4" />
 Открыть базу знаний
 <ExternalLink className="h-4 w-4" />
 </KwidButton>
 </div>
 </div>
 </div>
 )
}

