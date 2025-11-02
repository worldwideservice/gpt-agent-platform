import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Создание аккаунта и запуск GPT Agent",
  description:
    "Шаги по развёртыванию GPT Agent: регистрация, настройка организации, первый агент и подключение Kommo CRM.",
};

const Section = ({
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

const GettingStartedArticle = () => {
  return (
    <div className="mx-auto max-w-3xl space-y-12 py-16">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-primary-600 dark:text-primary-400">
          Руководство
        </p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Создание аккаунта и запуск GPT Agent
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Следуйте шаг за шагом: настроим организацию, подготовим первое окружение и подключим CRM,
          чтобы ваш агент мог общаться с клиентами сразу после публикации.
        </p>
        <Link
          href="/support"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          ← К списку материалов
        </Link>
      </div>

      <Section id="account-setup" title="1. Регистрация аккаунта и подготовка организации">
        <ol className="space-y-3 text-base text-slate-600 dark:text-slate-300">
          <li>
            Перейдите на страницу{" "}
            <Link href="/register" className="font-medium text-primary-600 hover:text-primary-700">
              регистрации
            </Link>{" "}
            и заполните поля. Указанный email станет логином администратора.
          </li>
          <li>
            После входа система создаст рабочую организацию. Убедитесь, что название отражает бренд
            или юридическое лицо — оно попадёт в приветствие агента по умолчанию.
          </li>
          <li>Задайте цветовую схему и лого в разделе «Настройки аккаунта» — это отображается в тестовом чате и виджете сайта.</li>
          <li>
            Пригласите коллег. В разделе «Команда» добавьте email и назначьте роль: «Редактор»
            (работает с базой знаний), «Оператор» (следит за диалогами) или «Администратор».
          </li>
        </ol>
        <div className="rounded-lg border border-primary-100 bg-primary-50/60 p-4 text-sm text-primary-700 dark:border-primary-900/50 dark:bg-primary-900/20 dark:text-primary-200">
          Совет: на этапе пилота ограничьтесь одной организацией. Этого достаточно, чтобы запустить
          3–4 агентов и протестировать интеграции.
        </div>
      </Section>

      <Section id="first-agent" title="2. Настройка первого AI-агента">
        <ol className="space-y-3 text-base text-slate-600 dark:text-slate-300">
          <li>Откройте раздел «Агенты ИИ → Создать» и задайте рабочее название — например, «Онбординг клиентов».</li>
          <li>
            Заполните блок «Инструкции». Расскажите агенту, что он должен знать о вашей компании,
            прописав стиль общения, ограничения и три ключевые задачи.
          </li>
          <li>
            Добавьте приветствие и fallback-сообщение. Если агент не нашёл ответ, он сообщит об этом
            и передаст контакт менеджеру.
          </li>
          <li>
            Включите каналы: виджет сайта, Telegram, WhatsApp или почту. Каналы можно активировать
            по мере готовности — агент сохраняет статус «Черновик» до публикации.
          </li>
        </ol>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Больше примеров инструкций смотрите в разделе{" "}
          <Link
            href="/support/articles/documentation#prompt-templates"
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            «Шаблоны инструкций»
          </Link>
          .
        </p>
      </Section>

      <Section id="connect-kommo" title="3. Подключение Kommo CRM и синхронизация воронок">
        <ol className="space-y-3 text-base text-slate-600 dark:text-slate-300">
          <li>Перейдите в раздел «Интеграции → Kommo CRM» и нажмите «Подключить». В открывшемся окне авторизуйтесь через Kommo и подтвердите доступ.</li>
          <li>
            После подключения выберите воронки, с которыми должен работать агент. Можно синхронизировать
            как продажи, так и поддержку клиентов.
          </li>
          <li>
            Настройте поля сделок и контактов для обновления — агент сможет фиксировать email,
            бюджет, выбранный продукт и т. д.
          </li>
          <li>
            Включите триггеры: автоматическое создание задачи при неотвеченном вопросе или перевод
            сделки на следующий этап после подтверждения клиента.
          </li>
        </ol>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Подробно про интеграции — в статье{' '}
          <Link
            href="/support/articles/documentation#api"
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            «Интеграции и вебхуки»
          </Link>
          .
        </p>
      </Section>

      <Section id="next-steps" title="4. Проверка готовности и публикация">
        <ul className="space-y-2 text-base text-slate-600 dark:text-slate-300">
          <li>Запустите тестовый чат: отправьте несколько запросов и оцените ответы агента.</li>
          <li>
            Проверьте раздел «База знаний» — добавьте статьи, если агент не смог ответить на популярный
            вопрос.
          </li>
          <li>
            Включите уведомления для команды: выберите почту или канал в Slack/Telegram, чтобы получать
            отчёты о диалогах.
          </li>
          <li>
            Опубликуйте агента — переключите статус из «Черновик» в «Активен» и убедитесь, что нужные
            каналы включены.
          </li>
        </ul>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
          Если нужен аудит перед запуском, забронируйте консультацию в{" "}
          <Link
            href="https://cal.com/gpt-agent/implementation"
            className="font-medium text-primary-600 hover:text-primary-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            календаре команды внедрения
          </Link>
          .
        </div>
      </Section>
    </div>
  );
};

export default GettingStartedArticle;
