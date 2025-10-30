'use client'

import { useState, useEffect } from 'react'
import { X, Briefcase, Users, Eye, RefreshCw, Edit } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

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
    return <div className="text-sm text-gray-500">Загрузка полей...</div>
  }

  return (
    <div className="space-y-6">
      {/* Настройки доступа к данным */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Настройки доступа к данным</h2>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={async () => {
              // TODO: Добавить логику синхронизации
              console.log('Синхронизация настроек CRM')
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Синхронизировать настройки CRM
          </Button>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Выберите, какие данные агент может читать и использовать в диалогах
        </p>

        {/* Данные сделки */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Briefcase className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">Данные сделки</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Выберите поля сделки, которые агент может читать
          </p>

          {/* Заголовок секции */}
          <h4 className="text-sm font-medium text-gray-700 mb-3">Выберите поля сделки</h4>

          {/* Выбранные поля */}
          {dealFields.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {dealFields.map((fieldId) => {
                const field = availableDealFields.find(f => f.id === fieldId)
                return field ? (
                  <span
                    key={fieldId}
                    className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700"
                  >
                    {field.name}
                    <button
                      onClick={() => removeDealField(fieldId)}
                      className="ml-1 hover:text-red-600"
                      type="button"
                      aria-label={`Удалить ${field.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ) : null
              })}
            </div>
          )}

          {/* Выбор поля */}
          <div className="relative">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              onChange={(e) => {
                if (e.target.value) {
                  addDealField(e.target.value)
                  e.target.value = ''
                }
              }}
            >
              <option value="">Выберите поля, к которым агент сможет получить доступ...</option>
              {availableDealFields
                .filter(field => !dealFields.includes(field.id))
                .map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
            </select>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Выбирайте только необходимые поля. Дополнительные поля добавляют лишний контекст и могут снизить точность ответов.
          </p>
        </div>

        {/* Данные контакта */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Users className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">Данные контакта</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Выберите, какие поля контакта агент сможет читать
          </p>

          {/* Заголовок секции */}
          <h4 className="text-sm font-medium text-gray-700 mb-3">Выберите поля контакта</h4>

          {/* Выбранные поля */}
          {contactFields.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {contactFields.map((fieldId) => {
                const field = availableContactFields.find(f => f.id === fieldId)
                return field ? (
                  <span
                    key={fieldId}
                    className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700"
                  >
                    {field.name}
                    <button
                      onClick={() => removeContactField(fieldId)}
                      className="ml-1 hover:text-red-600"
                      type="button"
                      aria-label={`Удалить ${field.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ) : null
              })}
            </div>
          )}

          {/* Выбор поля */}
          <div className="relative">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              onChange={(e) => {
                if (e.target.value) {
                  addContactField(e.target.value)
                  e.target.value = ''
                }
              }}
            >
              <option value="">Выберите поля, к которым агент сможет получить доступ...</option>
              {availableContactFields
                .filter(field => !contactFields.includes(field.id))
                .map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
            </select>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Выбирайте только необходимые поля. Большее количество полей добавляет дополнительный контекст и может снизить точность ответов.
          </p>
        </div>
      </div>

      {/* Настройки ввода данных */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Edit className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Настройки ввода данных</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Настройте, как агент может изменять данные сделок и контактов в зависимости от контекста разговора.
        </p>

        {/* Данные сделки - правила обновления */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Данные сделки</h3>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-sm text-primary-600 hover:text-primary-700">Свернуть все</button>
              <span className="text-gray-300">|</span>
              <button className="text-sm text-primary-600 hover:text-primary-700">Развернуть все</button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Задайте правила автоматического обновления полей сделки во время разговора.
          </p>
          <div className="space-y-2">
            {dealFields.slice(0, 2).map((fieldId, index) => {
              const field = availableDealFields.find(f => f.id === fieldId)
              return field ? (
                <div key={fieldId} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
                  <button className="text-gray-400 hover:text-gray-600" type="button" aria-label="Переместить вверх">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600" type="button" aria-label="Переместить вниз">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <span className="flex-1 text-sm font-medium text-gray-700">{field.name}</span>
                  <button 
                    className="text-gray-400 hover:text-red-600 p-1" 
                    type="button"
                    onClick={() => removeDealField(fieldId)}
                    aria-label={`Удалить ${field.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-gray-600 p-1" 
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
            <Button variant="outline" size="sm" type="button" className="mt-3">
              Добавить поле
            </Button>
          </div>
        </div>

        {/* Данные контакта - правила обновления */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Данные контакта</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Определите правила автоматического обновления полей контакта во время разговора.
          </p>
          <div className="space-y-2">
            {contactFields.slice(0, 1).map((fieldId) => {
              const field = availableContactFields.find(f => f.id === fieldId)
              return field ? (
                <div key={fieldId} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
                  <button className="text-gray-400 hover:text-gray-600" type="button" aria-label="Переместить вверх">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600" type="button" aria-label="Переместить вниз">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <span className="flex-1 text-sm font-medium text-gray-700">{field.name}</span>
                  <button 
                    className="text-gray-400 hover:text-red-600 p-1" 
                    type="button"
                    onClick={() => removeContactField(fieldId)}
                    aria-label={`Удалить ${field.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-gray-600 p-1" 
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
            <Button variant="outline" size="sm" type="button" className="mt-3">
              Добавить поле
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


