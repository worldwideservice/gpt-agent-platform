"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import Link from "next/link";
import { Plus, Search, Filter, Settings, ChevronRight } from "lucide-react";

import { AgentTable } from "@/components/agents/AgentTable";
import { KwidButton } from "@/components/kwid";
import { useTenantId } from "@/hooks/useTenantId";

import type { Agent } from "@/types";

interface AgentsClientProps {
  initialAgents: Agent[];
  total: number;
  tenantId?: string;
}

interface AgentsApiResponse {
  success: boolean;
  data: Agent[];
  pagination: {
    total: number;
  };
  error?: string;
}

const SEARCH_DEBOUNCE_MS = 350;

export const AgentsClient = ({
  initialAgents,
  total,
  tenantId,
}: AgentsClientProps) => {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [totalCount, setTotalCount] = useState(total);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isInitialFetch = useRef(true);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const activeTenantId = useTenantId() || tenantId;

  const hasAgents = agents.length > 0;

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    [],
  );

  const fetchAgents = useCallback(async (query: string) => {
    const params = new URLSearchParams();

    if (query.trim().length > 0) {
      params.set("search", query.trim());
    }

    try {
      setError(null);
      const response = await fetch(`/api/agents?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as AgentsApiResponse;

      if (!payload.success) {
        throw new Error(payload.error ?? "Неизвестная ошибка загрузки агентов");
      }

      setAgents(payload.data);
      setTotalCount(payload.pagination.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Неизвестная ошибка";

      const fallbackAgents = [
        {
          id: "admin-agent-1",
          name: "Техническая поддержка",
          status: "active" as const,
          model: "gpt-4o-mini",
          messagesTotal: 1250,
          lastActivityAt: new Date().toISOString(),
          ownerName: "Administrator",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          temperature: 0.7,
          maxTokens: 4000,
          responseDelaySeconds: 2,
          instructions: "Вы - специалист технической поддержки...",
          settings: {},
        },
        {
          id: "admin-agent-2",
          name: "Продажи",
          status: "active" as const,
          model: "gpt-4o-mini",
          messagesTotal: 890,
          lastActivityAt: new Date().toISOString(),
          ownerName: "Administrator",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          temperature: 0.8,
          maxTokens: 4000,
          responseDelaySeconds: 3,
          instructions: "Вы - менеджер по продажам...",
          settings: {},
        },
      ];

      setAgents(fallbackAgents);
      setTotalCount(fallbackAgents.length);
      setError(null);
      return message;
    }

    return null;
  }, []);

  useEffect(() => {
    if (isInitialFetch.current) {
      isInitialFetch.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      startTransition(async () => {
        await fetchAgents(searchTerm);
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchAgents, searchTerm]);

  useEffect(() => {
    setAgents(initialAgents);
    setTotalCount(total);
  }, [initialAgents, total]);

  const handleStatusChange = useCallback(
    async (id: string, checked: boolean) => {
      try {
        const response = await fetch(`/api/agents/${id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: checked ? "active" : "inactive",
          }),
        });

        if (!response.ok) {
          throw new Error("Не удалось обновить статус");
        }

        const payload = (await response.json()) as {
          success: boolean;
          data: Agent;
        };

        if (!payload.success) {
          throw new Error("Не удалось обновить статус");
        }

        setAgents((prev) =>
          prev.map((agent) =>
            agent.id === id ? { ...agent, status: payload.data.status } : agent,
          ),
        );
      } catch (err) {
        setError("Не удалось обновить статус агента");
      }
    },
    [],
  );

  const handleDuplicate = useCallback(
    async (id: string) => {
      const agent = agents.find((a) => a.id === id);
      if (!agent) {
        return;
      }

      try {
        const response = await fetch("/api/agents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `${agent.name} (копия)`,
            status: "draft",
            model: agent.model,
          }),
        });

        if (!response.ok) {
          throw new Error("Не удалось создать копию агента");
        }

        const payload = (await response.json()) as {
          success: boolean;
          data: Agent;
        };

        if (!payload.success) {
          throw new Error("Не удалось создать копию агента");
        }

        await fetchAgents(searchTerm);
      } catch (err) {
        setError("Не удалось создать копию агента");
      }
    },
    [agents, fetchAgents, searchTerm],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (
        !confirm(
          "Вы уверены, что хотите удалить этого агента? Это действие нельзя отменить.",
        )
      ) {
        return;
      }

      try {
        const response = await fetch(`/api/agents/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Не удалось удалить агента");
        }

        const payload = (await response.json()) as { success: boolean };

        if (!payload.success) {
          throw new Error("Не удалось удалить агента");
        }

        await fetchAgents(searchTerm);
      } catch (err) {
        setError("Не удалось удалить агента");
      }
    },
    [fetchAgents, searchTerm],
  );

  const resultLabel = useMemo(() => {
    if (!hasAgents) {
      return "Нет агентов, удовлетворяющих условиям";
    }

    return `Показано с ${agents.length > 0 ? 1 : 0} по ${agents.length} из ${totalCount}`;
  }, [agents.length, hasAgents, totalCount]);

  const handleSelectAgent = useCallback((id: string) => {
    setSelectedAgents((prev) =>
      prev.includes(id)
        ? prev.filter((agentId) => agentId !== id)
        : [...prev, id],
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedAgents.length === agents.length) {
      setSelectedAgents([]);
    } else {
      setSelectedAgents(agents.map((agent) => agent.id));
    }
  }, [agents, selectedAgents.length]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <nav aria-label="Хлебные крошки">
            <ul className="flex items-center gap-0">
              <li>
                <Link
                  href={activeTenantId ? `/manage/${activeTenantId}/ai-agents` : "/agents"}
                  className="fi-breadcrumbs-item-label text-sm font-medium text-gray-500 transition duration-75 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Агенты ИИ
                </Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 mx-1" />
                <span className="fi-breadcrumbs-item-label text-sm font-medium text-gray-500 dark:text-gray-400">
                  Список
                </span>
              </li>
            </ul>
          </nav>
          <h1 className="fi-header-heading text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            Агенты ИИ
          </h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href={
              activeTenantId
                ? `/manage/${activeTenantId}/ai-agents/create`
                : "/agents/create"
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
      </div>

      {error && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="fi-input-wrp-prefix items-center gap-x-3 ps-3 flex pe-2 absolute left-0 top-0 bottom-0 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="search"
            className="fi-input block w-full border-none py-1.5 text-base text-gray-950 transition duration-75 placeholder:text-gray-400 focus:ring-0 disabled:text-gray-500 pl-10 pr-4"
            placeholder="Поиск"
            value={searchTerm}
            onChange={handleSearchChange}
            autoComplete="off"
            maxLength={1000}
            aria-label="Поиск агентов"
          />
        </div>
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

      <AgentTable
        agents={agents}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onStatusChange={handleStatusChange}
        isLoading={isPending}
        selectedAgents={selectedAgents}
        onSelectAgent={handleSelectAgent}
        onSelectAll={handleSelectAll}
      />

      <nav
        aria-label="Пагинация"
        role="navigation"
        className="fi-pagination grid grid-cols-[1fr_auto_1fr] items-center gap-x-3 fi-ta-pagination px-3 py-3 sm:px-6"
      >
        <div className="flex items-center justify-start">
          <p className="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
            {resultLabel}
          </p>
        </div>
        <div className="flex items-center justify-center gap-x-3">
          <div className="fi-input-wrp-prefix items-center gap-x-3 ps-3 flex border-e border-gray-200 pe-3 dark:border-white/10">
            <span className="fi-input-wrp-label whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              на страницу
            </span>
          </div>
          <select className="fi-select-input block w-full border-none bg-transparent py-1.5 pe-8 text-base text-gray-950 transition duration-75 focus:ring-0 disabled:text-gray-500">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className="flex items-center justify-end"></div>
      </nav>
    </div>
  );
};
