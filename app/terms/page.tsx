import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Logo } from '@/components/ui/Logo'
import { Card, CardContent } from '@/components/ui'
import { FileText, Calendar, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Условия использования — TON 18',
  description: 'Условия использования приложения TON 18',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <PublicHeader showNav={true} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Условия использования
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
                  <Shield className="h-6 w-6 text-primary" />
                  1. Принятие условий
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Используя приложение TON 18, вы соглашаетесь с настоящими Условиями использования. 
                  Если вы не согласны с какими-либо условиями, пожалуйста, не используйте наш сервис.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Мы оставляем за собой право изменять эти условия в любое время. 
                  Продолжение использования сервиса после внесения изменений означает ваше согласие с новыми условиями.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                  2. Описание сервиса
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  TON 18 — это приложение для создания и управления AI-агентами, которое позволяет:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                  <li>Создавать и настраивать AI-агентов с использованием различных моделей LLM</li>
                  <li>Обучать агентов через базу знаний и файлы</li>
                  <li>Интегрировать агентов с CRM системами и другими сервисами</li>
                  <li>Автоматизировать работу с клиентами и обработку запросов</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                  3. Регистрация и учетная запись
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Для использования приложения необходимо создать учетную запись. Вы обязуетесь:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                  <li>Предоставлять точную и актуальную информацию при регистрации</li>
                  <li>Поддерживать безопасность своей учетной записи и пароля</li>
                  <li>Немедленно уведомлять нас о любом несанкционированном использовании вашей учетной записи</li>
                  <li>Нести ответственность за все действия, совершенные под вашей учетной записью</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                  4. Использование сервиса
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Вы соглашаетесь использовать приложение только в законных целях и в соответствии с настоящими условиями. 
                  Запрещается:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                  <li>Использовать сервис для незаконных или мошеннических целей</li>
                  <li>Нарушать права интеллектуальной собственности других лиц</li>
                  <li>Передавать вредоносное программное обеспечение или код</li>
                  <li>Пытаться получить несанкционированный доступ к системе или данным других пользователей</li>
                  <li>Использовать сервис для создания контента, нарушающего права третьих лиц</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                  5. Тарифы и оплата
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Доступ к приложению предоставляется на основе выбранного тарифного плана. 
                  Подробная информация о тарифах доступна на странице{' '}
                  <Link href="/pricing" className="text-primary hover:underline">
                    тарифов
                  </Link>.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Оплата производится в соответствии с выбранным планом. Мы оставляем за собой право изменять 
                  тарифы с уведомлением пользователей за 30 дней до вступления изменений в силу.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Возврат средств возможен в течение 30 дней с момента оплаты при условии, что услуга не была 
                  использована сверх установленных лимитов бесплатного плана.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                  6. Интеллектуальная собственность
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Все права на приложение TON 18, включая дизайн, функциональность и контент, принадлежат нам 
                  или нашим лицензиарам. Вы получаете ограниченную, неисключительную, непередаваемую лицензию 
                  на использование сервиса в соответствии с настоящими условиями.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Контент, созданный вами с использованием приложения, остается вашей собственностью. 
                  Вы предоставляете нам лицензию на использование такого контента для предоставления услуг.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                  7. Ограничение ответственности
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Приложение предоставляется &quot;как есть&quot; без каких-либо гарантий. Мы не гарантируем, что:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                  <li>Сервис будет работать без перерывов или ошибок</li>
                  <li>Результаты работы AI-агентов будут точными или соответствовать вашим ожиданиям</li>
                  <li>Все функции будут доступны в любое время</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                  Мы не несем ответственности за любые прямые, косвенные, случайные или последующие убытки, 
                  возникшие в результате использования или невозможности использования сервиса.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                  8. Прекращение использования
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Мы оставляем за собой право приостановить или прекратить доступ к вашей учетной записи 
                  в случае нарушения настоящих условий использования.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Вы можете прекратить использование сервиса в любое время, отменив подписку в настройках 
                  учетной записи.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                  9. Контактная информация
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  По вопросам, связанным с настоящими условиями использования, вы можете связаться с нами 
                  по адресу:{' '}
                  <Link href="mailto:legal@ton18.com" className="text-primary hover:underline">
                    legal@ton18.com
                  </Link>
                </p>
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
                create infinity — Приложение для создания и автоматизации работы с AI-агентами
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

