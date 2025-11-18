// Force dynamic rendering to avoid prerender errors
export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Logo } from '@/components/ui/Logo'
import { Card, CardContent } from '@/components/ui'
import { Shield, Lock, Eye, Database, Mail, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности — TON 18',
  description: 'Политика конфиденциальности платформы TON 18',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <PublicHeader showNav={true} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Политика конфиденциальности
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Последнее обновление: {new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Lock className="h-6 w-6 text-primary" />
                  1. Введение
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  TON 18 (&quot;мы&quot;, &quot;наш&quot;, &quot;сервис&quot;) серьезно относится к защите вашей конфиденциальности. 
                  Настоящая Политика конфиденциальности описывает, как мы собираем, используем и защищаем вашу личную информацию 
                  при использовании нашей платформы.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Используя наш сервис, вы соглашаетесь с условиями настоящей Политики конфиденциальности.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Database className="h-6 w-6 text-primary" />
                  2. Собираемая информация
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Мы собираем следующие типы информации:
                </p>
                
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 mt-6">
                  2.1. Информация, предоставляемая вами
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                  <li>Имя, фамилия и контактная информация (email, телефон)</li>
                  <li>Информация об организации</li>
                  <li>Платежная информация (обрабатывается через защищенные платежные системы)</li>
                  <li>Контент, загружаемый вами в базу знаний</li>
                  <li>Настройки и конфигурации ваших AI-агентов</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 mt-6">
                  2.2. Автоматически собираемая информация
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                  <li>Данные об использовании платформы (логи, метрики производительности)</li>
                  <li>Техническая информация (IP-адрес, тип браузера, операционная система)</li>
                  <li>Информация о взаимодействии с AI-агентами</li>
                  <li>Cookies и аналогичные технологии отслеживания</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Eye className="h-6 w-6 text-primary" />
                  3. Использование информации
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Мы используем собранную информацию для:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                  <li>Предоставления и улучшения наших услуг</li>
                  <li>Обработки платежей и управления подписками</li>
                  <li>Связи с вами по вопросам сервиса и поддержки</li>
                  <li>Отправки важных уведомлений и обновлений</li>
                  <li>Анализа использования платформы для улучшения функциональности</li>
                  <li>Обеспечения безопасности и предотвращения мошенничества</li>
                  <li>Соблюдения юридических обязательств</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                  4. Защита данных
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Мы применяем современные меры безопасности для защиты ваших данных:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                  <li>Шифрование данных при передаче (TLS/SSL)</li>
                  <li>Шифрование данных при хранении</li>
                  <li>Регулярные проверки безопасности и аудиты</li>
                  <li>Ограниченный доступ к персональным данным только для уполномоченных сотрудников</li>
                  <li>Регулярное резервное копирование данных</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                  Однако ни один метод передачи данных через интернет не является абсолютно безопасным. 
                  Мы не можем гарантировать абсолютную безопасность ваших данных.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                  5. Передача данных третьим лицам
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Мы не продаем ваши персональные данные третьим лицам. Мы можем передавать данные только в следующих случаях:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                  <li>Поставщикам услуг, которые помогают нам предоставлять платформу (хостинг, платежные системы, аналитика)</li>
                  <li>При необходимости соблюдения юридических обязательств</li>
                  <li>Для защиты наших прав и безопасности</li>
                  <li>С вашего явного согласия</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                  Все третьи лица, с которыми мы работаем, обязаны соблюдать конфиденциальность и использовать данные 
                  только для указанных целей.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                  6. Ваши права
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  В соответствии с применимым законодательством, вы имеете право:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                  <li>Получать доступ к вашим персональным данным</li>
                  <li>Исправлять неточные или неполные данные</li>
                  <li>Удалять ваши персональные данные</li>
                  <li>Ограничивать обработку ваших данных</li>
                  <li>Переносить ваши данные</li>
                  <li>Возражать против обработки ваших данных</li>
                  <li>Отозвать согласие на обработку данных</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                  Для осуществления этих прав свяжитесь с нами по адресу:{' '}
                  <Link href="mailto:privacy@ton18.com" className="text-primary hover:underline">
                    privacy@ton18.com
                  </Link>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                  7. Cookies и отслеживание
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Мы используем cookies и аналогичные технологии для:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                  <li>Обеспечения функциональности платформы</li>
                  <li>Запоминания ваших предпочтений и настроек</li>
                  <li>Анализа использования сервиса</li>
                  <li>Улучшения пользовательского опыта</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                  Вы можете управлять настройками cookies через настройки вашего браузера. 
                  Однако отключение некоторых cookies может повлиять на функциональность платформы.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                  8. Хранение данных
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Мы храним ваши персональные данные в течение срока, необходимого для:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                  <li>Предоставления вам услуг</li>
                  <li>Соблюдения юридических обязательств</li>
                  <li>Разрешения споров</li>
                  <li>Обеспечения безопасности</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                  После закрытия учетной записи мы удалим или анонимизируем ваши данные в соответствии 
                  с применимым законодательством, за исключением случаев, когда требуется более длительное хранение.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                  9. Изменения в политике
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Мы можем периодически обновлять настоящую Политику конфиденциальности. 
                  О существенных изменениях мы уведомим вас по email или через уведомления в платформе. 
                  Дата последнего обновления указана в начале документа.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Mail className="h-6 w-6 text-primary" />
                  10. Контактная информация
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  По вопросам, связанным с настоящей Политикой конфиденциальности или обработкой ваших данных, 
                  вы можете связаться с нами:
                </p>
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-gray-900 dark:text-gray-100 font-medium mb-2">Email:</p>
                  <Link href="mailto:privacy@ton18.com" className="text-primary hover:underline">
                    privacy@ton18.com
                  </Link>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-950 transition-colors mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
            {/* Логотип и описание */}
            <div className="md:col-span-4 lg:col-span-3 flex flex-col">
              <div className="mb-5">
                <Logo showTagline />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs leading-relaxed mt-2">
                create infinity — Платформа для создания и автоматизации работы с AI-агентами
              </p>
            </div>
            
            {/* Навигация */}
            <div className="grid grid-cols-2 gap-8 md:col-span-8 lg:col-span-9 sm:grid-cols-3 lg:grid-cols-4">
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Продукт</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link href="/#features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Возможности
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Тарифы
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Аккаунт</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link href="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Войти
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Зарегистрироваться
                    </Link>
                  </li>
                  <li>
                    <Link href="/reset-password/request" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Восстановить пароль
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Поддержка</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link href="/support" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Помощь
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#E63946] dark:hover:text-[#E63946] transition-colors">
                      Документация
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Разделитель и копирайт */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} TON 18. Все права защищены.
              </p>
              <div className="flex gap-6">
                <Link href="/privacy" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Политика конфиденциальности
                </Link>
                <Link href="/terms" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Условия использования
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

