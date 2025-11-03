'use client'

import { useState, useEffect } from 'react'
import { X, Briefcase, Users, Eye, RefreshCw, Edit, ChevronDown, ChevronUp, GripVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/shadcn/badge'

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

 const [dealDataCollapsed, setDealDataCollapsed] = useState(false)
 const [contactDataCollapsed, setContactDataCollapsed] = useState(false)
 const [dealWriteFields, setDealWriteFields] = useState<string[]>([])
 const [contactWriteFields, setContactWriteFields] = useState<string[]>([])
 const [collapsedRepeaterItems, setCollapsedRepeaterItems] = useState<Set<string>>(new Set())

 useEffect(() => {
 if (dealFields.length > 0) {
 setDealWriteFields(dealFields.slice(0, 2))
 }
 if (contactFields.length > 0) {
 setContactWriteFields(contactFields.slice(0, 1))
 }
 }, [dealFields, contactFields])

 if (isLoading) {
 return <div className="text-sm text-gray-500">Загрузка полей...</div>
 }

 return (
 <div className="space-y-6">
 {/* Настройки доступа к данным */}
 <div className="fi-section rounded-lg border border-gray-200 bg-white">
 <header className="fi-section-header flex flex-col gap-3 px-6 py-4">
 <div className="flex items-center justify-between">
 <h3 className="fi-section-header-heading text-base font-semibold leading-6 text-gray-950">
 Настройки доступа к данным
 </h3>
 <div className="fi-ac gap-3 flex flex-wrap items-center justify-start">
 <Button 
 variant="secondary" 
 size="sm"
 onClick={async () => {
 // TODO: Добавить логику синхронизации
 console.log('Синхронизация настроек CRM')
 }}
 className="fi-btn-color-gray fi-color-gray fi-size-sm"
 >
 <RefreshCw className="w-4 h-4" />
 <span className="fi-btn-label">Синхронизировать настройки CRM</span>
 </Button>
 </div>
 </div>
 <p className="fi-section-header-description overflow-hidden break-words text-sm text-gray-500">
 Выберите, какие данные агент может читать и использовать в диалогах
 </p>
 </header>

 <div className="fi-section-content p-6">
 {/* Данные сделки */}
 <div 
 onClick={() => setDealDataCollapsed(!dealDataCollapsed)}
 className="fi-section-header flex flex-col gap-3 cursor-pointer px-4 py-2.5 mb-4"
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-x-3">
 <Briefcase className="h-5 w-5 text-gray-400" />
 <h3 className="fi-section-header-heading text-base font-semibold leading-6 text-gray-950">
 Данные сделки
 </h3>
 </div>
 <button
 type="button"
 className="fi-icon-btn relative flex items-center justify-center rounded-lg outline-none transition duration-75 focus-visible:ring-2 -m-2 h-9 w-9 text-gray-400 hover:text-gray-500 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
 style={{
 '--c-300': 'var(--gray-300)',
 '--c-400': 'var(--gray-400)',
 '--c-500': 'var(--gray-500)',
 '--c-600': 'var(--gray-600)',
 } as React.CSSProperties}
 >
 <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${dealDataCollapsed ? '' : 'rotate-180'}`} />
 </button>
 </div>
 <p className="fi-section-header-description overflow-hidden break-words text-sm text-gray-500">
 Выберите поля сделки, которые агент может читать
 </p>
 </div>

 {!dealDataCollapsed && (
 <div className="px-4 space-y-4">
 <div className="flex items-center gap-x-3 justify-between">
 <span className="text-sm font-medium leading-6 text-gray-950">
 Выберите поля сделки
 </span>
 </div>

 {/* Выбранные поля в стиле Choices.js */}
 {dealFields.length > 0 && (
 <div className="choices__inner flex flex-wrap gap-2 mb-3">
 {dealFields.map((fieldId) => {
 const field = availableDealFields.find(f => f.id === fieldId)
 return field ? (
 <div 
 key={fieldId}
 className="choices__item choices__item--selectable inline-flex items-center gap-1 rounded bg-gray-100 px-3 py-1 text-sm text-gray-700"
 data-item
 data-id={fieldId}
 data-value={fieldId}
 aria-selected="true"
 >
 {field.name}
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation()
 removeDealField(fieldId)
 }}
 className="choices__button ml-1 text-gray-500 hover:text-red-600"
 aria-label={`Remove item: '${field.name}'`}
 data-button
 >
 Remove item
 </button>
 </div>
 ) : null
 })}
 </div>
 )}

 {/* Выбор поля */}
 <div className="relative">
 <Select
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
 placeholder="Выберите поля, к которым агент сможет получить доступ..."
 />
 </div>
 <p className="fi-fo-field-wrp-helper-text break-words text-sm text-gray-500 mt-1">
 Выбирайте только необходимые поля. Дополнительные поля добавляют лишний контекст и могут снизить точность ответов
 </p>
 </div>
 )}

 {/* Данные контакта */}
 <div 
 onClick={() => setContactDataCollapsed(!contactDataCollapsed)}
 className="fi-section-header flex flex-col gap-3 cursor-pointer px-4 py-2.5 mb-4"
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-x-3">
 <Users className="h-5 w-5 text-gray-400" />
 <h3 className="fi-section-header-heading text-base font-semibold leading-6 text-gray-950">
 Данные контакта
 </h3>
 </div>
 <button
 type="button"
 className="fi-icon-btn relative flex items-center justify-center rounded-lg outline-none transition duration-75 focus-visible:ring-2 -m-2 h-9 w-9 text-gray-400 hover:text-gray-500 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
 style={{
 '--c-300': 'var(--gray-300)',
 '--c-400': 'var(--gray-400)',
 '--c-500': 'var(--gray-500)',
 '--c-600': 'var(--gray-600)',
 } as React.CSSProperties}
 >
 <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${contactDataCollapsed ? '' : 'rotate-180'}`} />
 </button>
 </div>
 <p className="fi-section-header-description overflow-hidden break-words text-sm text-gray-500">
 Выберите, какие поля контакта агент сможет читать
 </p>
 </div>

 {!contactDataCollapsed && (
 <div className="px-4 space-y-4">
 <div className="flex items-center gap-x-3 justify-between">
 <span className="text-sm font-medium leading-6 text-gray-950">
 Выберите поля контакта
 </span>
 </div>

 {/* Выбранные поля в стиле Choices.js */}
 {contactFields.length > 0 && (
 <div className="choices__inner flex flex-wrap gap-2 mb-3">
 {contactFields.map((fieldId) => {
 const field = availableContactFields.find(f => f.id === fieldId)
 return field ? (
 <div 
 key={fieldId}
 className="choices__item choices__item--selectable inline-flex items-center gap-1 rounded bg-gray-100 px-3 py-1 text-sm text-gray-700"
 data-item
 data-id={fieldId}
 data-value={fieldId}
 aria-selected="true"
 >
 {field.name}
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation()
 removeContactField(fieldId)
 }}
 className="choices__button ml-1 text-gray-500 hover:text-red-600"
 aria-label={`Remove item: '${field.name}'`}
 data-button
 >
 Remove item
 </button>
 </div>
 ) : null
 })}
 </div>
 )}

 {/* Выбор поля */}
 <div className="relative">
 <Select
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
 placeholder="Выберите поля, к которым агент сможет получить доступ..."
 />
 </div>
 <p className="fi-fo-field-wrp-helper-text break-words text-sm text-gray-500 mt-1">
 Выбирайте только необходимые поля. Большее количество полей добавляет дополнительный контекст и может снизить точность ответов.
 </p>
 </div>
 )}
 </div>
 </div>

 {/* Настройки ввода данных */}
 <div className="fi-section rounded-lg border border-gray-200 bg-white">
 <header className="fi-section-header flex flex-col gap-3 px-6 py-4">
 <h3 className="fi-section-header-heading text-base font-semibold leading-6 text-gray-950">
 Настройки ввода данных
 </h3>
 <p className="fi-section-header-description overflow-hidden break-words text-sm text-gray-500">
 Настройте, как агент может изменять данные сделок и контактов в зависимости от контекста разговора.
 </p>
 </header>

 <div className="fi-section-content p-6">
 {/* Данные сделки - правила обновления */}
 <div className="mb-6">
 <div 
 className="fi-section-header flex flex-col gap-3 cursor-pointer px-4 py-2.5 mb-4"
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-x-3">
 <Edit className="h-5 w-5 text-gray-400" />
 <h3 className="fi-section-header-heading text-base font-semibold leading-6 text-gray-950">
 Данные сделки
 </h3>
 </div>
 <button
 type="button"
 className="fi-icon-btn relative flex items-center justify-center rounded-lg outline-none transition duration-75 focus-visible:ring-2 -m-2 h-9 w-9 text-gray-400 hover:text-gray-500 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
 >
 <ChevronDown className="h-5 w-5" />
 </button>
 </div>
 <p className="fi-section-header-description overflow-hidden break-words text-sm text-gray-500">
 Задайте правила автоматического обновления полей сделки во время разговора
 </p>
 </div>
 <div className="flex items-center justify-end mb-4 px-4">
 <div className="flex gap-x-3">
 <button 
 type="button"
 className="text-sm text-gray-600 hover:text-gray-700"
 onClick={() => setCollapsedRepeaterItems(new Set(dealWriteFields))}
 >
 Свернуть все
 </button>
 <button 
 type="button"
 className="text-sm text-gray-600 hover:text-gray-700"
 onClick={() => setCollapsedRepeaterItems(new Set())}
 >
 Развернуть все
 </button>
 </div>
 </div>
 <div className="space-y-2">
 {dealWriteFields.map((fieldId) => {
 const field = availableDealFields.find(f => f.id === fieldId)
 const isCollapsed = collapsedRepeaterItems.has(fieldId)
 if (!field) return null
 return (
 <div key={fieldId} className="fi-fo-repeater-item border border-gray-200 rounded-lg">
 <div 
 onClick={() => {
 const newSet = new Set(collapsedRepeaterItems)
 if (newSet.has(fieldId)) {
 newSet.delete(fieldId)
 } else {
 newSet.add(fieldId)
 }
 setCollapsedRepeaterItems(newSet)
 }}
 className="fi-fo-repeater-item-header flex items-center gap-x-3 overflow-hidden px-4 py-3 cursor-pointer select-none"
 >
 <GripVertical className="h-4 w-4 text-gray-400" aria-label="Переместить" />
 <span className="flex-1 text-sm font-medium text-gray-700">{field.name}</span>
 <button 
 type="button"
 onClick={(e) => {
 e.stopPropagation()
 setDealWriteFields(dealWriteFields.filter(id => id !== fieldId))
 }}
 className="text-gray-400 hover:text-red-600 p-1"
 aria-label="Удалить"
 >
 <Trash2 className="h-4 w-4" />
 </button>
 <button 
 type="button"
 onClick={(e) => {
 e.stopPropagation()
 const newSet = new Set(collapsedRepeaterItems)
 if (newSet.has(fieldId)) {
 newSet.delete(fieldId)
 } else {
 newSet.add(fieldId)
 }
 setCollapsedRepeaterItems(newSet)
 }}
 className="text-gray-400 hover:text-gray-600 p-1"
 aria-label={isCollapsed ? "Развернуть" : "Свернуть"}
 >
 {isCollapsed ? (
 <ChevronDown className="h-4 w-4" />
 ) : (
 <ChevronUp className="h-4 w-4" />
 )}
 </button>
 </div>
 {!isCollapsed && (
 <div className="fi-section-content p-4 border-t border-gray-200">
 {/* Здесь будут настройки для этого поля */}
 </div>
 )}
 </div>
 )
 })}
 <Button 
 variant="secondary" 
 size="sm" 
 type="button" 
 className="mt-3 fi-btn-color-gray fi-color-gray"
 onClick={() => {
 // TODO: Логика добавления нового поля
 console.log('Добавить поле')
 }}
 >
 <span className="fi-btn-label">Добавить поле</span>
 </Button>
 </div>
 </div>

 {/* Данные контакта - правила обновления */}
 <div>
 <div 
 className="fi-section-header flex flex-col gap-3 cursor-pointer px-4 py-2.5 mb-4"
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-x-3">
 <Edit className="h-5 w-5 text-gray-400" />
 <h3 className="fi-section-header-heading text-base font-semibold leading-6 text-gray-950">
 Данные контакта
 </h3>
 </div>
 <button
 type="button"
 className="fi-icon-btn relative flex items-center justify-center rounded-lg outline-none transition duration-75 focus-visible:ring-2 -m-2 h-9 w-9 text-gray-400 hover:text-gray-500 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
 >
 <ChevronDown className="h-5 w-5" />
 </button>
 </div>
 <p className="fi-section-header-description overflow-hidden break-words text-sm text-gray-500">
 Определите правила автоматического обновления полей контакта во время разговора
 </p>
 </div>
 <div className="space-y-2">
 {contactWriteFields.map((fieldId) => {
 const field = availableContactFields.find(f => f.id === fieldId)
 const isCollapsed = collapsedRepeaterItems.has(fieldId)
 if (!field) return null
 return (
 <div key={fieldId} className="fi-fo-repeater-item border border-gray-200 rounded-lg">
 <div 
 onClick={() => {
 const newSet = new Set(collapsedRepeaterItems)
 if (newSet.has(fieldId)) {
 newSet.delete(fieldId)
 } else {
 newSet.add(fieldId)
 }
 setCollapsedRepeaterItems(newSet)
 }}
 className="fi-fo-repeater-item-header flex items-center gap-x-3 overflow-hidden px-4 py-3 cursor-pointer select-none"
 >
 <GripVertical className="h-4 w-4 text-gray-400" aria-label="Переместить" />
 <span className="flex-1 text-sm font-medium text-gray-700">{field.name}</span>
 <button 
 type="button"
 onClick={(e) => {
 e.stopPropagation()
 setContactWriteFields(contactWriteFields.filter(id => id !== fieldId))
 }}
 className="text-gray-400 hover:text-red-600 p-1"
 aria-label="Удалить"
 >
 <Trash2 className="h-4 w-4" />
 </button>
 <button 
 type="button"
 onClick={(e) => {
 e.stopPropagation()
 const newSet = new Set(collapsedRepeaterItems)
 if (newSet.has(fieldId)) {
 newSet.delete(fieldId)
 } else {
 newSet.add(fieldId)
 }
 setCollapsedRepeaterItems(newSet)
 }}
 className="text-gray-400 hover:text-gray-600 p-1"
 aria-label={isCollapsed ? "Развернуть" : "Свернуть"}
 >
 {isCollapsed ? (
 <ChevronDown className="h-4 w-4" />
 ) : (
 <ChevronUp className="h-4 w-4" />
 )}
 </button>
 </div>
 {!isCollapsed && (
 <div className="fi-section-content p-4 border-t border-gray-200">
 {/* Здесь будут настройки для этого поля */}
 </div>
 )}
 </div>
 )
 })}
 <Button 
 variant="secondary" 
 size="sm" 
 type="button" 
 className="mt-3 fi-btn-color-gray fi-color-gray"
 onClick={() => {
 // TODO: Логика добавления нового поля
 console.log('Добавить поле')
 }}
 >
 <span className="fi-btn-label">Добавить поле</span>
 </Button>
 </div>
 </div>
 </div>
 </div>
 </div>
 )
}


