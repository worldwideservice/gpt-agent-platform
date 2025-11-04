"use client";

/**
 * Страница создания Knowledge Category (Категории)
 * Использует Refine для работы с данными
 */

import { useForm } from "@refinedev/react-hook-form";
import { useNavigation, useList } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Label } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { useToast } from "@/components/ui";
import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";

// Схема валидации
const createCategorySchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  parentId: z.string().uuid().nullable().optional(),
});

type CreateCategoryFormData = z.infer<typeof createCategorySchema>;

export default function CreateKnowledgeCategoryPage() {
  const { list } = useNavigation();
  const { push: pushToast } = useToast();

  // Получаем список категорий для выбора родительской
  const { result: categoriesResult } = useList({
    resource: "knowledge-categories",
  });

  const categories = categoriesResult?.data || [];

  // Форма создания
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(createCategorySchema),
    refineCoreProps: {
      resource: "knowledge-categories",
      action: "create",
      redirect: false,
      onMutationSuccess: () => {
        pushToast({
          title: "Категория создана",
          description: "Категория успешно создана",
          variant: "success",
        });
        list("knowledge-categories");
      },
      onMutationError: () => {
        pushToast({
          title: "Ошибка",
          description: "Не удалось создать категорию",
          variant: "error",
        });
      },
    },
    defaultValues: {
      name: "",
      description: "",
      parentId: null,
    },
  });

  const parentId = watch("parentId");

  return (
    <div className="p-6">
      <CreateView>
        <CreateViewHeader resource="knowledge-categories" title="Создать категорию" />
        
        <LoadingOverlay loading={formLoading}>
          {/* Форма */}
          <form onSubmit={handleSubmit(onFinish)} className="max-w-2xl space-y-6">
        {/* Родительская категория */}
        <div className="space-y-2">
          <Label htmlFor="parentId">Родительская категория</Label>
          <Select
            value={parentId || "none"}
            onValueChange={(value) =>
              setValue("parentId", value === "none" ? null : value, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="parentId">
              <SelectValue placeholder="Выберите родительскую категорию" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Без родительской категории</SelectItem>
              {categories.map((category: any) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.parentId && (
            <p className="text-sm text-red-500">
              {typeof errors.parentId.message === "string"
                ? errors.parentId.message
                : "Ошибка в поле родительской категории"}
            </p>
          )}
        </div>

        {/* Название */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Заголовок <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Заголовок*"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500">
              {typeof errors.name.message === "string"
                ? errors.name.message
                : "Поле обязательно для заполнения"}
            </p>
          )}
        </div>

        {/* Описание */}
        <div className="space-y-2">
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Описание категории"
            rows={4}
          />
          {errors.description && (
            <p className="text-sm text-red-500">
              {typeof errors.description.message === "string"
                ? errors.description.message
                : "Ошибка в поле описания"}
            </p>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" disabled={formLoading}>
            {formLoading ? "Создание..." : "Создать"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => list("knowledge-categories")}
            disabled={formLoading}
          >
            Отмена
          </Button>
        </div>
      </form>
      </LoadingOverlay>
      </CreateView>
    </div>
  );
}

