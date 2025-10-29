import { Book, Video, FileText, HelpCircle } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/Card'

const SupportPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Поддержка</h1>
        <p className="text-gray-600 mt-1">
          Руководства и обучающие материалы для работы с платформой
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Book className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Начало работы
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Узнайте, как создать и настроить вашего первого AI-агента
                </p>
                <ul className="space-y-2">
                  <li className="text-sm text-primary-600 hover:text-primary-700">
                    → Создание аккаунта и базовая настройка
                  </li>
                  <li className="text-sm text-primary-600 hover:text-primary-700">
                    → Настройка первого агента
                  </li>
                  <li className="text-sm text-primary-600 hover:text-primary-700">
                    → Подключение интеграций
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Video className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Видеоуроки
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Пошаговые видеоинструкции по работе с платформой
                </p>
                <ul className="space-y-2">
                  <li className="text-sm text-green-600 hover:text-green-700">
                    → Обзор интерфейса
                  </li>
                  <li className="text-sm text-green-600 hover:text-green-700">
                    → Продвинутые настройки агентов
                  </li>
                  <li className="text-sm text-green-600 hover:text-green-700">
                    → Работа с базой знаний
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Документация
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Полная техническая документация и API reference
                </p>
                <ul className="space-y-2">
                  <li className="text-sm text-purple-600 hover:text-purple-700">
                    → API документация
                  </li>
                  <li className="text-sm text-purple-600 hover:text-purple-700">
                    → Примеры интеграций
                  </li>
                  <li className="text-sm text-purple-600 hover:text-purple-700">
                    → Лучшие практики
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  FAQ
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Ответы на часто задаваемые вопросы
                </p>
                <ul className="space-y-2">
                  <li className="text-sm text-orange-600 hover:text-orange-700">
                    → Как изменить модель ИИ?
                  </li>
                  <li className="text-sm text-orange-600 hover:text-orange-700">
                    → Настройка триггеров
                  </li>
                  <li className="text-sm text-orange-600 hover:text-orange-700">
                    → Проблемы с интеграциями
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Нужна помощь?
          </h3>
          <p className="text-gray-600 mb-4">
            Свяжитесь с нашей службой поддержки, и мы поможем решить любой вопрос.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">Email</p>
              <p className="text-sm text-gray-600">support@gptagent.com</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">Телефон</p>
              <p className="text-sm text-gray-600">+7 (800) 123-45-67</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">Время работы</p>
              <p className="text-sm text-gray-600">Пн-Пт, 9:00 - 18:00 МСК</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SupportPage

