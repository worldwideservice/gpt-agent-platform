"use client";

/**
 * Страница управления скриптами продаж для агента
 */

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Plus, Edit, Trash2, FileText } from "lucide-react";

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
import { Input } from "@/components/ui";
import { useToast } from "@/components/ui";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CreateScriptDialog } from "./_components/CreateScriptDialog";
import { EditScriptDialog } from "./_components/EditScriptDialog";

interface SalesScript {
  id: string;
  orgId: string;
  agentId: string | null;
  pipelineStageId: string | null;
  title: string;
  scriptType: "greeting" | "qualification" | "presentation" | "objection_handling" | "closing";
  content: string;
  variables: Record<string, unknown>;
  conditions: Record<string, unknown>;
  effectivenessScore: number;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function ScriptsPage() {
  const params = useParams();
  const agentId = (params?.id as string) || "";
  const [scripts, setScripts] = useState<SalesScript[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scriptToDelete, setScriptToDelete] = useState<SalesScript | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState<SalesScript | null>(null);
  const { push: pushToast } = useToast();

  const refreshScripts = async () => {
    try {
      const response = await fetch(`/api/agents/${agentId}/scripts`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setScripts(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch scripts", error);
    }
  };

  useEffect(() => {
    const fetchScripts = async () => {
      setIsLoading(true);
      await refreshScripts();
      setIsLoading(false);
    };
    fetchScripts();
  }, [agentId]);

  const handleDeleteClick = (script: SalesScript) => {
    setScriptToDelete(script);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!scriptToDelete) return;

    try {
      const response = await fetch(
        `/api/agents/${agentId}/scripts/${scriptToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        setScripts(scripts.filter((s) => s.id !== scriptToDelete.id));
        pushToast({
          title: "Скрипт удален",
          description: "Скрипт успешно удален",
          variant: "success",
        });
      }
      setDeleteDialogOpen(false);
      setScriptToDelete(null);
    } catch (error) {
      pushToast({
        title: "Ошибка",
        description: "Не удалось удалить скрипт",
        variant: "error",
      });
    }
  };

  const handleEditClick = (script: SalesScript) => {
    setSelectedScript(script);
    setEditDialogOpen(true);
  };

  const getScriptTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      greeting: "Приветствие",
      qualification: "Квалификация",
      presentation: "Презентация",
      objection_handling: "Работа с возражениями",
      closing: "Закрытие сделки",
    };
    return labels[type] || type;
  };

  const filteredScripts = scripts.filter((script) => {
    const matchesSearch = script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || script.scriptType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Скрипты продаж</h1>
          <p className="text-sm text-gray-500 mt-1">
            Управляйте скриптами для общения с клиентами
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Создать скрипт
        </Button>
      </div>

      {/* Фильтры */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Поиск по названию или содержимому..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">Все типы</option>
          <option value="greeting">Приветствие</option>
          <option value="qualification">Квалификация</option>
          <option value="presentation">Презентация</option>
          <option value="objection_handling">Работа с возражениями</option>
          <option value="closing">Закрытие сделки</option>
        </select>
      </div>

      <LoadingOverlay loading={isLoading}>
        {filteredScripts.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">
              {scripts.length === 0
                ? "Скрипты не созданы"
                : "Не найдено скриптов по заданным критериям"}
            </p>
            {scripts.length === 0 && (
              <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Создать первый скрипт
              </Button>
            )}
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Этап воронки</TableHead>
                  <TableHead>Эффективность</TableHead>
                  <TableHead>Использований</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScripts.map((script) => (
                  <TableRow key={script.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{script.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {script.content.substring(0, 100)}
                          {script.content.length > 100 ? "..." : ""}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getScriptTypeLabel(script.scriptType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {script.pipelineStageId ? "Привязан" : "Не привязан"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{
                              width: `${script.effectivenessScore * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {(script.effectivenessScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {script.usageCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(script)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(script)}
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

      {/* Диалог создания скрипта */}
      <CreateScriptDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        agentId={agentId}
        onSuccess={() => {
          setCreateDialogOpen(false);
          refreshScripts();
        }}
      />

      {/* Диалог редактирования скрипта */}
      {selectedScript && (
        <EditScriptDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          agentId={agentId}
          script={selectedScript}
          onSuccess={() => {
            setEditDialogOpen(false);
            setSelectedScript(null);
            refreshScripts();
          }}
        />
      )}

      {/* Диалог подтверждения удаления */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Удалить скрипт?"
        description={`Вы уверены, что хотите удалить скрипт "${scriptToDelete?.title}"? Это действие нельзя отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

