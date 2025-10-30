import { Card, CardContent } from '@/components/ui/Card'
import { Book, Video, FileText, HelpCircle } from 'lucide-react'

export const metadata = {
  title: 'Поддержка',
  description: 'Руководства и обучающие материалы для работы с платформой',
}

const SupportPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Поддержка</h1>
        <p className="mt-1 text-gray-600">Руководства и обучающие материалы для работы с платформой</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50">
                <Book className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Начало работы</h3>
                <p className="mb-4 text-sm text-gray-600">
                  Узнайте, как создать и настроить вашего первого AI-агента
                </p>
                <ul className="space-y-2 text-sm text-primary-600">
                  <li className="transition-colors hover:text-primary-700">→ Создание аккаунта и базовая настройка</li>
                  <li className="transition-colors hover:text-primary-700">→ Настройка первого агента</li>
                  <li className="transition-colors hover:text-primary-700">→ Подключение интеграций</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-50">
                <Video className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Видеоуроки</h3>
                <p className="mb-4 text-sm text-gray-600">Пошаговые видеоинструкции по работе с платформой</p>
                <ul className="space-y-2 text-sm text-green-600">
                  <li className="transition-colors hover:text-green-700">→ Обзор интерфейса</li>
                  <li className="transition-colors hover:text-green-700">→ Продвинутые настройки агентов</li>
                  <li className="transition-colors hover:text-green-700">→ Работа с базой знаний</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Документация</h3>
                <p className="mb-4 text-sm text-gray-600">Полная техническая документация и API reference</p>
                <ul className="space-y-2 text-sm text-purple-600">
                  <li className="transition-colors hover:text-purple-700">→ API документация</li>
                  <li className="transition-colors hover:text-purple-700">→ Примеры интеграций</li>
                  <li className="transition-colors hover:text-purple-700">→ Лучшие практики</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-orange-50">
                <HelpCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">FAQ</h3>
                <p className="mb-4 text-sm text-gray-600">Ответы на часто задаваемые вопросы</p>
                <ul className="space-y-2 text-sm text-orange-600">
                  <li className="transition-colors hover:text-orange-700">→ Как изменить модель ИИ?</li>
                  <li className="transition-colors hover:text-orange-700">→ Настройка триггеров</li>
                  <li className="transition-colors hover:text-orange-700">→ Проблемы с интеграциями</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Нужна помощь?</h3>
          <p className="mb-4 text-gray-600">Свяжитесь с нашей службой поддержки, и мы поможем решить любой вопрос.</p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="mb-1 text-sm font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-600">support@gptagent.com</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="mb-1 text-sm font-medium text-gray-900">Телефон</p>
              <p className="text-sm text-gray-600">+7 (800) 123-45-67</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="mb-1 text-sm font-medium text-gray-900">Время работы</p>
              <p className="text-sm text-gray-600">Пн-Пт, 9:00 - 18:00 МСК</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SupportPage


