"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Plus,
  Trash2,
  Edit2,
  Pause,
  Play,
  MessageSquare,
  Save,
  X,
  Search,
  Filter,
  Settings,
} from "lucide-react";

import {
  KwidButton,
  KwidInput,
  KwidTextarea,
  KwidSwitch,
  KwidSelect,
  KwidSection,
} from "@/components/kwid";

import type { AgentSequence } from "@/lib/repositories/agent-sequences";

type SequenceStepInput = {
  id?: string;
  stepType: "send_message" | "wait" | "webhook";
  payload: Record<string, unknown>;
  delaySeconds: number;
  sortOrder: number;
};

interface AgentSequencesManagerProps {
  agentId: string;
}

const STEP_TYPE_OPTIONS = [
  { value: "send_message", label: "Отправить сообщение" },
  { value: "wait", label: "Ожидание" },
  { value: "webhook", label: "Вызвать Webhook" },
];

const createEmptyStep = (sortOrder: number): SequenceStepInput => ({
  stepType: "send_message",
  payload: { text: "" },
  delaySeconds: 0,
  sortOrder,
});

export const AgentSequencesManager = ({
  agentId,
}: AgentSequencesManagerProps) => {
  const isDraft = agentId === "new";

  const [sequences, setSequences] = useState<AgentSequence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSequenceId, setEditingSequenceId] = useState<string | null>(
    null,
  );

  const [formState, setFormState] = useState({
    name: "",
    description: "",
    isActive: true,
    steps: [createEmptyStep(0)],
  });

  const fetchSequences = useCallback(async () => {
    if (!agentId || agentId === "new") {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/agents/${agentId}/sequences`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const payload = (await response.json()) as {
        success: boolean;
        data: AgentSequence[];
        error?: string;
      };

      if (!payload.success) {
        throw new Error(payload.error ?? "Unknown error");
      }

      setSequences(payload.data);
    } catch (err) {
      console.error("Failed to load sequences", err);
      setError("Не удалось загрузить цепочки. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    if (isDraft) {
      setIsLoading(false);
      return;
    }

    void fetchSequences();
  }, [fetchSequences, isDraft]);

  const resetForm = useCallback(() => {
    setFormState({
      name: "",
      description: "",
      isActive: true,
      steps: [createEmptyStep(0)],
    });
    setEditingSequenceId(null);
  }, []);

  const openCreateEditor = () => {
    resetForm();
    setIsEditorOpen(true);
  };

  const openEditEditor = (sequence: AgentSequence) => {
    setEditingSequenceId(sequence.id);
    setFormState({
      name: sequence.name,
      description: sequence.description ?? "",
      isActive: sequence.isActive,
      steps: sequence.steps.map((step, index) => ({
        id: step.id,
        stepType:
          (step.stepType as SequenceStepInput["stepType"]) ?? "send_message",
        payload: step.payload,
        delaySeconds: step.delaySeconds,
        sortOrder: step.sortOrder ?? index,
      })),
    });
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    resetForm();
  };

  const handleStepChange = <K extends keyof SequenceStepInput>(
    index: number,
    key: K,
    value: SequenceStepInput[K],
  ) => {
    setFormState((prev) => {
      const steps = prev.steps.map((step, stepIndex) => {
        if (stepIndex !== index) {
          return step;
        }

        const nextStep: SequenceStepInput = {
          ...step,
          [key]: value,
        };

        if (key === "stepType") {
          if (value === "send_message") {
            nextStep.payload = { text: "" };
            nextStep.delaySeconds = 0;
          }

          if (value === "wait") {
            nextStep.payload = { message: "Ожидание" };
            nextStep.delaySeconds = step.delaySeconds ?? 60;
          }

          if (value === "webhook") {
            nextStep.payload = { url: "" };
            nextStep.delaySeconds = 0;
          }
        }

        return nextStep;
      });

      return { ...prev, steps };
    });
  };

  const handleStepPayloadChange = (
    index: number,
    payload: Record<string, unknown>,
  ) => {
    setFormState((prev) => {
      const steps = prev.steps.map((step, stepIndex) =>
        stepIndex === index ? { ...step, payload } : step,
      );
      return { ...prev, steps };
    });
  };

  const addStep = () => {
    setFormState((prev) => {
      const nextOrder = prev.steps.length;
      return {
        ...prev,
        steps: [...prev.steps, createEmptyStep(nextOrder)],
      };
    });
  };

  const removeStep = (index: number) => {
    setFormState((prev) => {
      const steps = prev.steps
        .filter((_, stepIndex) => stepIndex !== index)
        .map((step, idx) => ({
          ...step,
          sortOrder: idx,
        }));
      return {
        ...prev,
        steps: steps.length > 0 ? steps : [createEmptyStep(0)],
      };
    });
  };

  const convertStepPayload = (
    step: SequenceStepInput,
  ): Record<string, unknown> => {
    if (step.stepType === "send_message") {
      return { text: String((step.payload as { text?: unknown })?.text ?? "") };
    }

    if (step.stepType === "wait") {
      return {
        message: String(
          (step.payload as { message?: unknown })?.message ?? "Ожидание",
        ),
        seconds: Number.isFinite(step.delaySeconds) ? step.delaySeconds : 0,
      };
    }

    if (step.stepType === "webhook") {
      return {
        url: String((step.payload as { url?: unknown })?.url ?? ""),
        method: "POST",
      };
    }

    return step.payload;
  };

  const handleSubmit = async () => {
    setIsSaving(true);

    try {
      const endpoint = editingSequenceId
        ? `/api/agents/${agentId}/sequences/${editingSequenceId}`
        : `/api/agents/${agentId}/sequences`;

      const method = editingSequenceId ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formState.name.trim(),
          description: formState.description.trim() || null,
          isActive: formState.isActive,
          steps: formState.steps.map((step, index) => ({
            id: step.id,
            stepType: step.stepType,
            payload: convertStepPayload(step),
            delaySeconds: step.delaySeconds,
            sortOrder: index,
          })),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "Request failed");
      }

      await fetchSequences();
      closeEditor();
    } catch (err) {
      console.error("Failed to save sequence", err);
      alert("Не удалось сохранить цепочку. Попробуйте еще раз.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSequenceActive = async (
    sequence: AgentSequence,
    nextValue: boolean,
  ) => {
    try {
      const response = await fetch(
        `/api/agents/${agentId}/sequences/${sequence.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: nextValue }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to toggle");
      }

      await fetchSequences();
    } catch (err) {
      console.error("Failed to toggle sequence", err);
      alert("Не удалось обновить статус цепочки.");
    }
  };

  const deleteSequence = async (sequenceId: string) => {
    if (!confirm("Удалить цепочку? Действие нельзя отменить.")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/agents/${agentId}/sequences/${sequenceId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      await fetchSequences();
    } catch (err) {
      console.error("Failed to delete sequence", err);
      alert("Не удалось удалить цепочку.");
    }
  };

  const editorTitle = editingSequenceId
    ? "Редактирование цепочки"
    : "Новая цепочка";

  const canSubmit = useMemo(() => {
    if (!formState.name.trim()) {
      return false;
    }

    const hasValidSteps = formState.steps.every((step) => {
      if (step.stepType === "send_message") {
        return Boolean((step.payload as { text?: unknown })?.text);
      }

      if (step.stepType === "wait") {
        return Number.isFinite(step.delaySeconds) && step.delaySeconds >= 0;
      }

      if (step.stepType === "webhook") {
        const url = (step.payload as { url?: unknown })?.url;
        return typeof url === "string" && url.trim().length > 0;
      }

      return true;
    });

    return hasValidSteps;
  }, [formState.name, formState.steps]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredSequences = sequences.filter(
    (seq) =>
      seq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (seq.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false),
  );

  return (
    <div className="space-y-6">
      {isDraft ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          Сначала сохраните агента, чтобы управлять автоматическими цепочками.
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold leading-6 text-gray-950 dark:text-white">
            Цепочки
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Автоматизируйте отправку последующих сообщений и выполнение действий по расписанию.
          </p>
        </div>
        <KwidButton
          onClick={openCreateEditor}
          className="gap-2"
          disabled={isDraft}
          variant="primary"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          Создать
        </KwidButton>
      </div>

      {!isDraft && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <KwidInput
              type="search"
              placeholder="Поиск"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-custom-200 hover:text-custom-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-custom-700 dark:hover:text-custom-400"
            aria-label="Фильтры"
          >
            <Filter className="h-5 w-5" />
          </button>
          <KwidButton
            variant="outline"
            size="sm"
            className="gap-2"
            aria-label="Переключить столбцы"
          >
            Переключить столбцы
            <Settings className="h-4 w-4" />
          </KwidButton>
        </div>
      )}

      {isDraft ? null : isLoading ? (
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Загрузка цепочек…
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      ) : filteredSequences.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <X className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Не найдено Цепочки
          </h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Создать Цепочка для старта.
          </p>
          <KwidButton
            onClick={openCreateEditor}
            className="gap-2"
            variant="primary"
            size="md"
          >
            <Plus className="h-4 w-4" />
            Создать
          </KwidButton>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Название
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Активно
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Шаги
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSequences.map((sequence) => (
                <tr
                  key={sequence.id}
                  className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {sequence.name}
                      </span>
                      {sequence.description && (
                        <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {sequence.description}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <KwidSwitch
                      checked={sequence.isActive}
                      onCheckedChange={(checked) =>
                        toggleSequenceActive(sequence, checked)
                      }
                      aria-label={
                        sequence.isActive ? "Деактивировать" : "Активировать"
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {sequence.steps.length} шагов
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => openEditEditor(sequence)}
                        className="text-custom-600 hover:text-custom-700 text-sm font-medium dark:text-custom-400 dark:hover:text-custom-300"
                      >
                        Изменить
                      </button>
                      <button
                        onClick={() => deleteSequence(sequence.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium dark:text-red-400 dark:hover:text-red-300"
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isEditorOpen ? (
        <KwidSection
          title={editorTitle}
          description="Опишите шаги, которые агент выполнит автоматически."
        >
          <div className="space-y-5">
            <div className="flex items-center justify-end">
              <KwidButton variant="outline" size="sm" onClick={closeEditor}>
                Отменить
              </KwidButton>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <KwidInput
                label="Название"
                placeholder="Например, Приветствие нового лида"
                value={formState.name}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                required
              />
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Цепочка активна
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formState.isActive
                      ? "Будет выполняться автоматически"
                      : "Цепочка отключена до повторного включения"}
                  </p>
                </div>
                <KwidSwitch
                  checked={formState.isActive}
                  onCheckedChange={(value) =>
                    setFormState((prev) => ({ ...prev, isActive: value }))
                  }
                />
              </div>
            </div>

            <KwidTextarea
              label="Описание"
              placeholder="Кратко опишите назначение цепочки"
              rows={3}
              value={formState.description}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Шаги
                </h4>
                <KwidButton variant="outline" size="sm" onClick={addStep}>
                  <Plus className="mr-2 h-4 w-4" /> Добавить шаг
                </KwidButton>
              </div>

              <div className="space-y-4">
                {formState.steps.map((step, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-3">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Тип шага
                        </label>
                        <div className="grid gap-3 md:grid-cols-2">
                          <KwidSelect
                            options={STEP_TYPE_OPTIONS}
                            value={step.stepType}
                            onChange={(value: string) =>
                              handleStepChange(
                                index,
                                "stepType",
                                value as SequenceStepInput["stepType"],
                              )
                            }
                          />

                          {step.stepType === "wait" ? (
                            <KwidInput
                              type="number"
                              min={0}
                              label="Задержка, сек"
                              value={step.delaySeconds}
                              onChange={(event) =>
                                handleStepChange(
                                  index,
                                  "delaySeconds",
                                  Number.parseInt(event.target.value, 10) || 0,
                                )
                              }
                            />
                          ) : step.stepType === "send_message" ? (
                            <KwidTextarea
                              label="Сообщение"
                              rows={3}
                              value={String(
                                (step.payload as { text?: unknown })?.text ??
                                  "",
                              )}
                              onChange={(event) =>
                                handleStepPayloadChange(index, {
                                  text: event.target.value,
                                })
                              }
                            />
                          ) : (
                            <KwidInput
                              label="URL Webhook"
                              value={String(
                                (step.payload as { url?: unknown })?.url ?? "",
                              )}
                              onChange={(event) =>
                                handleStepPayloadChange(index, {
                                  url: event.target.value,
                                })
                              }
                            />
                          )}
                        </div>
                      </div>

                      <KwidButton
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-0"
                        onClick={() => removeStep(index)}
                        aria-label="Удалить шаг"
                      >
                        <Trash2 className="h-4 w-4" />
                      </KwidButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <KwidButton variant="outline" size="md" onClick={closeEditor}>
                Отмена
              </KwidButton>
              <KwidButton
                onClick={handleSubmit}
                disabled={!canSubmit || isSaving}
                className="gap-2"
                variant="primary"
                size="md"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {editingSequenceId ? "Сохранить изменения" : "Создать цепочку"}
              </KwidButton>
            </div>
          </div>
        </KwidSection>
      ) : null}
    </div>
  );
};
