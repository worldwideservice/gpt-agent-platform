"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Edit, FileText, Plus, Search, Trash2, Filter, Settings, X } from "lucide-react";

import { KwidButton } from "@/components/kwid";
import { useTenantId } from "@/hooks/useTenantId";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import type { KnowledgeBaseArticle } from "@/types";

interface ArticlesClientProps {
  initialArticles: KnowledgeBaseArticle[];
  categories: Array<{ id: string; name: string }>;
}

interface ArticlesApiResponse {
  success: boolean;
  data: KnowledgeBaseArticle[];
  error?: string;
}

const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
};

export const ArticlesClient = ({
  initialArticles,
  categories,
}: ArticlesClientProps) => {
  const tenantId = useTenantId();
  const [articles, setArticles] =
    useState<KnowledgeBaseArticle[]>(initialArticles);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [activeFilters, setActiveFilters] = useState<Array<{ key: string; label: string; value: string }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.set("search", searchTerm);
      }
      if (selectedCategory) {
        params.set("categoryId", selectedCategory);
      }

      const response = await fetch(
        `/api/knowledge-base/articles?${params.toString()}`,
      );
      if (response.ok) {
        const payload = (await response.json()) as ArticlesApiResponse;
        if (payload.success) {
          setArticles(payload.data);
          // Обновляем активные фильтры
          const filters: Array<{ key: string; label: string; value: string }> = [];
          if (selectedCategory) {
            const categoryName = categories.find(c => c.id === selectedCategory)?.name || 'Неизвестная категория';
            filters.push({ key: 'category', label: 'Категория', value: categoryName });
          }
          setActiveFilters(filters);
        } else {
          setError(payload.error || "Ошибка загрузки статей");
        }
      } else {
        setError("Не удалось загрузить статьи");
      }
    } catch (err) {
      console.error("Failed to fetch articles", err);
      setError("Не удалось загрузить статьи");
    }
  }, [searchTerm, selectedCategory, categories]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      startTransition(async () => {
        await fetchArticles();
      });
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm, selectedCategory]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Вы уверены, что хотите удалить эту статью?")) {
        return;
      }

      startTransition(async () => {
        try {
          const response = await fetch(`/api/knowledge-base/articles/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Не удалось удалить статью");
          }

          await fetchArticles();
        } catch (err) {
          console.error("Failed to delete article", err);
          setError("Не удалось удалить статью");
        }
      });
    },
    [fetchArticles],
  );

  const getCategoryName = (categoryId: string | null): string => {
    if (!categoryId) return "Без категории";
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || "Неизвестная категория";
  };

  const removeFilter = (key: string) => {
    if (key === 'category') {
      setSelectedCategory(null);
    }
  };

  return (
    <section className="flex flex-col gap-y-8 py-8">
      <header className="fi-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <nav className="mb-4 flex items-center gap-2" aria-label="Хлебные крошки">
            <Link
              href={tenantId ? `/manage/${tenantId}/knowledge-items` : "/knowledge-base/articles"}
              className="fi-breadcrumbs-item-label text-sm font-medium text-gray-500 transition duration-75 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Статьи
            </Link>
            <span className="fi-breadcrumbs-item-label text-sm font-medium text-gray-500 dark:text-gray-400">
              Список
            </span>
          </nav>
          <h1 className="fi-header-heading text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            Статьи
          </h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href={
              tenantId
                ? `/manage/${tenantId}/knowledge-items/create`
                : "/knowledge-base/articles/new"
            }
            className="w-full sm:w-auto"
            style={{
              '--c-400': 'var(--primary-400)',
              '--c-500': 'var(--primary-500)',
              '--c-600': 'var(--primary-600)',
            } as React.CSSProperties}
          >
            <KwidButton
              variant="primary"
              size="md"
              className="w-full sm:w-auto fi-color-custom"
            >
              <span className="fi-btn-label">Создать</span>
            </KwidButton>
          </Link>
        </div>
      </header>

      {error && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
        <div className="fi-ta-header-toolbar flex items-center justify-between gap-x-4 px-4 py-3 sm:px-6">
          <div className="relative flex-1 max-w-md">
            <div className="fi-input-wrp-prefix items-center gap-x-3 ps-3 flex pe-2 absolute left-0 top-0 bottom-0 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="search"
              className="fi-input block w-full border-none py-1.5 text-base text-gray-950 transition duration-75 placeholder:text-gray-400 focus:ring-0 disabled:text-gray-500 pl-10 pr-4"
              placeholder="Поиск"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              maxLength={1000}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="fi-icon-btn relative flex items-center justify-center rounded-lg outline-none transition duration-75 focus-visible:ring-2 -m-2 h-9 w-9 text-gray-400 hover:text-gray-500 focus-visible:ring-primary-600 focus-visible:ring-offset-2 dark:text-gray-500 dark:hover:text-gray-400"
              title="Фильтр"
              style={{
                '--c-300': 'var(--gray-300)',
                '--c-400': 'var(--gray-400)',
                '--c-500': 'var(--gray-500)',
                '--c-600': 'var(--gray-600)',
              } as React.CSSProperties}
            >
              <Filter className="h-5 w-5" />
              <span className="sr-only">Фильтр</span>
              {activeFilters.length > 0 && (
                <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {activeFilters.length}
                </span>
              )}
            </button>
            <button
              type="button"
              className="fi-link group/link relative inline-flex items-center justify-center outline-none fi-size-sm fi-link-size-sm gap-1 fi-color-custom fi-color-primary fi-ac-action fi-ac-link-action"
              title="Переключить столбцы"
              aria-label="Переключить столбцы"
              style={{
                '--c-400': 'var(--primary-400)',
                '--c-600': 'var(--primary-600)',
              } as React.CSSProperties}
            >
              <span className="font-semibold text-sm text-custom-600 dark:text-custom-400 group-hover/link:underline group-focus-visible/link:underline">
                Переключить столбцы
              </span>
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="fi-ta-filter-indicators flex items-start justify-between gap-x-3 bg-gray-50 px-3 py-1.5 dark:bg-white/5 sm:px-6">
            <span className="whitespace-nowrap text-sm font-medium leading-6 text-gray-700 dark:text-gray-200">
              Активные фильтры
            </span>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <span
                  key={filter.key}
                  className="fi-badge flex items-center justify-center gap-x-1 rounded-md text-xs font-medium ring-1 ring-inset px-2 min-w-[theme(spacing.6)] py-1 fi-color-custom bg-custom-50 text-custom-600 ring-custom-600/10 dark:bg-custom-400/10 dark:text-custom-400 dark:ring-custom-400/30"
                  style={{
                    '--c-50': 'var(--primary-50)',
                    '--c-400': 'var(--primary-400)',
                    '--c-600': 'var(--primary-600)',
                  } as React.CSSProperties}
                >
                  {filter.label}: {filter.value}
                  <button
                    type="button"
                    onClick={() => removeFilter(filter.key)}
                    className="ml-1 -mr-1.5 -my-0.5 rounded-md p-0.5 hover:bg-custom-600/20 dark:hover:bg-custom-400/20"
                    aria-label="Удалить фильтр"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {isPending ? (
          <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
            Загрузка...
          </div>
        ) : articles.length === 0 ? (
          <div className="fi-ta-empty-state px-6 py-12">
            <div className="fi-ta-empty-state-icon-ctn mb-4 rounded-full bg-gray-100 p-3 dark:bg-gray-500/20">
              <FileText className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <h4 className="fi-ta-empty-state-heading text-base font-semibold leading-6 text-gray-950 dark:text-white">
              Не найдено Статьи
            </h4>
            {!searchTerm && activeFilters.length === 0 && (
              <div className="mt-4">
                <Link
                  href={
                    tenantId
                      ? `/manage/${tenantId}/knowledge-items/create`
                      : "/knowledge-base/articles/new"
                  }
                  style={{
                    '--c-400': 'var(--primary-400)',
                    '--c-500': 'var(--primary-500)',
                    '--c-600': 'var(--primary-600)',
                  } as React.CSSProperties}
                >
                  <KwidButton
                    variant="primary"
                    size="md"
                    className="fi-color-custom"
                  >
                    <span className="fi-btn-label">Создать</span>
                  </KwidButton>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableHead className="fi-ta-header-cell px-3 py-3.5 sm:first-of-type:ps-6 sm:last-of-type:pe-6">
                  Название
                </TableHead>
                <TableHead className="fi-ta-header-cell px-3 py-3.5 sm:first-of-type:ps-6 sm:last-of-type:pe-6">
                  Категория
                </TableHead>
                <TableHead className="fi-ta-header-cell px-3 py-3.5 sm:first-of-type:ps-6 sm:last-of-type:pe-6">
                  Дата обновления
                </TableHead>
                <TableHead
                  aria-label="Actions"
                  className="fi-ta-actions-header-cell w-1"
                ></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow
                  key={article.id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <TableCell className="px-3 py-4">
                    <div className="fi-ta-text grid w-full gap-y-1">
                      <span className="fi-ta-text-item-label text-sm leading-6 text-gray-950 dark:text-white">
                        {article.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-4">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {getCategoryName(article.categoryId)}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-4">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(article.updatedAt)}
                    </span>
                  </TableCell>
                  <TableCell className="fi-ta-cell p-0 first-of-type:ps-1 last-of-type:pe-1 sm:first-of-type:ps-3 sm:last-of-type:pe-3 fi-ta-actions-cell">
                    <div className="whitespace-nowrap px-3 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={
                            tenantId
                              ? `/manage/${tenantId}/knowledge-items/${article.id}/edit`
                              : `/knowledge-base/articles/${article.id}/edit`
                          }
                          className="fi-icon-btn relative flex items-center justify-center rounded-lg outline-none transition duration-75 focus-visible:ring-2 -m-1.5 h-8 w-8 fi-color-custom text-custom-500 hover:text-custom-600 focus-visible:ring-custom-600 focus-visible:ring-offset-2"
                          title="Редактировать"
                          style={{
                            '--c-300': 'var(--primary-300)',
                            '--c-400': 'var(--primary-400)',
                            '--c-500': 'var(--primary-500)',
                            '--c-600': 'var(--primary-600)',
                          } as React.CSSProperties}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Редактировать</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(article.id)}
                          className="fi-icon-btn relative flex items-center justify-center rounded-lg outline-none transition duration-75 focus-visible:ring-2 -m-1.5 h-8 w-8 fi-color-custom text-custom-500 hover:text-custom-600 focus-visible:ring-custom-600 focus-visible:ring-offset-2"
                          title="Удалить"
                          style={{
                            '--c-300': 'var(--danger-300)',
                            '--c-400': 'var(--danger-400)',
                            '--c-500': 'var(--danger-500)',
                            '--c-600': 'var(--danger-600)',
                          } as React.CSSProperties}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Удалить</span>
                        </button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
};
