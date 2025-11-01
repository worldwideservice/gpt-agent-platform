"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { KwidButton, KwidInput, KwidSection } from "@/components/kwid";
import { useToast } from "@/components/ui/toast-context";
import { useTenantId } from "@/hooks/useTenantId";

import type { Agent } from "@/types";

const CreateAgentPage = () => {
  const router = useRouter();
  const tenantId = useTenantId();
  const { push: pushToast } = useToast();
  const [agentName, setAgentName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleBack = () => {
    const redirectPath = tenantId ? `/manage/${tenantId}/ai-agents` : "/agents";
    router.push(redirectPath);
  };

  const handleSubmit = (mode: "create" | "createAndNew") => {
    if (!agentName.trim()) {
      setError("Название агента обязательно");
      return;
    }

    startTransition(async () => {
      setError(null);

      try {
        const response = await fetch("/api/agents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: agentName.trim(),
            status: "draft",
          }),
        });

        const payload = (await response.json()) as {
          success: boolean;
          data?: Agent;
          error?: string;
        };

        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.error ?? "Не удалось создать агента");
        }

        pushToast({
          title: "Агент создан",
          description: `«${payload.data.name}» добавлен в список агентов`,
          variant: "success",
        });

        if (mode === "create") {
          const redirectPath = tenantId
            ? `/manage/${tenantId}/ai-agents/${payload.data.id}/edit`
            : `/agents/${payload.data.id}/edit`;
          router.push(redirectPath);
          return;
        }

        setAgentName("");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Не удалось создать агента";
        console.error("Failed to create agent", err);
        setError(message);
        pushToast({
          title: "Ошибка создания агента",
          description: message,
          variant: "error",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <KwidButton
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </KwidButton>
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Агенты ИИ</span>
            <span>›</span>
            <span>Создать</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
            Создать Агент ИИ
          </h1>
        </div>
      </div>

      <KwidSection
        title="Профиль агента"
        description="Введите название агента для начала работы"
      >
        <div className="space-y-6">
          <KwidInput
            label="Название"
            placeholder="Введите название агента"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            required
            autoFocus
            disabled={isPending}
            error={error || undefined}
          />

          <div className="fi-form-actions">
            <KwidButton
              onClick={() => handleSubmit("create")}
              disabled={!agentName.trim() || isPending}
              variant="primary"
              size="md"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Создание...
                </>
              ) : (
                "Создать"
              )}
            </KwidButton>
            <KwidButton
              variant="outline"
              size="md"
              onClick={() => handleSubmit("createAndNew")}
              disabled={!agentName.trim() || isPending}
            >
              Создать и создать ещё
            </KwidButton>
            <KwidButton
              variant="outline"
              size="md"
              onClick={handleBack}
              disabled={isPending}
            >
              Отмена
            </KwidButton>
          </div>
        </div>
      </KwidSection>
    </div>
  );
};

export default CreateAgentPage;
