"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Edit, FileText, Plus, Search, Trash2 } from "lucide-react";

import { KwidButton, KwidInput, KwidTable } from "@/components/kwid";
import { useTenantId } from "@/hooks/useTenantId";

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

  const fetchArticles = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.set("search", searchTerm);
      }

      const response = await fetch(
        `/api/knowledge-base/articles?${params.toString()}`,
      );
      if (response.ok) {
        const payload = (await response.json()) as ArticlesApiResponse;
        if (payload.success) {
          setArticles(payload.data);
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
  }, [searchTerm]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      startTransition(async () => {
        await fetchArticles();
      });
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchArticles, searchTerm]);

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Статьи базы знаний
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Управляйте статьями базы знаний
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative flex items-center gap-2 w-full sm:w-72">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <KwidInput
                type="search"
                placeholder="Поиск статей"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Поиск статей"
                className="pl-10"
              />
            </div>
          </div>
          <Link
            href={
              tenantId
                ? `/manage/${tenantId}/knowledge-items/new`
                : "/knowledge-base/articles/new"
            }
            className="w-full sm:w-auto"
          >
            <KwidButton
              variant="primary"
              size="md"
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Создать статью
            </KwidButton>
          </Link>
        </div>
      </div>

      {error && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="fi-ta-table overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
        {isPending ? (
          <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
            Загрузка...
          </div>
        ) : (
          <KwidTable
            data={articles}
            columns={[
              {
                key: "title",
                header: "Название",
                accessor: (article) => (
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {article.title}
                    </span>
                  </div>
                ),
              },
              {
                key: "category",
                header: "Категория",
                accessor: (article) => (
                  <span className="text-gray-500 dark:text-gray-400">
                    {getCategoryName(article.categoryId)}
                  </span>
                ),
              },
              {
                key: "createdAt",
                header: "Дата создания",
                accessor: (article) => (
                  <span className="text-gray-500 dark:text-gray-400">
                    {formatDate(article.createdAt)}
                  </span>
                ),
              },
              {
                key: "actions",
                header: "Действия",
                className: "text-right",
                accessor: (article) => (
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={
                        tenantId
                          ? `/manage/${tenantId}/knowledge-items/${article.id}`
                          : `/knowledge-base/articles/${article.id}`
                      }
                    >
                      <KwidButton variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </KwidButton>
                    </Link>
                    <KwidButton
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(article.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </KwidButton>
                  </div>
                ),
              },
            ]}
            emptyMessage="Нет статей. Создайте первую статью, чтобы начать работу."
          />
        )}
      </div>
    </div>
  );
};
