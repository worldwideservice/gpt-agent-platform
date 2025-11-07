"use client";

/**
 * Draggable компонент для шага последовательности
 */

import { useState } from "react";
import { GripVertical, Trash2, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Label } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";

interface SequenceStep {
  step_order: number;
  delay_minutes: number;
  action_type: string;
  template?: string;
  recipient?: string;
  webhook_url?: string;
  ai_prompt?: string;
  task_title?: string;
  task_description?: string;
  kommo_action?: {
    type: string;
    data: Record<string, any>;
    entity_id?: number;
    entity_type?: string;
  };
  metadata?: Record<string, any>;
}

interface DraggableSequenceStepProps {
  step: SequenceStep;
  index: number;
  onUpdate: (index: number, updates: Partial<SequenceStep>) => void;
  onRemove: (index: number) => void;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isLast: boolean;
}

const ACTION_TYPES = [
  { value: "send_message", label: "Отправить сообщение" },
  { value: "create_task", label: "Создать задачу" },
  { value: "send_email", label: "Отправить email" },
  { value: "webhook", label: "Webhook" },
  { value: "ai_response", label: "AI ответ" },
  { value: "wait", label: "Ожидание" },
  { value: "kommo_action", label: "Действие в Kommo" },
];

export function DraggableSequenceStep({
  step,
  index,
  onUpdate,
  onRemove,
  onDragStart,
  onDragEnd,
  isDragging,
  isLast,
}: DraggableSequenceStepProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <div
        draggable
        onDragStart={() => onDragStart(index)}
        onDragEnd={onDragEnd}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          border rounded-lg p-4 space-y-3 transition-all relative
          ${isDragging ? "opacity-50 border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}
          ${isHovered ? "shadow-md border-gray-300" : ""}
          cursor-move
        `}
      >
        {/* Индикатор соединения */}
        {!isLast && (
          <div className="absolute left-6 top-full w-0.5 h-4 bg-gray-300 z-0" />
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="h-5 w-5 text-gray-400 cursor-grab active:cursor-grabbing" />
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                {step.step_order}
              </div>
              <span className="text-sm font-medium">Шаг {step.step_order}</span>
            </div>
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

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Тип действия</Label>
            <Select
              value={step.action_type}
              onValueChange={(value) => onUpdate(index, { action_type: value })}
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

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Задержка (минуты)
            </Label>
            <Input
              type="number"
              min={0}
              value={step.delay_minutes}
              onChange={(e) =>
                onUpdate(index, { delay_minutes: Number(e.target.value) })
              }
              placeholder="0"
            />
          </div>
        </div>

        {step.action_type === "send_message" && (
          <div className="space-y-2">
            <Label>Шаблон сообщения</Label>
            <Textarea
              value={step.template || ""}
              onChange={(e) => onUpdate(index, { template: e.target.value })}
              placeholder="Текст сообщения"
              rows={3}
            />
          </div>
        )}

        {step.action_type === "create_task" && (
          <>
            <div className="space-y-2">
              <Label>Название задачи</Label>
              <Input
                value={step.task_title || ""}
                onChange={(e) => onUpdate(index, { task_title: e.target.value })}
                placeholder="Название задачи"
              />
            </div>
            <div className="space-y-2">
              <Label>Описание задачи</Label>
              <Textarea
                value={step.task_description || ""}
                onChange={(e) => onUpdate(index, { task_description: e.target.value })}
                placeholder="Описание задачи"
                rows={2}
              />
            </div>
          </>
        )}

        {step.action_type === "send_email" && (
          <>
            <div className="space-y-2">
              <Label>Получатель</Label>
              <Input
                value={step.recipient || ""}
                onChange={(e) => onUpdate(index, { recipient: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Текст письма</Label>
              <Textarea
                value={step.template || ""}
                onChange={(e) => onUpdate(index, { template: e.target.value })}
                placeholder="Текст письма"
                rows={3}
              />
            </div>
          </>
        )}

        {step.action_type === "webhook" && (
          <div className="space-y-2">
            <Label>URL Webhook</Label>
            <Input
              value={step.webhook_url || ""}
              onChange={(e) => onUpdate(index, { webhook_url: e.target.value })}
              placeholder="https://example.com/webhook"
            />
          </div>
        )}

        {step.action_type === "ai_response" && (
          <div className="space-y-2">
            <Label>Промпт для AI</Label>
            <Textarea
              value={step.ai_prompt || ""}
              onChange={(e) => onUpdate(index, { ai_prompt: e.target.value })}
              placeholder="Промпт для генерации ответа"
              rows={3}
            />
          </div>
        )}

        {step.action_type === "wait" && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              Ожидание {step.delay_minutes} минут перед следующим шагом
            </p>
          </div>
        )}

        {/* Визуализация задержки */}
        {step.delay_minutes > 0 && !isLast && (
          <div className="flex items-center gap-2 text-sm text-gray-500 pt-2 border-t">
            <Clock className="h-4 w-4" />
            <span>Задержка: {step.delay_minutes} мин.</span>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </div>
        )}
      </div>
    </div>
  );
}





