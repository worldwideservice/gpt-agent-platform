'use client'

import Link from 'next/link'
import { Book, FileText, HelpCircle, Video } from 'lucide-react'

import { Button } from '@/components/ui'

interface SupportContentProps {
 variant?: 'public' | 'internal'
}

type ArticleLink = {
 label: string
 href: string
}

const gettingStartedLinks: ArticleLink[] = [
 {
 label: 'Создание аккаунта и настройка рабочей организации',
 href: '/support/articles/getting-started#account-setup',
 },
 {
 label: 'Первый AI-агент: инструкции, каналы и приветствие',
 href: '/support/articles/getting-started#first-agent',
 },
 {
 label: 'Подключение Kommo CRM и синхронизация воронок',
 href: '/support/articles/getting-started#connect-kommo',
 },
]

const videoLibraryLinks: ArticleLink[] = [
 {
 label: 'Обзор интерфейса GPT Agent (8 минут)',
 href: '/support/articles/video-library#overview',
 },
 {
 label: 'Работа с базой знаний и обучением агента',
 href: '/support/articles/video-library#knowledge',
 },
 {
 label: 'Автоматизация и триггеры в CRM',
 href: '/support/articles/video-library#automation',
 },
]

const documentationLinks: ArticleLink[] = [
 {
 label: 'Структура базы знаний и FAQ по наполнению',
 href: '/support/articles/documentation#knowledge-structure',
 },
 {
 label: 'API и вебхуки: подключение новых каналов',
 href: '/support/articles/documentation#api',
 },
 {
 label: 'Контроль качества ответов и модерация',
 href: '/support/articles/documentation#quality',
 },
]

const faqLinks: ArticleLink[] = [
 {
 label: 'Тарифы, оплата и гранты для старта',
 href: '/support/articles/billing-faq#plans',
 },
 {
 label: 'Лимиты и квоты ответов ИИ',
 href: '/support/articles/billing-faq#limits',
 },
 {
 label: 'Управление пользователями и ролями',
 href: '/support/articles/billing-faq#team',
 },
]

const renderArticleLinks = (links: ArticleLink[]) => (
 <ul className="space-y-2 text-sm text-primary-600">
   {links.map((link) => (
     <li key={link.href}>
       <Link
         href={link.href}
         className="inline-flex items-center gap-2 transition-colors hover:text-primary-700"
       >
         <span className="text-xs font-semibold uppercase text-primary-500">→</span>
         <span>{link.label}</span>
       </Link>
     </li>
   ))}
 </ul>
)

export const SupportContent = ({ variant = 'internal' }: SupportContentProps) => {
 const isPublic = variant === 'public'

 return (
 <div className="space-y-6">
 <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">
          {isPublic ? 'Поддержка и обучение' : 'Центр поддержки'}
        </h1>
        <p className="text-gray-600">
          Практические руководства, видео и ответы на вопросы, которые помогут вашей команде уверенно
          работать с GPT Agent.
        </p>
 {isPublic && (
 <div className="mt-2 flex flex-wrap items-center gap-3">
 <Button asChild size="sm" variant="default">
 <Link href="/register">Создать аккаунт</Link>
 </Button>
 <Button asChild size="sm" variant="outline">
 <Link href="/login">Войти</Link>
 </Button>
 </div>
 )}
 </header>

 <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
   <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
     <div className="mb-4 flex items-center gap-3">
       <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50">
         <Book className="h-6 w-6 text-primary-600" />
       </div>
       <h3 className="text-lg font-semibold text-gray-900">Начало работы</h3>
     </div>
     <div>
       <p className="mb-4 text-sm text-gray-600">
         Чек-листы по запуску платформы: от регистрации до подключения CRM и настройки первых
         автоматизаций.
       </p>
       {renderArticleLinks(gettingStartedLinks)}
     </div>
   </div>

   <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
     <div className="mb-4 flex items-center gap-3">
       <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-50">
         <Video className="h-6 w-6 text-green-600" />
       </div>
       <h3 className="text-lg font-semibold text-gray-900">Видеоуроки</h3>
     </div>
     <div>
       <p className="mb-4 text-sm text-gray-600">
         Короткие записи с пояснениями и таймкодами, чтобы быстро вернуться к нужной теме.
       </p>
       {renderArticleLinks(videoLibraryLinks)}
     </div>
   </div>

   <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
     <div className="mb-4 flex items-center gap-3">
       <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50">
         <FileText className="h-6 w-6 text-purple-600" />
       </div>
       <h3 className="text-lg font-semibold text-gray-900">Документация</h3>
     </div>
     <div>
       <p className="mb-4 text-sm text-gray-600">
         Подробные инструкции по работе с базой знаний, API и контролем качества ответов агента.
       </p>
       {renderArticleLinks(documentationLinks)}
     </div>
   </div>

   <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
     <div className="mb-4 flex items-center gap-3">
       <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-orange-50">
         <HelpCircle className="h-6 w-6 text-orange-600" />
       </div>
       <h3 className="text-lg font-semibold text-gray-900">FAQ и биллинг</h3>
     </div>
     <div>
       <p className="mb-4 text-sm text-gray-600">
         Правила изменения тарифов, расширения лимитов и управление доступами внутри команды.
       </p>
       {renderArticleLinks(faqLinks)}
     </div>
   </div>
 </div>

 <div className="mt-8">
   <h2 className="mb-6 text-2xl font-semibold text-gray-900">Нужна помощь?</h2>
   <div className="grid gap-6 lg:grid-cols-3">
     <div className="rounded-lg bg-gray-50 p-4">
       <p className="mb-1 text-sm font-medium text-gray-900">Email поддержки</p>
       <p className="text-sm text-gray-600">
         <Link className="underline-offset-2 hover:underline" href="mailto:support@gptagent.com">
           support@gptagent.com
         </Link>
       </p>
       <p className="mt-3 text-xs text-gray-500">
         Ответим в течение рабочего дня и поможем с техническими вопросами.
       </p>
     </div>

     <div className="rounded-lg bg-gray-50 p-4">
       <p className="mb-1 text-sm font-medium text-gray-900">Технический чат</p>
       <p className="text-sm text-gray-600">
         <Link
           className="underline-offset-2 hover:underline"
           href="https://t.me/gptagent_support_bot"
           target="_blank"
           rel="noopener noreferrer"
         >
           Telegram @gptagent_support_bot
         </Link>
       </p>
       <p className="mt-3 text-xs text-gray-500">
         Уведомления о статусе задач, быстрый обмен логами и рекомендациями.
       </p>
     </div>

     <div className="rounded-lg bg-gray-50 p-4">
       <p className="mb-1 text-sm font-medium text-gray-900">Стратегическая сессия</p>
       <p className="text-sm text-gray-600">
         <Link
           className="underline-offset-2 hover:underline"
           href="https://cal.com/gpt-agent/implementation"
           target="_blank"
           rel="noopener noreferrer"
         >
           Забронировать встречу с менеджером
         </Link>
       </p>
       <p className="mt-3 text-xs text-gray-500">
         Обсудим roadmap внедрения, KPI и интеграции под вашу инфраструктуру.
       </p>
     </div>
   </div>
 </div>
 </div>
 )
}
