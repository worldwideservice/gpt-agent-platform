import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Видеоуроки по GPT Agent",
  description:
    "Подборка коротких видеоуроков: обзор интерфейса, обучение агента и автоматизация продаж.",
};

const VideoBlock = ({
  id,
  title,
  videoUrl,
  description,
}: {
  id: string;
  title: string;
  videoUrl: string;
  description: string;
}) => (
  <section id={id} className="space-y-3">
    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
    <div className="aspect-video overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-700">
      <iframe
        title={title}
        src={videoUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
    <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
  </section>
);

const VideoLibraryArticle = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-12 py-16">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-primary-600 dark:text-primary-400">
          Видеоуроки
        </p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Видеоэкскурсии по ключевым сценариям GPT Agent
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Все видео доступны без авторизации. Используйте таймкоды из описаний, чтобы быстро перейти к
          нужному разделу, или делитесь ссылкой с коллегами.
        </p>
        <Link
          href="/support"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          ← К списку материалов
        </Link>
      </div>

      <VideoBlock
        id="overview"
        title="Обзор интерфейса и навигация (8 минут)"
        videoUrl="https://player.vimeo.com/video/76979871?h=7d3675e01d"
        description="Быстрый тур по интерфейсу: структура сайдбара, поиск, работа с уведомлениями и персональная панель. В конце показан сценарий переключения между несколькими организациями."
      />

      <VideoBlock
        id="knowledge"
        title="Наполнение базы знаний и тренировка агента (12 минут)"
        videoUrl="https://player.vimeo.com/video/357274789?h=dae36468d5"
        description="Разбираем, как собирать материалы, подключать FAQ, обновлять статьи и отслеживать качество ответов. Показан процесс тестирования бота до публикации."
      />

      <VideoBlock
        id="automation"
        title="Автоматизация и обмен данными с CRM (9 минут)"
        videoUrl="https://player.vimeo.com/video/458730125?h=ab95dd9a98"
        description="Подключение Kommo, настройка полей контакта, триггеров и автоматических задач. Показаны примеры сценариев для поступающих лидов и возврата неотвеченных запросов."
      />

      <section id="resources" className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/40">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Дополнительные материалы</h2>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>
            <Link
              href="/support/articles/getting-started#first-agent"
              className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Шаги из руководства «Создание первого агента»
            </Link>{" "}
            — резюме урока и широкая инструкция.
          </li>
          <li>
            <Link
              href="/support/articles/documentation#api"
              className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Документация по API и вебхукам
            </Link>{" "}
            — чтобы расширить сценарии через собственные интеграции.
          </li>
          <li>
            <Link
              href="mailto:training@gptagent.com"
              className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              training@gptagent.com
            </Link>{" "}
            — запросить доступ к полной библиотеке и индивидуальные воркшопы.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default VideoLibraryArticle;
