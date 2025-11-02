"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Edit, Filter, FolderOpen, Plus, Trash2 } from "lucide-react";

import { KwidButton } from "@/components/kwid";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import type { KnowledgeBaseCategory } from "@/types";

interface CategoriesClientProps {
  initialCategories: KnowledgeBaseCategory[];
}

interface CategoriesApiResponse {
  success: boolean;
  data: KnowledgeBaseCategory[];
  error?: string;
}

export const CategoriesClient = ({
  initialCategories,
}: CategoriesClientProps) => {
  const [categories, setCategories] =
    useState<KnowledgeBaseCategory[]>(initialCategories);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchCategories = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/knowledge-base/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as CategoriesApiResponse;

      if (!payload.success) {
        throw new Error(
          payload.error ?? "Неизвестная ошибка загрузки категорий",
        );
      }

      setCategories(payload.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Неизвестная ошибка";
      console.error("Failed to fetch categories", err);
      setError("Не удалось загрузить категории. Попробуйте обновить страницу.");
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (
        !confirm(
          "Вы уверены, что хотите удалить эту категорию? Это действие нельзя отменить.",
        )
      ) {
        return;
      }

      try {
        const response = await fetch(`/api/knowledge-base/categories/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Не удалось удалить категорию");
        }

        const payload = (await response.json()) as { success: boolean };

        if (!payload.success) {
          throw new Error("Не удалось удалить категорию");
        }

        await fetchCategories();
      } catch (err) {
        console.error("Failed to delete category", err);
        setError("Не удалось удалить категорию");
      }
    },
    [fetchCategories],
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Категории
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Управляйте структурами базы знаний
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Категории / Список
        </div>
        <div className="flex items-center gap-3">
          <KwidButton variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" /> Фильтры
          </KwidButton>
          <Link href="/knowledge-base/categories/new">
            <KwidButton variant="primary" size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Создать
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

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead>Заголовок</TableHead>
              <TableHead>Подкатегории</TableHead>
              <TableHead>Статьи</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Загрузка категорий...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Категории не найдены. Создайте первую категорию, чтобы начать
                  работу.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow
                  key={category.id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FolderOpen className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <Link
                        href={`/knowledge-base/categories/${category.id}`}
                        className="font-medium text-custom-600 hover:text-custom-700 hover:underline dark:text-custom-400 dark:hover:text-custom-300"
                      >
                        {category.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                    0
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                    {category.articlesCount}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-3 text-sm font-medium">
                      <Link
                        href={`/knowledge-base/categories/${category.id}`}
                        className="text-custom-600 hover:text-custom-700 dark:text-custom-400 dark:hover:text-custom-300"
                      >
                        Открыть
                      </Link>
                      <Link
                        href={`/knowledge-base/categories/${category.id}/edit`}
                        className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        Редактировать
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Удалить
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
