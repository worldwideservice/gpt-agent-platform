import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { HelpCircle, Mail, MessageSquare, BookOpen, FileText, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Помощь и поддержка — TON 18',
  description: 'Получите помощь и поддержку по использованию платформы TON 18',
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <PublicHeader showNav={true} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Помощь и поддержка
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Найдем ответы на ваши вопросы и поможем максимально эффективно использовать платформу TON 18
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Поиск по документации</CardTitle>
              <CardDescription>
                Найдите ответы на часто задаваемые вопросы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/docs">
                <Button variant="outline" className="w-full">
                  Открыть документацию
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Руководства</CardTitle>
              <CardDescription>
                Пошаговые инструкции по работе с платформой
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/docs">
                <Button variant="outline" className="w-full">
                  Читать руководства
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Связаться с нами</CardTitle>
              <CardDescription>
                Напишите нам, и мы поможем решить ваш вопрос
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="mailto:support@ton18.com">
                <Button variant="outline" className="w-full">
                  Написать в поддержку
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">FAQ</CardTitle>
              <CardDescription>
                Часто задаваемые вопросы и ответы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="#faq">
                <Button variant="outline" className="w-full">
                  Открыть FAQ
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <section id="faq" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
            Часто задаваемые вопросы
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Как начать работу с платформой?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Зарегистрируйтесь на платформе, создайте своего первого AI-агента и начните автоматизировать работу с клиентами. 
                  Подробные инструкции доступны в разделе документации.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Какие модели ИИ доступны?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Платформа поддерживает более 100 моделей LLM через OpenRouter API, включая GPT-4o, Claude, Gemini и другие. 
                  Все модели включены в подписку без необходимости настройки API ключей.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Как интегрировать CRM систему?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Подключите Kommo CRM или другую систему через настройки агента. Платформа автоматически синхронизирует данные 
                  и позволит агентам работать с воронками продаж и сделками.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Можно ли изменить тарифный план?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Да, вы можете изменить тарифный план в любое время в разделе управления подпиской. 
                  Изменения вступают в силу немедленно.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Как работает база знаний?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Загружайте файлы, создавайте статьи и категории. Платформа автоматически индексирует контент и использует 
                  векторный поиск для точных ответов агентов.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Есть ли ограничения по использованию?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Ограничения зависят от выбранного тарифного плана. Подробную информацию о лимитах можно найти 
                  на странице тарифов или в документации.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 md:p-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Нужна дополнительная помощь?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Свяжитесь с нашей командой поддержки, и мы поможем решить любой вопрос
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="mailto:support@ton18.com">
                <Button size="lg" className="w-full sm:w-auto">
                  <Mail className="mr-2 h-4 w-4" />
                  Написать в поддержку
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Открыть документацию
                </Button>
              </Link>
            </div>
          </div>
        </section>
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

