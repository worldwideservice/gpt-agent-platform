"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { KwidButton, KwidSection } from "@/components/kwid";
import { StageCard } from "@/app/(protected)/agents/[id]/_components/StageCard";
import { useTenantId } from "@/hooks/useTenantId";

interface PipelinesClientProps {
  agentId: string;
  agentName: string;
  tenantId?: string;
}

export const PipelinesClient = ({
  agentId,
  agentName,
  tenantId: propTenantId,
}: PipelinesClientProps) => {
  const router = useRouter();
  const params = useParams();
  const tenantId = useTenantId() || propTenantId;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pipelineSettings, setPipelineSettings] = useState<
    Array<{
      id: string;
      name: string;
      isActive: boolean;
      allStages: boolean;
      selectedStages: string[];
    }>
  >([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/agents/${agentId}/pipeline-settings`,
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setPipelineSettings(
              data.data.map((s: any) => ({
                id: s.pipeline_id,
                name: s.name || "Неизвестная воронка",
                isActive: s.is_active,
                allStages: s.all_stages,
                selectedStages: s.selected_stages || [],
              })),
            );
          }
        }
      } catch (error) {
        console.error("Failed to load pipeline settings", error);
        setError("Не удалось загрузить настройки воронок");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [agentId]);

  const handleSave = useCallback(async () => {
    try {
      const response = await fetch(`/api/agents/${agentId}/pipeline-settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pipelineSettings),
      });

      if (!response.ok) {
        throw new Error("Не удалось сохранить настройки");
      }

      const redirectPath = tenantId
        ? `/manage/${tenantId}/ai-agents/${agentId}/edit`
        : `/agents/${agentId}/edit`;
      router.push(redirectPath);
    } catch (error) {
      console.error("Failed to save pipeline settings", error);
      alert("Ошибка сохранения настроек");
    }
  }, [agentId, pipelineSettings, router, tenantId]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={() => {
              const redirectPath = tenantId
                ? `/manage/${tenantId}/ai-agents/${agentId}/edit`
                : `/agents/${agentId}/edit`;
              router.push(redirectPath);
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-custom-600 dark:text-gray-400 dark:hover:text-custom-400"
          >
            <ArrowLeft className="h-4 w-4" /> Назад к агенту
          </button>
          <h1 className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">
            Настройка воронок
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Настройте работу агента с воронками продаж
          </p>
        </div>
        <KwidButton onClick={handleSave} variant="primary" size="md">
          Сохранить
        </KwidButton>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {[
          "Generation lead",
          "Work Visa in Poland",
          "Seasonal Visa in Poland",
          "Product Vendors (Partnership)",
        ].map((name) => (
          <StageCard key={name} name={name} />
        ))}
      </div>
    </div>
  );
};
