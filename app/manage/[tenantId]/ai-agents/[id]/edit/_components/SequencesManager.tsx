"use client";

/**
 * Компонент управления последовательностями (Sequences) агента
 */

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Play } from "lucide-react";

import { Button } from "@/components/ui";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui";
import { Badge } from "@/components/ui";
import { Switch } from "@/components/ui";
import { useToast } from "@/components/ui";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CreateSequenceDialog } from "./CreateSequenceDialog";

interface Sequence {
  id: string;
  name: string;
  description?: string | null;
  trigger_type: string;
  is_active: boolean;
  steps: Array<{
    step_order: number;
    action_type: string;
    delay_minutes: number;
  }>;
}

interface SequencesManagerProps {
  agentId: string;
}

export function SequencesManager({ agentId }: SequencesManagerProps) {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sequenceToDelete, setSequenceToDelete] = useState<Sequence | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { push: pushToast } = useToast();

  const refreshSequences = async () => {
    try {
      const response = await fetch(`/api/agents/${agentId}/sequences`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setSequences(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch sequences", error);
    }
  };

  // Загрузка последовательностей
  useEffect(() => {
    const fetchSequences = async () => {
      setIsLoading(true);
      await refreshSequences();
      setIsLoading(false);
    };
    fetchSequences();
  }, [agentId]);

  const handleToggleStatus = async (sequence: Sequence) => {
    try {
      const response = await fetch(
        `/api/agents/${agentId}/sequences/${sequence.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ is_active: !sequence.is_active }),
        }
      );
      if (response.ok) {
        setSequences(
          sequences.map((s) =>
            s.id === sequence.id ? { ...s, is_active: !s.is_active } : s
          )
        );
        pushToast({
          title: "Статус обновлен",
          description: "Статус последовательности успешно изменен",
          variant: "success",
        });
      } else {
        throw new Error("Не удалось обновить статус");
      }
    } catch (error) {
      pushToast({
        title: "Ошибка",
        description: "Не удалось обновить статус последовательности",
        variant: "error",
      });
    }
  };

  const handleDeleteClick = (sequence: Sequence) => {
    setSequenceToDelete(sequence);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sequenceToDelete) return;

    try {
      const response = await fetch(
        `/api/agents/${agentId}/sequences/${sequenceToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        setSequences(sequences.filter((s) => s.id !== sequenceToDelete.id));
        pushToast({
          title: "Последовательность удалена",
          description: "Последовательность успешно удалена",
          variant: "success",
        });
      } else {
        throw new Error("Не удалось удалить последовательность");
      }
      setDeleteDialogOpen(false);
      setSequenceToDelete(null);
    } catch (error) {
      pushToast({
        title: "Ошибка",
        description: "Не удалось удалить последовательность",
        variant: "error",
      });
    }
  };

  return (
    <div className="space-y-4">
      <LoadingOverlay loading={isLoading}>
        {/* Заголовок с кнопкой создания */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Цепочки (Sequences)</h3>
            <p className="text-sm text-gray-500">
              Настройте последовательности автоматизированных действий
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Создать цепочку
          </Button>
        </div>

        {/* Таблица последовательностей */}
        {sequences.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-gray-500 mb-4">Цепочки не созданы</p>
            <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Создать первую цепочку
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Триггер</TableHead>
                  <TableHead>Шаги</TableHead>
                  <TableHead>Активна</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sequences.map((sequence) => (
                  <TableRow key={sequence.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sequence.name}</div>
                        {sequence.description && (
                          <div className="text-sm text-gray-500">
                            {sequence.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {sequence.trigger_type === "manual" ? "Вручную" :
                         sequence.trigger_type === "lead_created" ? "Создание лида" :
                         sequence.trigger_type === "stage_changed" ? "Смена этапа" :
                         sequence.trigger_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {sequence.steps?.length || 0} шагов
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={sequence.is_active}
                        onCheckedChange={() => handleToggleStatus(sequence)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => pushToast({ title: "В разработке", description: "Форма редактирования последовательности будет добавлена", variant: "default" })}
                          title="Изменить"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => pushToast({ title: "В разработке", description: "Запуск последовательности будет добавлен", variant: "default" })}
                          title="Запустить"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(sequence)}
                          title="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </LoadingOverlay>

      {/* Диалог создания последовательности */}
      <CreateSequenceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        agentId={agentId}
        onSuccess={() => {
          setCreateDialogOpen(false);
          refreshSequences();
        }}
      />

      {/* Диалог подтверждения удаления */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Удалить цепочку"
        description={`Вы уверены, что хотите удалить цепочку "${sequenceToDelete?.name}"? Это действие нельзя отменить.`}
        onConfirm={handleDeleteConfirm}
        confirmText="Удалить"
        cancelText="Отмена"
        variant="destructive"
      />
    </div>
  );
}

