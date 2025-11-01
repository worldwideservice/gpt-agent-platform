'use client'

import { useState, useEffect } from 'react'
import { X, Briefcase, Users, Eye, RefreshCw, Edit } from 'lucide-react'
import { KwidButton, KwidSelect, KwidBadge } from '@/components/kwid'

interface Field {
  id: string
  name: string
  type?: string
}

interface DealContactFieldsSelectorProps {
  agentId: string
  onFieldsChange?: (dealFields: string[], contactFields: string[]) => void
}

export const DealContactFieldsSelector = ({ agentId, onFieldsChange }: DealContactFieldsSelectorProps) => {
  const [dealFields, setDealFields] = useState<string[]>([])
  const [contactFields, setContactFields] = useState<string[]>([])
  const [availableDealFields, setAvailableDealFields] = useState<Field[]>([])
  const [availableContactFields, setAvailableContactFields] = useState<Field[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Загрузка доступных полей из CRM
  useEffect(() => {
    const fetchFields = async () => {
      try {
        // TODO: Заменить на реальный API для получения полей из CRM
        // Пока используем стандартные поля
        const defaultDealFields: Field[] = [
          { id: 'name', name: 'Название сделки' },
          { id: 'responsible_user_id', name: 'Ответственный пользователь' },
          { id: 'status_id', name: 'Этап сделки' },
          { id: 'custom_service_type', name: 'Тип услуги' },
          { id: 'contact_email', name: 'Email клиента' },
          { id: 'price', name: 'Сумма' },
          { id: 'created_at', name: 'Дата создания' },
        ]

        const defaultContactFields: Field[] = [
          { id: 'name', name: 'Имя контакта' },
          { id: 'responsible_user_id', name: 'Ответственный пользователь' },
          { id: 'created_at', name: 'Дата создания' },
          { id: 'tags', name: 'Теги' },
          { id: 'email', name: 'Email' },
          { id: 'phone', name: 'Телефон' },
          { id: 'country', name: 'Страна' },
        ]

        setAvailableDealFields(defaultDealFields)
        setAvailableContactFields(defaultContactFields)

        // Загружаем сохраненные выбранные поля
        const response = await fetch(`/api/agents/${agentId}/fields`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setDealFields(data.data.dealFields || [])
            setContactFields(data.data.contactFields || [])
          }
        }
      } catch (error) {
        console.error('Failed to fetch fields', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchFields()
  }, [agentId])

  useEffect(() => {
    if (onFieldsChange) {
      onFieldsChange(dealFields, contactFields)
    }
  }, [dealFields, contactFields, onFieldsChange])

  const addDealField = (fieldId: string) => {
    if (!dealFields.includes(fieldId)) {
      setDealFields([...dealFields, fieldId])
    }
  }

  const removeDealField = (fieldId: string) => {
    setDealFields(dealFields.filter(id => id !== fieldId))
  }

  const addContactField = (fieldId: string) => {
    if (!contactFields.includes(fieldId)) {
      setContactFields([...contactFields, fieldId])
    }
  }

  const removeContactField = (fieldId: string) => {
    setContactFields(contactFields.filter(id => id !== fieldId))
  }

  const saveFields = async () => {
    try {
      const response = await fetch(`/api/agents/${agentId}/fields`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealFields,
          contactFields,
        }),
      })

      if (!response.ok) {
        throw new Error('Не удалось сохранить поля')
      }

      alert('Поля успешно сохранены')
    } catch (error) {
      console.error('Failed to save fields', error)
      alert('Ошибка сохранения полей')
    }
  }

  if (isLoading) {
    return <div className="text-sm text-gray-500 dark:text-gray-400">Загрузка полей...</div>
  }

  return (
    <div className="space-y-6">
      {/* Настройки доступа к данным */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Настройки доступа к данным</h2>
          </div>
          <KwidButton 
            variant="outline" 
            size="sm"
            onClick={async () => {
              // TODO: Добавить логику синхронизации
              console.log('Синхронизация настроек CRM')
            }}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Синхронизировать настройки CRM
          </KwidButton>
        </div>
        <p className="text-sm text-gray-600 mb-6 dark:text-gray-400">
          Выберите, какие данные агент может читать и использовать в диалогах
        </p>

        {/* Данные сделки */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Briefcase className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Данные сделки</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3 dark:text-gray-400">
            Выберите поля сделки, которые агент может читать
          </p>

          {/* Заголовок секции */}
          <h4 className="text-sm font-medium text-gray-700 mb-3 dark:text-gray-300">Выберите поля сделки</h4>

          {/* Выбранные поля */}
          {dealFields.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {dealFields.map((fieldId) => {
                const field = availableDealFields.find(f => f.id === fieldId)
                return field ? (
                  <KwidBadge key={fieldId} variant="primary" className="inline-flex items-center gap-1">
                    {field.name}
                    <button
                      onClick={() => removeDealField(fieldId)}
                      className="ml-1 hover:text-red-600 dark:hover:text-red-400"
                      type="button"
                      aria-label={`Удалить ${field.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </KwidBadge>
                ) : null
              })}
            </div>
          )}

          {/* Выбор поля */}
          <KwidSelect
            options={[
              { value: '', label: 'Выберите поля, к которым агент сможет получить доступ...' },
              ...availableDealFields
                .filter(field => !dealFields.includes(field.id))
                .map((field) => ({ value: field.id, label: field.name })),
            ]}
            value=""
            onChange={(value) => {
              if (value) {
                addDealField(value)
              }
            }}
          />

          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Выбирайте только необходимые поля. Дополнительные поля добавляют лишний контекст и могут снизить точность ответов.
          </p>
        </div>

        {/* Данные контакта */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Данные контакта</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3 dark:text-gray-400">
            Выберите, какие поля контакта агент сможет читать
          </p>

          {/* Заголовок секции */}
          <h4 className="text-sm font-medium text-gray-700 mb-3 dark:text-gray-300">Выберите поля контакта</h4>

          {/* Выбранные поля */}
          {contactFields.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {contactFields.map((fieldId) => {
                const field = availableContactFields.find(f => f.id === fieldId)
                return field ? (
                  <KwidBadge key={fieldId} variant="primary" className="inline-flex items-center gap-1">
                    {field.name}
                    <button
                      onClick={() => removeContactField(fieldId)}
                      className="ml-1 hover:text-red-600 dark:hover:text-red-400"
                      type="button"
                      aria-label={`Удалить ${field.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </KwidBadge>
                ) : null
              })}
            </div>
          )}

          {/* Выбор поля */}
          <KwidSelect
            options={[
              { value: '', label: 'Выберите поля, к которым агент сможет получить доступ...' },
              ...availableContactFields
                .filter(field => !contactFields.includes(field.id))
                .map((field) => ({ value: field.id, label: field.name })),
            ]}
            value=""
            onChange={(value) => {
              if (value) {
                addContactField(value)
              }
            }}
          />

          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Выбирайте только необходимые поля. Большее количество полей добавляет дополнительный контекст и может снизить точность ответов.
          </p>
        </div>
      </div>

      {/* Настройки ввода данных */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center space-x-2 mb-4">
          <Edit className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Настройки ввода данных</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6 dark:text-gray-400">
          Настройте, как агент может изменять данные сделок и контактов в зависимости от контекста разговора.
        </p>

        {/* Данные сделки - правила обновления */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Данные сделки</h3>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-sm text-custom-600 hover:text-custom-700 dark:text-custom-400 dark:hover:text-custom-300">Свернуть все</button>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <button className="text-sm text-custom-600 hover:text-custom-700 dark:text-custom-400 dark:hover:text-custom-300">Развернуть все</button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4 dark:text-gray-400">
            Задайте правила автоматического обновления полей сделки во время разговора.
          </p>
          <div className="space-y-2">
            {dealFields.slice(0, 2).map((fieldId, index) => {
              const field = availableDealFields.find(f => f.id === fieldId)
              return field ? (
                <div key={fieldId} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg dark:border-gray-800">
                  <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400" type="button" aria-label="Переместить вверх">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400" type="button" aria-label="Переместить вниз">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">{field.name}</span>
                  <button 
                    className="text-gray-400 hover:text-red-600 p-1 dark:text-gray-500 dark:hover:text-red-400" 
                    type="button"
                    onClick={() => removeDealField(fieldId)}
                    aria-label={`Удалить ${field.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-gray-600 p-1 dark:text-gray-500 dark:hover:text-gray-400" 
                    type="button"
                    aria-label="Развернуть"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              ) : null
            })}
            <KwidButton variant="outline" size="sm" type="button" className="mt-3">
              Добавить поле
            </KwidButton>
          </div>
        </div>

        {/* Данные контакта - правила обновления */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Данные контакта</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4 dark:text-gray-400">
            Определите правила автоматического обновления полей контакта во время разговора.
          </p>
          <div className="space-y-2">
            {contactFields.slice(0, 1).map((fieldId) => {
              const field = availableContactFields.find(f => f.id === fieldId)
              return field ? (
                <div key={fieldId} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg dark:border-gray-800">
                  <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400" type="button" aria-label="Переместить вверх">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400" type="button" aria-label="Переместить вниз">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">{field.name}</span>
                  <button 
                    className="text-gray-400 hover:text-red-600 p-1 dark:text-gray-500 dark:hover:text-red-400" 
                    type="button"
                    onClick={() => removeContactField(fieldId)}
                    aria-label={`Удалить ${field.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-gray-600 p-1 dark:text-gray-500 dark:hover:text-gray-400" 
                    type="button"
                    aria-label="Развернуть"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              ) : null
            })}
            <KwidButton variant="outline" size="sm" type="button" className="mt-3">
              Добавить поле
            </KwidButton>
          </div>
        </div>
      </div>
    </div>
  )
}


