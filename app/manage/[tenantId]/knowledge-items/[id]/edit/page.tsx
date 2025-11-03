"use client";

/**
 * Страница редактирования Knowledge Item (Статья)
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
import { Switch } from "@/components/ui";
import { useToast } from "@/components/ui";

// Схема валидации
const updateArticleSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  content: z.string().min(1, "Содержание обязательно"),
  categoryId: z.string().uuid().nullable().optional(),
  slug: z.string().optional(),
  isPublished: z.boolean().optional(),
});

type UpdateArticleFormData = z.infer<typeof updateArticleSchema>;

export default function EditKnowledgeItemPage() {
  const params = useParams();
  const tenantId = (params?.tenantId as string) || "";
  const articleId = (params?.id as string) || "";
  const { list } = useNavigation();
  const { push: pushToast } = useToast();

  // Получаем список категорий для выбора
  const { result: categoriesResult } = useList({
    resource: "knowledge-categories",
  });

  const categories = categoriesResult?.data || [];

  // Загружаем данные статьи для редактирования
  const { result: articleResult, query: articleQuery } = useOne({
    resource: "knowledge-items",
    id: articleId,
  });

  const articleData = articleResult?.data;
  const isLoadingArticle = articleQuery.isLoading;

  // Форма редактирования
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(updateArticleSchema),
    refineCoreProps: {
      resource: "knowledge-items",
      id: articleId,
      action: "edit",
      redirect: false,
      onMutationSuccess: () => {
        pushToast({
          title: "Статья сохранена",
          description: "Изменения успешно сохранены",
          variant: "success",
        });
        list("knowledge-items");
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

  const categoryId = watch("categoryId");
  const isPublished = watch("isPublished");

  // Загружаем данные статьи
  if (isLoadingArticle) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Загрузка...</div>
      </div>
    );
  }

  if (!articleData) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-red-500">Статья не найдена</p>
          <Link href={`/manage/${tenantId}/knowledge-items`}>
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
        <Link href={`/manage/${tenantId}/knowledge-items`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Редактировать статью</h1>
          <nav className="text-sm text-gray-500 mt-1">
            Статьи → {articleData.title || "Редактировать"} → Редактировать
          </nav>
        </div>
      </div>

      {/* Форма */}
      <form onSubmit={handleSubmit(onFinish)} className="max-w-4xl space-y-6">
        {/* Категория */}
        <div className="space-y-2">
          <Label htmlFor="categoryId">Категория</Label>
          <Select
            value={categoryId || "none"}
            onValueChange={(value) =>
              setValue("categoryId", value === "none" ? null : value, {
                shouldValidate: true,
              })
            }
            defaultValue={articleData?.categoryId || "none"}
          >
            <SelectTrigger id="categoryId">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Без категории</SelectItem>
              {categories.map((category: any) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-red-500">
              {typeof errors.categoryId.message === "string"
                ? errors.categoryId.message
                : "Ошибка в поле категории"}
            </p>
          )}
        </div>

        {/* Название */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Название <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Название*"
            defaultValue={articleData?.title || ""}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-sm text-red-500">
              {typeof errors.title.message === "string"
                ? errors.title.message
                : "Поле обязательно для заполнения"}
            </p>
          )}
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">URL (Slug)</Label>
          <Input
            id="slug"
            {...register("slug")}
            placeholder="url-slug (необязательно)"
            defaultValue={articleData?.slug || ""}
          />
          <p className="text-xs text-gray-500">
            Если не указано, будет сгенерировано автоматически из названия
          </p>
        </div>

        {/* Содержание */}
        <div className="space-y-2">
          <Label htmlFor="content">
            Содержание <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="content"
            {...register("content")}
            placeholder="Содержание статьи*"
            rows={12}
            defaultValue={articleData?.content || ""}
            className={errors.content ? "border-red-500" : ""}
          />
          {errors.content && (
            <p className="text-sm text-red-500">
              {typeof errors.content.message === "string"
                ? errors.content.message
                : "Поле обязательно для заполнения"}
            </p>
          )}
        </div>

        {/* Опубликовано */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublished"
              checked={isPublished}
              onCheckedChange={(checked) => setValue("isPublished", checked)}
              defaultChecked={articleData?.isPublished || false}
            />
            <Label htmlFor="isPublished" className="cursor-pointer">
              Опубликовано
            </Label>
          </div>
          <p className="text-xs text-gray-500">
            Опубликованные статьи будут доступны в базе знаний
          </p>
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" disabled={formLoading}>
            {formLoading ? "Сохранение..." : "Сохранить"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => list("knowledge-items")}
            disabled={formLoading}
          >
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
}

