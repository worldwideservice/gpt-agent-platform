"use client";

/**
 * Draggable компонент для условия правила
 */

import { useState } from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";

interface Condition {
  type: string;
  field?: string;
  operator?: string;
  value?: string;
  timeUnit?: string;
  timeValue?: number;
}

interface DraggableConditionProps {
  condition: Condition;
  index: number;
  onUpdate: (index: number, updates: Partial<Condition>) => void;
  onRemove: (index: number) => void;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  onDragOver: (index: number) => void;
  isDragging: boolean;
}

const CONDITION_TYPES = [
  { value: "field_value", label: "Значение поля" },
  { value: "stage_changed", label: "Смена этапа" },
  { value: "time_elapsed", label: "Прошло времени" },
  { value: "event_triggered", label: "Событие" },
];

const CONDITION_OPERATORS = [
  { value: "equals", label: "Равно" },
  { value: "contains", label: "Содержит" },
  { value: "greater_than", label: "Больше" },
  { value: "less_than", label: "Меньше" },
  { value: "changed_to", label: "Изменилось на" },
  { value: "not_empty", label: "Не пусто" },
];

export function DraggableCondition({
  condition,
  index,
  onUpdate,
  onRemove,
  onDragStart,
  onDragEnd,
  isDragging,
}: DraggableConditionProps) {
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
          <span className="text-sm font-medium">Условие {index + 1}</span>
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
          <Label>Тип условия</Label>
          <Select
            value={condition.type}
            onValueChange={(value) => onUpdate(index, { type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONDITION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {condition.type === "field_value" && (
          <>
            <div className="space-y-2">
              <Label>Оператор</Label>
              <Select
                value={condition.operator}
                onValueChange={(value) => onUpdate(index, { operator: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPERATORS.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Поле</Label>
              <Input
                value={condition.field || ""}
                onChange={(e) => onUpdate(index, { field: e.target.value })}
                placeholder="Название поля"
              />
            </div>

            <div className="space-y-2">
              <Label>Значение</Label>
              <Input
                value={condition.value || ""}
                onChange={(e) => onUpdate(index, { value: e.target.value })}
                placeholder="Значение"
              />
            </div>
          </>
        )}

        {condition.type === "time_elapsed" && (
          <>
            <div className="space-y-2">
              <Label>Количество</Label>
              <Input
                type="number"
                value={condition.timeValue || ""}
                onChange={(e) =>
                  onUpdate(index, { timeValue: Number(e.target.value) })
                }
                placeholder="Количество"
              />
            </div>

            <div className="space-y-2">
              <Label>Единица времени</Label>
              <Select
                value={condition.timeUnit}
                onValueChange={(value) => onUpdate(index, { timeUnit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Минуты</SelectItem>
                  <SelectItem value="hours">Часы</SelectItem>
                  <SelectItem value="days">Дни</SelectItem>
                  <SelectItem value="weeks">Недели</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>
    </div>
  );
}






