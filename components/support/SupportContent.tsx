'use client'

import Link from 'next/link'
import { Book, FileText, HelpCircle, Video } from 'lucide-react'

import { KwidButton, KwidSection } from '@/components/kwid'

interface SupportContentProps {
  variant?: 'public' | 'internal'
}

export const SupportContent = ({ variant = 'internal' }: SupportContentProps) => {
  const isPublic = variant === 'public'

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isPublic ? 'Поддержка и обучение' : 'Getting Started'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Руководства, документация и ответы на вопросы, которые помогают работать с платформой
        </p>
        {isPublic && (
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <KwidButton asChild size="sm" variant="primary">
              <Link href="/register">Создать аккаунт</Link>
            </KwidButton>
            <KwidButton asChild size="sm" variant="outline">
              <Link href="/login">Войти</Link>
            </KwidButton>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <KwidSection
          title="Начало работы"
          icon={Book}
          className="cursor-pointer transition-shadow hover:shadow-lg"
        >
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50">
              <Book className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Узнайте, как создать организацию и настроить первого AI-агента за несколько шагов
              </p>
              <ul className="space-y-2 text-sm text-primary-600 dark:text-primary-400">
                <li className="transition-colors hover:text-primary-700 dark:hover:text-primary-300">
                  → Создание аккаунта и базовая настройка
                </li>
                <li className="transition-colors hover:text-primary-700 dark:hover:text-primary-300">
                  → Настройка первого агента
                </li>
                <li className="transition-colors hover:text-primary-700 dark:hover:text-primary-300">
                  → Подключение интеграций
                </li>
              </ul>
            </div>
          </div>
        </KwidSection>

        <KwidSection
          title="Видеоуроки"
          icon={Video}
          className="cursor-pointer transition-shadow hover:shadow-lg"
        >
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-50">
              <Video className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Пошаговые видеоинструкции по работе с платформой и лучшим сценариям использования
              </p>
              <ul className="space-y-2 text-sm text-green-600 dark:text-green-400">
                <li className="transition-colors hover:text-green-700 dark:hover:text-green-300">
                  → Обзор интерфейса
                </li>
                <li className="transition-colors hover:text-green-700 dark:hover:text-green-300">
                  → Продвинутые настройки агентов
                </li>
                <li className="transition-colors hover:text-green-700 dark:hover:text-green-300">
                  → Работа с базой знаний
                </li>
              </ul>
            </div>
          </div>
        </KwidSection>

        <KwidSection
          title="Документация"
          icon={FileText}
          className="cursor-pointer transition-shadow hover:shadow-lg"
        >
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Полная техническая документация, API reference и примеры интеграций
              </p>
              <ul className="space-y-2 text-sm text-purple-600 dark:text-purple-400">
                <li className="transition-colors hover:text-purple-700 dark:hover:text-purple-300">
                  → API документация
                </li>
                <li className="transition-colors hover:text-purple-700 dark:hover:text-purple-300">
                  → Примеры интеграций
                </li>
                <li className="transition-colors hover:text-purple-700 dark:hover:text-purple-300">
                  → Лучшие практики
                </li>
              </ul>
            </div>
          </div>
        </KwidSection>

        <KwidSection
          title="FAQ"
          icon={HelpCircle}
          className="cursor-pointer transition-shadow hover:shadow-lg"
        >
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-orange-50">
              <HelpCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Ответы на популярные вопросы по настройке агентов, тарифам и интеграциям
              </p>
              <ul className="space-y-2 text-sm text-orange-600 dark:text-orange-400">
                <li className="transition-colors hover:text-orange-700 dark:hover:text-orange-300">
                  → Как изменить модель ИИ?
                </li>
                <li className="transition-colors hover:text-orange-700 dark:hover:text-orange-300">
                  → Настройка триггеров
                </li>
                <li className="transition-colors hover:text-orange-700 dark:hover:text-orange-300">
                  → Проблемы с интеграциями
                </li>
              </ul>
            </div>
          </div>
        </KwidSection>
      </div>

      <KwidSection title="Нужна помощь?">
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Свяжитесь с нашей командой поддержки — ответим на вопросы и поможем настроить платформу для вашей команды.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <p className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Email
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              support@gptagent.com
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <p className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Телефон
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              +7 (800) 123-45-67
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <p className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Время работы
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Пн-Пт 09:00 – 19:00 (МСК)
            </p>
          </div>
        </div>
      </KwidSection>
    </div>
  )
}

