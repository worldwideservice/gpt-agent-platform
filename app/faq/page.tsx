import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Button } from '@/components/ui'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { MessageCircleQuestion, LifeBuoy, Compass } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ — TON 18',
  description: 'Ответы на частые вопросы о платформе TON 18',
}

const faqItems = [
  {
    id: 'product-fit',
    question: 'Какие задачи решает TON 18?',
    answer:
      'Платформа автоматизирует обработку входящих обращений, квалификацию лидов и последующее сопровождение клиентов через AI-агентов, интегрированных с CRM и базой знаний.',
  },
  {
    id: 'pricing',
    question: 'Как устроены тарифы и что в них включено?',
    answer:
      'Тарифы рассчитываются по числу активных агентов, количеству обработанных диалогов и доступу к premium-моделям LLM. Все планы включают безлимитный доступ к библиотеке моделей OpenRouter и базовым интеграциям CRM.',
  },
  {
    id: 'onboarding',
    question: 'Как проходит онбординг новой команды?',
    answer:
      'После регистрации вы проходите интерактивный онбординг, который помогает собрать базу знаний, подключить CRM и запустить первого агента. Для тарифов Growth и Enterprise доступен персональный Customer Success менеджер.',
  },
  {
    id: 'security',
    question: 'Как обеспечивается безопасность данных?',
    answer:
      'Все соединения шифруются, файлы знаний хранятся в Supabase с Row Level Security, а доступ к AI-логам ограничивается уровнем организации. Для Enterprise доступно шифрование на уровне полей и собственные ключи OpenAI.',
  },
  {
    id: 'metrics',
    question: 'Какие метрики можно отслеживать в кабинете?',
    answer:
      'В кабинете доступна аналитика по объёму диалогов, конверсии лидов, скорости ответов и эффективности шаблонов. Для кастомных метрик можно отправлять события в Segment/PostHog и строить собственные дашборды.',
  },
  {
    id: 'support',
    question: 'Как работает поддержка и SLA?',
    answer:
      'Команда поддержки отвечает в течение 4 часов на тарифах Growth и 1 часа на Enterprise. SLA по аптайму 99.5%, релиз-ноты выходят еженедельно, а критические обновления сопровождаются email-оповещением.',
  },
]

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <PublicHeader showNav={true} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <section className="text-center mb-16">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MessageCircleQuestion className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">Часто задаваемые вопросы</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Систематизировали ключевые вопросы по тарифам, онбордингу, интеграциям и поддержке, чтобы вы быстро нашли ответ
            и перешли к запуску AI-агентов.
          </p>
        </section>

        <section className="grid gap-8 md:grid-cols-[2fr,1fr]">
          <Card className="md:order-1">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">FAQ</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {faqItems.map((item) => (
                  <AccordionItem key={item.id} value={item.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left text-base font-medium text-gray-900 dark:text-gray-100">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600 dark:text-gray-400">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="space-y-6 md:order-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <LifeBuoy className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg font-semibold">Нужна помощь?</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  Если не нашли ответ, загляните в обновлённые гайды поддержки или напишите в наш чат. Мы уже подготовили
                  шаблоны онбординга, релиз-ноты и процедуры SLA.
                </p>
                <div className="flex flex-col gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/support">Центр поддержки</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="mailto:support@ton18.com">Написать в поддержку</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Compass className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg font-semibold">Ресурсы для старта</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p>Пошаговые гайды помогут быстро включить AI-агентов в рабочий процесс.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <Link href="/docs" className="text-primary hover:underline">
                      Документация и руководства
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-primary hover:underline">
                      Сравнение тарифов
                    </Link>
                  </li>
                  <li>
                    <Link href="mailto:cs@ton18.com" className="text-primary hover:underline">
                      Связаться с Customer Success
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
