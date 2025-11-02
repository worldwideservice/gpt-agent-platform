import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Тарифы, лимиты и FAQ по биллингу GPT Agent",
  description:
    "Ответы на частые вопросы о тарифах, лимитах ответов, управлении лицензиями и командном доступе в GPT Agent.",
};

const Question = ({
  id,
  question,
  answer,
}: {
  id: string;
  question: string;
  answer: React.ReactNode;
}) => (
  <div id={id} className="space-y-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/40">
    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{question}</h2>
    <div className="text-sm text-slate-600 dark:text-slate-300">{answer}</div>
  </div>
);

const BillingFaqArticle = () => {
  return (
    <div className="mx-auto max-w-3xl space-y-10 py-16">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-primary-600 dark:text-primary-400">
          FAQ
        </p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Частые вопросы о тарифах и лимитах GPT Agent
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Ниже собрали ключевые вопросы клиентов, которые переходят на платную подписку или масштабируют
          использование агента.
        </p>
        <Link
          href="/support"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          ← К списку материалов
        </Link>
      </div>

      <Question
        id="plans"
        question="Как выбрать тариф и перейти с бесплатного плана?"
        answer={
          <div className="space-y-2">
            <p>
              Бесплатный план доступен без ограничений по времени и включает 1 активного агента и до 1 000
              ответов в месяц. Как только вам понадобится больше каналов или расширенные модели, перейдите на
              тариф «Launch» или «Scale».
            </p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Откройте «Настройки → Тарифы» в защищённой панели.</li>
              <li>Выберите план и укажите период оплаты — ежемесячно или ежегодно.</li>
              <li>Подтвердите заказ. Счёт и чек будут отправлены на email администратора и в раздел «Документы».</li>
            </ol>
            <p>
              Если у вас юридическое лицо вне РФ/ЕС и требуется отдельный договор, напишите на{" "}
              <Link
                href="mailto:billing@gptagent.com"
                className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                billing@gptagent.com
              </Link>
              .
            </p>
          </div>
        }
      />

      <Question
        id="limits"
        question="Что происходит при достижении лимита ответов ИИ?"
        answer={
          <div className="space-y-2">
            <p>
              За 10% до порога мы отправим уведомление в интерфейсе и на email. Вы можете мгновенно увеличить
              квоту из раздела тарифов — новый лимит применяется сразу, оплата идёт пропорционально остаткам месяца.
            </p>
            <p>Если лимит достигнут, агент переключается в режим «Только FAQ» и отвечает на вопросы из базы знаний без генерации новых ответов.</p>
            <p>Дополнительные пакеты (1 000, 5 000 и 10 000 ответов) можно докупить отдельно без смены плана.</p>
          </div>
        }
      />

      <Question
        id="team"
        question="Как работать с командой: лицензии, роли и безопасность?"
        answer={
          <div className="space-y-2">
            <ul className="space-y-1">
              <li>
                В тарифе Launch включено 5 лицензий, в Scale — 25, в Max — без ограничений. Дополнительные
                пользователи доступны за фиксированную плату.
              </li>
              <li>Используйте роли «Администратор», «Редактор», «Оператор», «Наблюдатель» для разграничения прав доступа.</li>
              <li>Включите двухфакторную аутентификацию — её можно сделать обязательной для всей организации.</li>
              <li>
                История действий (кто изменил инструкцию или опубликовал статью) хранится 180 дней и доступна в разделе
                аудита.
              </li>
            </ul>
          </div>
        }
      />

      <Question
        id="invoices"
        question="Где взять закрывающие документы и как сменить реквизиты?"
        answer={
          <div className="space-y-2">
            <p>
              Все счета и акты доступны в разделе «Документы» и отправляются на email администратора. Чтобы обновить
              реквизиты, заполните форму в настройках организации или напишите на{" "}
              <Link
                href="mailto:accounting@gptagent.com"
                className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                accounting@gptagent.com
              </Link>
              .
            </p>
            <p>
              Для автоматической выгрузки в ERP используйте webhook `invoice.created` — описание есть в{" "}
              <Link
                href="/support/articles/documentation#api"
                className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                документации по API
              </Link>
              .
            </p>
          </div>
        }
      />

      <Question
        id="grants"
        question="Есть ли скидки и грантовые программы?"
        answer={
          <div className="space-y-2">
            <p>
              Стартапы, работающие менее 18 месяцев, получают 25% скидки на тариф Scale в течение первого года. Для
              образовательных и некоммерческих организаций доступен специальный план с безлимитными ответами.
            </p>
            <p>
              Оставьте заявку на{" "}
              <Link
                href="https://cal.com/gpt-agent/funding"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                консультацию по грантовой программе
              </Link>
              — менеджер подготовит предложение.
            </p>
          </div>
        }
      />

      <div className="rounded-xl border border-primary-100 bg-primary-50/80 p-6 text-sm text-primary-700 dark:border-primary-900/60 dark:bg-primary-900/20 dark:text-primary-200">
        Не нашли ответ? Напишите на{" "}
        <Link
          href="mailto:sales@gptagent.com"
          className="font-medium underline-offset-2 hover:underline"
        >
          sales@gptagent.com
        </Link>{" "}
        или создайте тикет из интерфейса — мы ответим в течение одного рабочего дня.
      </div>
    </div>
  );
};

export default BillingFaqArticle;
