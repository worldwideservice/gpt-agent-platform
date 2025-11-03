"use client";

/**
 * Страница редактирования Knowledge Category (Категории)
 * Использует Refine для работы с данными
 */

import { useForm } from "@refinedev/react-hook-form";
import { useNavigation, useList, useOne } from "@refinedev/core";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Label } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { useToast } from "@/components/ui";

// Схема валидации (та же, что и в Create)
const updateCategorySchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  parentId: z.string().uuid().nullable().optional(),
});

type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;

export default function EditKnowledgeCategoryPage() {
  const params = useParams();
  const tenantId = (params?.tenantId as string) || "";
  const categoryId = (params?.id as string) || "";
  const { list } = useNavigation();
  const { push: pushToast } = useToast();

  // Получаем список категорий для выбора родительской (исключая текущую категорию)
  const { result: categoriesResult } = useList({
    resource: "knowledge-categories",
  });

  const categories =
    categoriesResult?.data?.filter((cat: any) => cat.id !== categoryId) || [];

  // Загружаем данные категории для редактирования
  const { result: categoryResult, query: categoryQuery } = useOne({
    resource: "knowledge-categories",
    id: categoryId,
  });

  const categoryData = categoryResult?.data;
  const isLoadingCategory = categoryQuery.isLoading;

  // Форма редактирования
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(updateCategorySchema),
    refineCoreProps: {
      resource: "knowledge-categories",
      id: categoryId,
      action: "edit",
      redirect: false,
      onMutationSuccess: () => {
        pushToast({
          title: "Категория сохранена",
          description: "Изменения успешно сохранены",
          variant: "success",
        });
        list("knowledge-categories");
      },
      onMutationError: () => {
        pushToast({
          title: "Ошибка",
          description: "Не удалось сохранить изменения",
          variant: "error",
        });
      },
    },
  });
  const parentId = watch("parentId");

  // Загружаем данные категории
  if (isLoadingCategory) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Загрузка...</div>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-red-500">Категория не найдена</p>
          <Link href={`/manage/${tenantId}/knowledge-categories`}>
            <Button variant="outline" className="mt-4">
              Вернуться к списку
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Заголовок */}
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/manage/${tenantId}/knowledge-categories`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Редактировать категорию</h1>
          <nav className="text-sm text-gray-500 mt-1">
            Категории → {categoryData?.name || "Редактировать"} → Редактировать
          </nav>
        </div>
      </div>

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
            defaultValue={categoryData?.parentId || "none"}
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
            defaultValue={categoryData?.name || ""}
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
            defaultValue={categoryData?.description || ""}
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
            {formLoading ? "Сохранение..." : "Сохранить"}
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
    </div>
  );
}

