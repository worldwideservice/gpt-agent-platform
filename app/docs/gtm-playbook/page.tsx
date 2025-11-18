// Force dynamic rendering to avoid prerender errors
export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'

export const metadata: Metadata = {
  title: 'GTM Playbook — TON 18',
  description: 'Тарифы, онбординг, email-цепочки и SLA для вывода продукта на рынок',
}

const plans = [
  { name: 'Starter', price: '$99', audience: 'SMB, первые 1-2 агента', limits: '1 workspace · 2 агента · 2 000 диалогов', value: 'Шаблоны, email-алерты' },
  { name: 'Growth', price: '$299', audience: 'Digital-агентства, отделы продаж', limits: '3 workspaces · 5 агентов · 10 000 диалогов', value: 'CS-менеджер, Kommo, PostHog' },
  { name: 'Enterprise', price: 'Custom', audience: 'Крупные сети, финтех', limits: 'Неограниченно', value: 'SSO/SAML, кастомные SLA' },
]

const emails = [
  { name: 'Welcome', trigger: '`signup_completed`', channel: 'Customer.io', content: 'Приветствие, чеклист, воркшоп' },
  { name: 'Activation', trigger: 'Нет `agent_published` 24ч', channel: 'Customer.io + Telegram', content: 'Напоминание, видео-демо' },
  { name: 'Usage', trigger: '50% лимита / 1000 диалогов', channel: 'Customer.io', content: 'Рекомендации, апселл add-ons' },
  { name: 'Release Notes', trigger: 'Weekly релиз', channel: 'HubSpot / Mailchimp', content: 'Изменения, roadmap' },
  { name: 'Renewal', trigger: '7 дней до окончания', channel: 'Customer.io', content: 'Usage summary, CTA продление' },
]

export default function GtmPlaybookPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <PublicHeader showNav={true} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
        <section className="max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            Обновлено 18 февраля 2025
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">GTM Playbook</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Краткая выдержка из <code>docs/GTM_PLAYBOOK.md</code>: тарифы, шаги онбординга, email-цепочки, релиз-ноты и SLA. Этот материал
            помогает маркетингу и CS синхронизироваться перед запуском кампаний и масштабированием продаж.
          </p>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Тарифные пакеты</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Тариф</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Аудитория</TableHead>
                    <TableHead>Лимиты</TableHead>
                    <TableHead>Преимущества</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.name}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{plan.price}</TableCell>
                      <TableCell>{plan.audience}</TableCell>
                      <TableCell>{plan.limits}</TableCell>
                      <TableCell>{plan.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Онбординг</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>T0 — письмо «Добро пожаловать» с CTA в чеклист.</p>
              <p>T0+1ч — CS связывается и присылает шаблон базы знаний.</p>
              <p>Чеклист: CRM, загрузка знаний, первый агент, подписка на релиз-ноты.</p>
              <p>T0+24ч — письмо с best practices; T0+72ч — NPS + созвон.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>SLA и поддержка</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>P0: ответ 15 мин / решение 4 часа (24/7).</p>
              <p>P1: ответ 1 час / решение 8 часов.</p>
              <p>SLA аптайма 99.5%, компенсация 10% за каждые 30 минут простоя.</p>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Email-цепочки</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Цель</TableHead>
                    <TableHead>Триггер</TableHead>
                    <TableHead>Канал</TableHead>
                    <TableHead>Контент</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emails.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.trigger}</TableCell>
                      <TableCell>{item.channel}</TableCell>
                      <TableCell>{item.content}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Полный документ</h2>
            <p className="text-gray-600 dark:text-gray-400">
              В полном playbook — add-ons, процессы релиз-нотов и ответственные. Используйте версию в репозитории для синхронизации с маркетингом.
            </p>
          </div>
          <Button asChild>
            <Link href="https://github.com/world-wide-services/gpt-agent-platform/blob/main/docs/GTM_PLAYBOOK.md">
              Открыть исходник на GitHub
            </Link>
          </Button>
        </section>
      </main>
    </div>
  )
}
