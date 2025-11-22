/**
 * Refine Data Provider для интеграции с API
 * Преобразует ответы API в формат Refine
 */

import { DataProvider } from "@refinedev/core";
import type { CrudFilters, CrudSorting, Pagination } from "@refinedev/core";

const API_URL = typeof window !== "undefined" ? "/api" : process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api`
  : "http://localhost:3000/api";

interface ApiPagination {
  total: number
  page: number
  limit: number
}

interface ApiResponseBase {
  success: boolean
  error?: string
}

interface ApiListResponse<T> extends ApiResponseBase {
  data?: T
  agents?: T
  pagination?: ApiPagination
  total?: number
}

interface ApiSingleResponse<T> extends ApiResponseBase {
  data?: T
  agent?: T
}

/**
 * Преобразует фильтры Refine в query параметры
 */
function transformFilters(filters?: CrudFilters): Record<string, string> {
  if (!filters || filters.length === 0) return {};

  const params: Record<string, string> = {};

  filters.forEach((filter) => {
    if ("field" in filter && "operator" in filter && "value" in filter) {
      const { field, operator, value } = filter;

      // Поддерживаемые операторы
      switch (operator) {
        case "eq":
          // Для eq оператора передаем поле напрямую (например, categoryId)
          params[field as string] = String(value);
          break;
        case "ne":
          // Не поддерживается напрямую, пропускаем
          break;
        case "contains":
          // Для поиска используем поле "search" если поле "name" или "title"
          // Иначе используем имя поля как параметр
          if (field === "name" || field === "title") {
            params.search = String(value);
          } else {
            params[field as string] = String(value);
          }
          break;
        case "in":
          // Не поддерживается напрямую, пропускаем
          break;
      }
    }
  });

  return params;
}

/**
 * Преобразует сортировку Refine в query параметры
 */
function transformSorting(sorting?: CrudSorting): Record<string, string> {
  if (!sorting || sorting.length === 0) return {};

  const params: Record<string, string> = {};

  sorting.forEach((sort) => {
    if (sort.order) {
      params.sort = sort.field;
      params.order = sort.order === "asc" ? "asc" : "desc";
    }
  });

  return params;
}

/**
 * Преобразует пагинацию Refine в query параметры
 */
function transformPagination(pagination?: Pagination): Record<string, string> {
  if (!pagination) return {};

  const params: Record<string, string> = {};

  if (pagination.currentPage !== undefined) {
    params.page = String(pagination.currentPage);
  }

  if (pagination.pageSize !== undefined) {
    params.limit = String(pagination.pageSize);
  }

  return params;
}

/**
 * Выполняет запрос к API с обработкой ошибок
 */
async function apiRequest<T extends ApiResponseBase>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include", // Для передачи cookies (NextAuth)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: `HTTP ${response.status}`,
    }));

    throw new Error(errorData.error || `API request failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "API request failed");
  }

  return data;
}

// Маппинг ресурсов Refine на API endpoints
const resourceMapping: Record<string, string> = {
  "agents": "agents",
  "knowledge-items": "knowledge-base/articles",
  "knowledge-categories": "knowledge-base/categories",
};

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const params = new URLSearchParams({
      ...transformPagination(pagination),
      ...transformFilters(filters),
      ...transformSorting(sorters),
    });

    // Используем маппинг или исходное имя ресурса
    const apiResource = resourceMapping[resource] || resource;
    const url = `${API_URL}/${apiResource}?${params.toString()}`;
    const response = await apiRequest<ApiListResponse<Record<string, unknown>[]>>(url);

    // Преобразуем ответ API в формат Refine
    const data = response.data || response.agents || [];
    const total = response.pagination?.total || response.total || data.length;

    return {
      data,
      total,
    };
  },

  getOne: async ({ resource, id, meta }) => {
    const apiResource = resourceMapping[resource] || resource;
    const url = `${API_URL}/${apiResource}/${id}`;
    const response = await apiRequest<ApiSingleResponse<Record<string, unknown>>>(url);

    return {
      data: response.data,
    };
  },

  create: async ({ resource, variables, meta }) => {
    const apiResource = resourceMapping[resource] || resource;
    const url = `${API_URL}/${apiResource}`;
    const response = await apiRequest<ApiSingleResponse<Record<string, unknown>>>(url, {
      method: "POST",
      body: JSON.stringify(variables),
    });

    return {
      data: response.data || response.agent || variables,
    };
  },

  update: async ({ resource, id, variables, meta }) => {
    const apiResource = resourceMapping[resource] || resource;
    const url = `${API_URL}/${apiResource}/${id}`;
    const response = await apiRequest<ApiSingleResponse<Record<string, unknown>>>(url, {
      method: "PATCH",
      body: JSON.stringify(variables),
    });

    return {
      data: response.data,
    };
  },

  deleteOne: async ({ resource, id, meta }) => {
    const apiResource = resourceMapping[resource] || resource;
    const url = `${API_URL}/${apiResource}/${id}`;
    const response = await apiRequest<ApiSingleResponse<Record<string, unknown>>>(url, {
      method: "DELETE",
    });

    return {
      data: response.data || { id },
    };
  },

  getApiUrl: () => API_URL,

  // Дополнительные методы (опционально, можно реализовать позже)
  custom: async ({ url, method, filters, sorters, payload, meta }) => {
    const params = new URLSearchParams({
      ...transformFilters(filters),
      ...transformSorting(sorters),
    });

    const fullUrl = url.startsWith("http") ? url : `${API_URL}${url}${params.toString() ? `?${params.toString()}` : ""}`;

    const response = await apiRequest<ApiSingleResponse<Record<string, unknown>>>(fullUrl, {
      method: method || "GET",
      body: payload ? JSON.stringify(payload) : undefined,
    });

    return {
      data: response.data || response,
    };
  },
};
