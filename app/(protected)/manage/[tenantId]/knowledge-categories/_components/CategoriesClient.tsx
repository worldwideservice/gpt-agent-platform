"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Edit, Filter, FolderOpen, Plus, Trash2, ChevronRight, Settings } from "lucide-react";

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

import type { KnowledgeBaseCategory } from "@/types";

interface CategoriesClientProps {
  initialCategories: KnowledgeBaseCategory[];
}

interface CategoriesApiResponse {
  success: boolean;
  data: KnowledgeBaseCategory[];
  error?: string;
}

interface CategoryWithCounts extends KnowledgeBaseCategory {
  subcategoriesCount: number;
}

export const CategoriesClient = ({
  initialCategories,
}: CategoriesClientProps) => {
  const tenantId = useTenantId();
  const [categories, setCategories] =
    useState<CategoryWithCounts[]>(() => 
      initialCategories.map(cat => ({
        ...cat,
        subcategoriesCount: 0
      }))
    );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/knowledge-base/categories");
      if (response.ok) {
        const payload = (await response.json()) as CategoriesApiResponse;
        if (payload.success) {
          // Подсчитываем подкатегории для каждой категории
          const categoriesWithCounts = payload.data.map(cat => {
            const subcategoriesCount = payload.data.filter(
              subcat => subcat.parentId === cat.id
            ).length;
            return {
              ...cat,
              subcategoriesCount
            };
          });
          setCategories(categoriesWithCounts);
        } else {
          setError(payload.error || "Ошибка загрузки категорий");
        }
      } else {
        setError("Не удалось загрузить категории");
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setError("Не удалось загрузить категории");
    }
  }, []);

  // Получаем только корневые категории (без parentId)
  const rootCategories = categories.filter(cat => !cat.parentId);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Вы уверены, что хотите удалить эту категорию?")) {
        return;
      }

      startTransition(async () => {
        try {
          const response = await fetch(`/api/knowledge-base/categories/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Не удалось удалить категорию");
          }

          await fetchCategories();
        } catch (err) {
          console.error("Failed to delete category", err);
          setError("Не удалось удалить категорию");
        }
      });
    },
    [fetchCategories],
  );

  const handleSelectCategory = useCallback((id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedCategories.length === rootCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(rootCategories.map((cat) => cat.id));
    }
  }, [rootCategories, selectedCategories.length]);

  const allSelected = rootCategories.length > 0 && rootCategories.every(cat => selectedCategories.includes(cat.id));
  const someSelected = selectedCategories.length > 0 && !allSelected;

  return (
    <section className="flex flex-col gap-y-8 py-8">
      <header className="fi-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <nav className="mb-4 flex items-center gap-2" aria-label="Хлебные крошки">
            <Link
              href={tenantId ? `/manage/${tenantId}/knowledge-categories` : "/knowledge-base/categories"}
              className="fi-breadcrumbs-item-label text-sm font-medium text-gray-500 transition duration-75 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Категории
            </Link>
            <span className="fi-breadcrumbs-item-label text-sm font-medium text-gray-500 dark:text-gray-400">
              Список
            </span>
          </nav>
          <h1 className="fi-header-heading text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            Категории
          </h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href={
              tenantId
                ? `/manage/${tenantId}/knowledge-categories/new`
                : "/knowledge-base/categories/new"
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
            {selectedCategories.length > 0 && (
              <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {selectedCategories.length}
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

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="fi-ta-cell p-0 first-of-type:ps-1 last-of-type:pe-1 sm:first-of-type:ps-3 sm:last-of-type:pe-3 fi-ta-selection-cell w-1">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={handleSelectAll}
                  className="fi-checkbox-input rounded border-none bg-white shadow-sm ring-1 transition duration-75 checked:ring-0 focus:ring-2 focus:ring-offset-0 disabled:pointer-events-none disabled:bg-gray-50 disabled:text-gray-500"
                  aria-label="Выбрать/снять все элементы для массовых действий"
                />
              </TableHead>
              <TableHead className="fi-ta-header-cell px-3 py-3.5 sm:first-of-type:ps-6 sm:last-of-type:pe-6 fi-table-header-cell-title">
                <button
                  type="button"
                  className="group flex w-full items-center gap-x-1 whitespace-nowrap justify-start text-sm font-semibold text-gray-950 dark:text-white hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <span>Заголовок</span>
                </button>
              </TableHead>
              <TableHead className="fi-ta-header-cell px-3 py-3.5 sm:first-of-type:ps-6 sm:last-of-type:pe-6">
                <span className="group flex w-full items-center gap-x-1 whitespace-nowrap justify-start">
                  Подкатегории
                </span>
              </TableHead>
              <TableHead className="fi-ta-header-cell px-3 py-3.5 sm:first-of-type:ps-6 sm:last-of-type:pe-6">
                <span className="fi-ta-header-cell-label text-sm font-semibold text-gray-950 dark:text-white">
                  Статьи
                </span>
              </TableHead>
              <TableHead
                aria-label="Actions"
                className="fi-ta-actions-header-cell w-1"
              ></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Загрузка категорий...
                </TableCell>
              </TableRow>
            ) : rootCategories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Нет категорий. Создайте первую категорию, чтобы начать работу.
                </TableCell>
              </TableRow>
            ) : (
              rootCategories.map((category) => (
                <TableRow
                  key={category.id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <TableCell className="fi-ta-cell p-0 first-of-type:ps-1 last-of-type:pe-1 sm:first-of-type:ps-3 sm:last-of-type:pe-3 fi-ta-selection-cell w-1">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleSelectCategory(category.id)}
                      className="fi-checkbox-input rounded border-none bg-white shadow-sm ring-1 transition duration-75 checked:ring-0 focus:ring-2 focus:ring-offset-0 disabled:pointer-events-none disabled:bg-gray-50 disabled:text-gray-500"
                      aria-label={`Выбрать/отменить ${category.id} для массовых действий`}
                      value={category.id}
                    />
                  </TableCell>
                  <TableCell className="px-3 py-4">
                    <Link
                      href={
                        tenantId
                          ? `/manage/${tenantId}/knowledge-categories?tableFilters[category_filter][parent_id]=${category.id}`
                          : `/knowledge-base/categories?tableFilters[category_filter][parent_id]=${category.id}`
                      }
                      className="fi-ta-text grid w-full gap-y-1"
                    >
                      <span className="fi-ta-text-item-label text-sm leading-6 text-gray-950 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                        {category.name}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="px-3 py-4">
                    <Link
                      href={
                        tenantId
                          ? `/manage/${tenantId}/knowledge-categories?tableFilters[category_filter][parent_id]=${category.id}`
                          : `/knowledge-base/categories?tableFilters[category_filter][parent_id]=${category.id}`
                      }
                      className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      {category.subcategoriesCount}
                    </Link>
                  </TableCell>
                  <TableCell className="px-3 py-4">
                    <Link
                      href={
                        tenantId
                          ? `/manage/${tenantId}/knowledge-categories?tableFilters[category_filter][parent_id]=${category.id}`
                          : `/knowledge-base/categories?tableFilters[category_filter][parent_id]=${category.id}`
                      }
                      className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      {category.articlesCount || 0}
                    </Link>
                  </TableCell>
                  <TableCell className="fi-ta-cell p-0 first-of-type:ps-1 last-of-type:pe-1 sm:first-of-type:ps-3 sm:last-of-type:pe-3 fi-ta-actions-cell">
                    <div className="whitespace-nowrap px-3 py-4">
                      <div className="flex items-center gap-2">
                        {category.subcategoriesCount > 0 && (
                          <Link
                            href={
                              tenantId
                                ? `/manage/${tenantId}/knowledge-categories?tableFilters[category_filter][parent_id]=${category.id}`
                                : `/knowledge-base/categories?tableFilters[category_filter][parent_id]=${category.id}`
                            }
                            className="fi-link group/link relative inline-flex items-center justify-center outline-none fi-size-sm fi-link-size-sm gap-1 fi-color-custom fi-color-primary fi-ac-action fi-ac-link-action"
                            style={{
                              '--c-400': 'var(--primary-400)',
                              '--c-600': 'var(--primary-600)',
                            } as React.CSSProperties}
                          >
                            <span className="font-semibold text-sm text-custom-600 dark:text-custom-400 group-hover/link:underline group-focus-visible/link:underline">
                              Показать подкатегории
                            </span>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        )}
                        <Link
                          href={
                            tenantId
                              ? `/manage/${tenantId}/knowledge-categories/${category.id}/edit`
                              : `/knowledge-base/categories/${category.id}/edit`
                          }
                          className="fi-link group/link relative inline-flex items-center justify-center outline-none fi-size-sm fi-link-size-sm gap-1 fi-color-custom fi-color-primary fi-ac-action fi-ac-link-action"
                          style={{
                            '--c-400': 'var(--primary-400)',
                            '--c-600': 'var(--primary-600)',
                          } as React.CSSProperties}
                        >
                          <span className="font-semibold text-sm text-custom-600 dark:text-custom-400 group-hover/link:underline group-focus-visible/link:underline">
                            Редактировать
                          </span>
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(category.id)}
                          className="fi-link group/link relative inline-flex items-center justify-center outline-none fi-size-sm fi-link-size-sm gap-1 fi-color-custom fi-ac-action fi-ac-link-action"
                          style={{
                            '--c-400': 'var(--danger-400)',
                            '--c-600': 'var(--danger-600)',
                          } as React.CSSProperties}
                        >
                          <span className="font-semibold text-sm text-custom-600 dark:text-custom-400 group-hover/link:underline group-focus-visible/link:underline">
                            Удалить
                          </span>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <nav
          aria-label="Пагинация"
          role="navigation"
          className="fi-pagination grid grid-cols-[1fr_auto_1fr] items-center gap-x-3 fi-ta-pagination px-3 py-3 sm:px-6"
        >
          <div className="flex items-center justify-start">
            <p className="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
              Показано с {rootCategories.length > 0 ? 1 : 0} по {rootCategories.length} из {rootCategories.length}
            </p>
          </div>
          <div className="flex items-center justify-center gap-x-3">
            <div className="fi-input-wrp-prefix items-center gap-x-3 ps-3 flex border-e border-gray-200 pe-3 ps-3 dark:border-white/10">
              <span className="fi-input-wrp-label whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                на страницу
              </span>
            </div>
            <select
              className="fi-select-input block w-full border-none bg-transparent py-1.5 pe-8 text-base text-gray-950 transition duration-75 focus:ring-0 disabled:text-gray-500"
              value={recordsPerPage}
              onChange={(e) => setRecordsPerPage(Number.parseInt(e.target.value, 10))}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className="flex items-center justify-end"></div>
        </nav>
      </div>
    </section>
  );
};
