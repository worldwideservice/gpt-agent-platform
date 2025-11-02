import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Документация и лучшие практики GPT Agent",
  description:
    "Структурированная документация по базе знаний, API, модерации диалогов и организации процессов обслуживания.",
};

const DocSection = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="space-y-4">
    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
    {children}
  </section>
);

const DocumentationArticle = () => {
  return (
    <div className="mx-auto max-w-3xl space-y-12 py-16">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-primary-600 dark:text-primary-400">
          Документация
        </p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Лучшие практики и внутренняя документация GPT Agent
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Этот раздел помогает администраторам и разработчикам поддерживать стабильную работу агента,
          расширять сценарии и контролировать качество ответов.
        </p>
        <Link
          href="/support"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          ← К списку материалов
        </Link>
      </div>

      <DocSection id="knowledge-structure" title="1. Архитектура базы знаний">
        <p className="text-base text-slate-600 dark:text-slate-300">
          База знаний — основной источник фактов для агента. Используйте каталоги и теги, чтобы
          отслеживать релевантность ответов.
        </p>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>
            Собирайте статьи по принципу «одна тема — один файл». Длинные статьи разбивайте на
            подразделы.
          </li>
          <li>
            Используйте короткое название (до 70 символов), понятные теги и обязательное поле «Дата
            обновления».
          </li>
          <li>
            Для сложных продуктов добавляйте раздел «Обязательные уточнения», чтобы агент задавал
            наводящие вопросы перед ответом.
          </li>
        </ul>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
          Проверьте{' '}
          <Link
            href="/support/articles/getting-started#next-steps"
            className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            чек-лист публикации
          </Link>{' '}
          перед включением агента — он помогает оценить полноту базы знаний.
        </div>
      </DocSection>

      <DocSection id="prompt-templates" title="2. Шаблоны инструкций и тон общения">
        <p className="text-base text-slate-600 dark:text-slate-300">
          Грамотные инструкции задают характер агента и помогают избегать нежелательных ответов.
          Используйте шаблон ниже и адаптируйте его под каждую команду.
        </p>
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200">
          <p className="font-semibold text-slate-800 dark:text-white">Структура инструкции:</p>
          <ol className="mt-2 space-y-2 list-decimal pl-5">
            <li>Кто вы и какую роль выполняете (2–3 предложения).</li>
            <li>Что необходимо уточнять у клиента перед ответом.</li>
            <li>Какую лексику использовать: допустимые и запрещённые фразы.</li>
            <li>Правила эскалации и передачи данных менеджеру.</li>
            <li>Примеры ожидаемых ответов (2–3 кейса).</li>
          </ol>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Дополнительно можно использовать модуль «Варианты приветствия» и настраиваемые подписи, если
          команда работает в нескольких часовых поясах.
        </p>
      </DocSection>

      <DocSection id="api" title="3. API и вебхуки">
        <p className="text-base text-slate-600 dark:text-slate-300">
          REST API позволяет управлять агентами, базой знаний и журналом диалогов. Вебхуки —
          инструмент для синхронизации с CRM и внутренними сервисами.
        </p>
        <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <li>
            Включите API в{' '}
            <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              Настройки → Интеграции &gt; API ключи
            </code>
            . Созданный ключ отображается один раз — сохраните его в секрет-хранилище.
          </li>
          <li>
            Используйте эндпоинт <code>/api/v1/agents/{'{agentId}'}/messages</code>, чтобы передавать
            логи в аналитическую систему или подставлять историю сообщений из вашего бота.
          </li>
          <li>
            Для вебхуков доступны события: `lead.created`, `conversation.escalated`, `message.sent`.
            Укажите URL и подпись запроса — подписка активируется сразу после сохранения.
          </li>
        </ol>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Swagger-описание доступно на странице{" "}
          <Link
            href="/api-docs"
            className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            /api-docs
          </Link>
          . Команда интеграций отвечает на вопросы по адресу{' '}
          <Link
            href="mailto:integrations@gptagent.com"
            className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            integrations@gptagent.com
          </Link>
          .
        </p>
      </DocSection>

      <DocSection id="quality" title="4. Контроль качества и модерация">
        <p className="text-base text-slate-600 dark:text-slate-300">
          Регулярная модерация гарантирует, что ответы агента соответствуют вашим стандартам сервиса.
          Используйте ежедневный журнал и отчётные панели.
        </p>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>
            Включите ежедневную рассылку «Digest диалогов» в разделе уведомлений. Руководитель получит
            топ запросов и сводку эскалаций.
          </li>
          <li>
            Создайте теги «Проблемный ответ», «Переадресовано человеку», чтобы быстро находить
            диалоги, требующие обновления базы знаний.
          </li>
          <li>
            Для критичных категорий добавьте правило «Agent approval required» — оператор подтвердит
            ответ перед отправкой клиенту.
          </li>
        </ul>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Подробнее об организационных практиках — в документе{' '}
          <Link
            href="/support/articles/billing-faq#team"
            className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            «Роли и ответственность команды»
          </Link>
          .
        </p>
      </DocSection>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Если необходима документация под ваш кейс</h2>
        <p>
          Напишите коротко о вашем проекте на{" "}
          <Link
            href="mailto:docs@gptagent.com"
            className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            docs@gptagent.com
          </Link>{" "}
          — подготовим шаблоны для базы знаний или инструкции по дополнительным интеграциям.
        </p>
      </section>
    </div>
  );
};

export default DocumentationArticle;
