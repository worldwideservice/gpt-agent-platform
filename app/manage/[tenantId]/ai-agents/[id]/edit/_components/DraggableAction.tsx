"use client";

/**
 * Draggable компонент для действия правила
 */

import { useState } from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Label } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";

interface Action {
  type: string;
  template?: string;
  targetField?: string;
  newValue?: string;
  recipient?: string;
  webhookUrl?: string;
  aiPrompt?: string;
}

interface DraggableActionProps {
  action: Action;
  index: number;
  onUpdate: (index: number, updates: Partial<Action>) => void;
  onRemove: (index: number) => void;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

const ACTION_TYPES = [
  { value: "send_message", label: "Отправить сообщение" },
  { value: "change_stage", label: "Изменить этап" },
  { value: "create_task", label: "Создать задачу" },
  { value: "update_field", label: "Обновить поле" },
  { value: "send_email", label: "Отправить email" },
  { value: "webhook", label: "Webhook" },
  { value: "ai_response", label: "AI ответ" },
];

export function DraggableAction({
  action,
  index,
  onUpdate,
  onRemove,
  onDragStart,
  onDragEnd,
  isDragging,
}: DraggableActionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        border rounded-lg p-4 space-y-3 transition-all
        ${isDragging ? "opacity-50 border-blue-500 bg-blue-50" : "border-gray-200"}
        ${isHovered ? "shadow-md border-gray-300" : ""}
        cursor-move
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-gray-400 cursor-grab active:cursor-grabbing" />
          <span className="text-sm font-medium">Действие {index + 1}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label>Тип действия</Label>
          <Select
            value={action.type}
            onValueChange={(value) => onUpdate(index, { type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {action.type === "send_message" && (
          <div className="space-y-2">
            <Label>Шаблон сообщения</Label>
            <Textarea
              value={action.template || ""}
              onChange={(e) => onUpdate(index, { template: e.target.value })}
              placeholder="Текст сообщения"
              rows={3}
            />
          </div>
        )}

        {action.type === "create_task" && (
          <div className="space-y-2">
            <Label>Название задачи</Label>
            <Input
              value={action.template || ""}
              onChange={(e) => onUpdate(index, { template: e.target.value })}
              placeholder="Название задачи"
            />
          </div>
        )}

        {action.type === "update_field" && (
          <>
            <div className="space-y-2">
              <Label>Поле</Label>
              <Input
                value={action.targetField || ""}
                onChange={(e) => onUpdate(index, { targetField: e.target.value })}
                placeholder="Название поля"
              />
            </div>
            <div className="space-y-2">
              <Label>Новое значение</Label>
              <Input
                value={action.newValue || ""}
                onChange={(e) => onUpdate(index, { newValue: e.target.value })}
                placeholder="Значение"
              />
            </div>
          </>
        )}

        {action.type === "send_email" && (
          <>
            <div className="space-y-2">
              <Label>Получатель</Label>
              <Input
                value={action.recipient || ""}
                onChange={(e) => onUpdate(index, { recipient: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Текст письма</Label>
              <Textarea
                value={action.template || ""}
                onChange={(e) => onUpdate(index, { template: e.target.value })}
                placeholder="Текст письма"
                rows={3}
              />
            </div>
          </>
        )}

        {action.type === "webhook" && (
          <div className="space-y-2">
            <Label>URL Webhook</Label>
            <Input
              value={action.webhookUrl || ""}
              onChange={(e) => onUpdate(index, { webhookUrl: e.target.value })}
              placeholder="https://example.com/webhook"
            />
          </div>
        )}

        {action.type === "ai_response" && (
          <div className="space-y-2">
            <Label>Промпт для AI</Label>
            <Textarea
              value={action.aiPrompt || ""}
              onChange={(e) => onUpdate(index, { aiPrompt: e.target.value })}
              placeholder="Промпт для генерации ответа"
              rows={3}
            />
          </div>
        )}

        {action.type === "change_stage" && (
          <div className="space-y-2">
            <Label>Новый этап</Label>
            <Input
              value={action.newValue || ""}
              onChange={(e) => onUpdate(index, { newValue: e.target.value })}
              placeholder="ID этапа"
            />
          </div>
        )}
      </div>
    </div>
  );
}






