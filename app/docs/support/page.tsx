// Force dynamic rendering to avoid prerender errors
export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'

export const metadata: Metadata = {
  title: 'Руководство поддержки — TON 18',
  description: 'Регламент поддержки и Customer Success для платформы TON 18',
}

const channels = [
  { channel: 'Email', purpose: 'Базовые запросы, биллинг', sla: '4 часа (рабочие дни)', tool: 'Zendesk' },
  { channel: 'Telegram / Slack', purpose: 'Инциденты P0–P1, Enterprise', sla: '15 минут (24/7)', tool: 'Shared channel' },
  { channel: 'Встроенный чат', purpose: 'Быстрые вопросы в кабинете', sla: '2 часа', tool: 'Intercom (план)' },
  { channel: 'CS 1:1', purpose: 'Онбординг, стратегические сессии', sla: 'По договорённости', tool: 'Google Meet / Notion' },
]

const lifecycle = [
  { stage: 'Онбординг (0-14 дней)', artifacts: 'Onboarding checklist, welcome emails', owner: 'CS менеджер', metric: '% онбординга, TTF Agent' },
  { stage: 'Активация (15-30 дней)', artifacts: 'Success plan, QBR шаблон', owner: 'CS менеджер', metric: 'Активные агенты, usage intensity' },
  { stage: 'Развитие (>30 дней)', artifacts: 'Success review, апселл-план', owner: 'Head of CS', metric: 'Expansion MRR, NPS' },
]

export default function SupportDocsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <PublicHeader showNav={true} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
        <section className="max-w-3xl">
          <Badge variant="secondary" className="mb-4">
            Обновлено 18 февраля 2025
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Руководство поддержки</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Этот документ суммирует процессы из <code>docs/support.md</code>: каналы коммуникации, SLA, плейбуки и артефакты Customer
            Success. Используйте его как быстрый справочник перед запуском пилота и для обучения новых сотрудников поддержки.
          </p>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Каналы и SLA</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Канал</TableHead>
                    <TableHead>Назначение</TableHead>
                    <TableHead>Время ответа</TableHead>
                    <TableHead>Инструмент</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {channels.map((item) => (
                    <TableRow key={item.channel}>
                      <TableCell className="font-medium">{item.channel}</TableCell>
                      <TableCell>{item.purpose}</TableCell>
                      <TableCell>{item.sla}</TableCell>
                      <TableCell>{item.tool}</TableCell>
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
              <CardTitle>Плейбук инцидентов</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>1. Проверить статус OpenRouter, PostHog, Supabase.</p>
              <p>2. Переключить агента на резервную модель из списка approved.</p>
              <p>3. Уведомить клиента и зафиксировать RCA в Notion.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Интеграции и биллинг</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>Kommo: проверить токены, перезапустить job <code>crm:sync:pipelines</code>, при повторении — эскалировать.</p>
              <p>Биллинг: сверить статус оплаты в Stripe, предложить add-on или апгрейд.</p>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Customer Success</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Этап</TableHead>
                    <TableHead>Артефакты</TableHead>
                    <TableHead>Ответственный</TableHead>
                    <TableHead>Метрики</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lifecycle.map((item) => (
                    <TableRow key={item.stage}>
                      <TableCell className="font-medium">{item.stage}</TableCell>
                      <TableCell>{item.artifacts}</TableCell>
                      <TableCell>{item.owner}</TableCell>
                      <TableCell>{item.metric}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Полный регламент</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Подробности, шаблоны коммуникаций и roadmap улучшений доступны в Markdown-версии документа в репозитории.
            </p>
          </div>
          <Button asChild>
            <Link href="https://github.com/world-wide-services/gpt-agent-platform/blob/main/docs/support.md">
              Открыть исходник на GitHub
            </Link>
          </Button>
        </section>
      </main>
    </div>
  )
}
