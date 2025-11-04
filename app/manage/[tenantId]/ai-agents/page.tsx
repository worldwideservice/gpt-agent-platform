"use client";

/**
 * Страница списка AI Agents
 * Использует Refine для работы с данными и готовые компоненты UI
 */

import { useState, useEffect } from "react";
import { useList, useNavigation, useDelete, useUpdate, useInvalidate } from "@refinedev/core";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Copy, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

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
import { Switch } from "@/components/ui";
import { Badge } from "@/components/ui";
import { useToast } from "@/components/ui";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import type { Agent } from "@/types";

export default function AgentListPage() {
  const params = useParams();
  const tenantId = (params?.tenantId as string) || "";
  const { edit, create } = useNavigation();

  // Состояние для поиска
  const [searchValue, setSearchValue] = useState("");
  
  // Состояние для фильтра по статусу
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Состояние для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
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
  
  if (statusFilter !== "all") {
    filters.push({
      field: "status",
      operator: "eq" as const,
      value: statusFilter,
    });
  }

  // Получение данных через Refine
  const { result, query } = useList<Agent>({
    resource: "agents",
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

  // Обновление статуса агента
  const { mutate: updateAgent } = useUpdate();

  // Обработчик переключения статуса
  const handleToggleStatus = (agent: Agent) => {
    const newStatus = agent.status === "active" ? "inactive" : "active";
    updateAgent(
      {
        resource: "agents",
        id: agent.id,
        values: {
          status: newStatus,
        },
      },
      {
        onSuccess: () => {
          invalidate({
            resource: "agents",
            invalidates: ["list"],
          });
          pushToast({
            title: "Статус обновлен",
            description: "Статус агента успешно изменен",
            variant: "success",
          });
        },
        onError: () => {
          pushToast({
            title: "Ошибка",
            description: "Не удалось обновить статус агента",
            variant: "error",
          });
        },
      }
    );
  };

  // Обработчик копирования агента
  const handleCopy = async (agent: Agent) => {
    try {
      const response = await fetch(`/api/agents/${agent.id}/copy`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // Обновить список после копирования
        await invalidate({
          resource: "agents",
          invalidates: ["list"],
        });
        pushToast({
          title: "Агент скопирован",
          description: "Агент успешно скопирован",
          variant: "success",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        pushToast({
          title: "Ошибка",
          description: errorData.error || "Не удалось скопировать агента",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Ошибка копирования агента:", error);
      pushToast({
        title: "Ошибка",
        description: "Произошла ошибка при копировании агента",
        variant: "error",
      });
    }
  };


  if (isError) {
    return (
      <div className="p-6">
        <p className="text-red-500">Ошибка загрузки агентов</p>
      </div>
    );
  }

  const agents = data?.data || [];
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
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении размера
  };

  return (
    <div className="p-6">
      <ListView>
        <ListViewHeader resource="agents" />
        
        <LoadingOverlay loading={isLoading}>
          <div>
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
        
        {/* Фильтр по статусу */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="active">Активные</SelectItem>
            <SelectItem value="inactive">Неактивные</SelectItem>
            <SelectItem value="draft">Черновики</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Таблица */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Активно</TableHead>
              <TableHead>Модель ИИ</TableHead>
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
            ) : agents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Агенты не найдены
                </TableCell>
              </TableRow>
            ) : (
              agents.map((agent: Agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <Link
                      href={`/manage/${tenantId}/ai-agents/${agent.id}/edit`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {agent.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={agent.status === "active"}
                      onCheckedChange={() => handleToggleStatus(agent)}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {agent.model || "Не выбрана"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <EditButton recordItemId={agent.id} resource="agents" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(agent)}
                        title="Копировать"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <DeleteButton
                        recordItemId={agent.id}
                        resource="agents"
                        size="sm"
                        variant="ghost"
                      />
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
          </div>
        </LoadingOverlay>
      </ListView>
    </div>
  );
}

