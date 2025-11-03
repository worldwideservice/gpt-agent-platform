"use client";

/**
 * Страница списка Knowledge Categories (Категории)
 * Использует Refine для работы с данными
 */

import { useState, useEffect } from "react";
import { useList, useNavigation, useDelete, useInvalidate } from "@refinedev/core";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Folder } from "lucide-react";

import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui";
import { Badge } from "@/components/ui";
import { useToast } from "@/components/ui";
import { ConfirmDialog } from "@/components/ui";
import type { KnowledgeBaseCategory } from "@/types";

export default function KnowledgeCategoriesListPage() {
  const params = useParams();
  const tenantId = (params?.tenantId as string) || "";
  const { edit, create } = useNavigation();

  // Состояние для поиска
  const [searchValue, setSearchValue] = useState("");
  
  // Состояние для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Состояние для диалога подтверждения удаления
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  
  // Toast для уведомлений
  const { push: pushToast } = useToast();

  // Debounce для поиска
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Формируем фильтры
  const filters = [];
  
  if (debouncedSearch) {
    filters.push({
      field: "name",
      operator: "contains" as const,
      value: debouncedSearch,
    });
  }

  // Получение данных через Refine
  const { result, query } = useList<KnowledgeBaseCategory>({
    resource: "knowledge-categories",
    filters: filters.length > 0 ? filters : undefined,
    pagination: {
      currentPage,
      pageSize,
    },
  });

  const { data, isLoading, isError } = {
    data: result,
    isLoading: query.isLoading,
    isError: query.isError,
  };

  // Инвалидация кэша для обновления данных
  const invalidate = useInvalidate();

  // Удаление категории
  const { mutate: deleteCategory } = useDelete();

  // Обработчик открытия диалога удаления
  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteDialogOpen(true);
  };

  // Обработчик подтверждения удаления
  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;

    deleteCategory(
      {
        resource: "knowledge-categories",
        id: categoryToDelete,
      },
      {
        onSuccess: async () => {
          await invalidate({
            resource: "knowledge-categories",
            invalidates: ["list"],
          });
          // Также обновляем список статей, так как они зависят от категорий
          await invalidate({
            resource: "knowledge-items",
            invalidates: ["list"],
          });
          pushToast({
            title: "Категория удалена",
            description: "Категория успешно удалена",
            variant: "success",
          });
          setDeleteDialogOpen(false);
          setCategoryToDelete(null);
        },
        onError: (error) => {
          console.error("Ошибка удаления категории:", error);
          pushToast({
            title: "Ошибка",
            description: "Не удалось удалить категорию",
            variant: "error",
          });
        },
      }
    );
  };

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-red-500">Ошибка загрузки категорий</p>
      </div>
    );
  }

  const categories = data?.data || [];
  const total = data?.total || 0;
  
  // Расчет пагинации
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, total);
  
  // Обработчики пагинации
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  const handlePageSizeChange = (size: string) => {
    setPageSize(Number.parseInt(size, 10));
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Категории</h1>
          <nav className="text-sm text-gray-500 mt-1">Категории → Список</nav>
        </div>
        <Button onClick={() => create("knowledge-categories")}>
          <Plus className="h-4 w-4 mr-2" />
          Создать
        </Button>
      </div>

      {/* Панель инструментов */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Поиск"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Таблица */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Статей</TableHead>
              <TableHead>Создано</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Загрузка...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Категории не найдены
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category: KnowledgeBaseCategory) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Link
                      href={`/manage/${tenantId}/knowledge-categories/${category.id}/edit`}
                      className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-2"
                    >
                      <Folder className="h-4 w-4" />
                      {category.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {category.articlesCount || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => edit("knowledge-categories", category.id)}
                        title="Изменить"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(category.id)}
                        title="Удалить"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Пагинация */}
      {total > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Показано с {startIndex} по {endIndex} из {total}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Выбор размера страницы */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">На страницу:</span>
              <Select
                value={String(pageSize)}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Кнопки навигации */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                title="Первая страница"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                title="Предыдущая страница"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="px-3 text-sm text-gray-500">
                Страница {currentPage} из {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                title="Следующая страница"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage >= totalPages}
                title="Последняя страница"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Диалог подтверждения удаления */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Удалить категорию?"
        description="Вы уверены, что хотите удалить эту категорию? Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

