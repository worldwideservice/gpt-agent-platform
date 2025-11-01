"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

import {
  KwidButton,
  KwidInput,
  KwidSelect,
  KwidTextarea,
  KwidSection,
} from "@/components/kwid";

import type { KnowledgeBaseCategory } from "@/types";

interface CategoryFormProps {
  categoryId: string;
  initialCategory?: KnowledgeBaseCategory | null;
  categories: KnowledgeBaseCategory[];
}

export const CategoryForm = ({
  categoryId,
  initialCategory,
  categories,
}: CategoryFormProps) => {
  const router = useRouter();
  const isNew = categoryId === "new";

  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: initialCategory?.name ?? "",
    description: initialCategory?.description ?? "",
    parentId: initialCategory?.parentId ?? "",
  });

  useEffect(() => {
    if (initialCategory) {
      setFormData({
        name: initialCategory.name,
        description: initialCategory.description ?? "",
        parentId: initialCategory.parentId ?? "",
      });
    }
  }, [initialCategory]);

  const parentOptions = [
    { value: "", label: "Без родительской категории" },
    ...categories
      .filter((category) => category.id !== categoryId)
      .map((category) => ({
        value: category.id,
        label: category.name,
      })),
  ];

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Название категории обязательно");
      return;
    }

    setIsSaving(true);

    try {
      const url = isNew
        ? "/api/knowledge-base/categories"
        : `/api/knowledge-base/categories/${categoryId}`;
      const method = isNew ? "POST" : "PATCH";

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        parentId: formData.parentId || null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Не удалось сохранить категорию");
      }

      const result = (await response.json()) as {
        success: boolean;
        data: KnowledgeBaseCategory;
      };

      if (!result.success) {
        throw new Error("Не удалось сохранить категорию");
      }

      router.push("/knowledge-base/categories");
    } catch (error) {
      console.error("Failed to save category", error);
      alert("Не удалось сохранить категорию. Попробуйте еще раз.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <KwidSection
        title={isNew ? "Создание категории" : `Редактирование категории`}
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => router.push("/knowledge-base/categories")}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-custom-600 dark:text-gray-400 dark:hover:text-custom-400"
              >
                <ArrowLeft className="h-4 w-4" /> Назад к списку
              </button>

              <div className="space-y-2">
                <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  <Link
                    href="/knowledge-base/categories"
                    className="font-semibold text-custom-600 hover:underline dark:text-custom-400"
                  >
                    Категории
                  </Link>
                  <span>/</span>
                  <span className="font-semibold text-gray-500 dark:text-gray-400">
                    {isNew
                      ? "Новая категория"
                      : (initialCategory?.name ?? "Редактирование")}
                  </span>
                </nav>
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                  {isNew ? "Создание категории" : `Редактирование категории`}
                </h1>
                <p className="max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  Создайте категорию для организации статей базы знаний
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <KwidButton
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                variant="primary"
                size="md"
              >
                <Save className="mr-2 h-4 w-4" />{" "}
                {isSaving ? "Сохранение…" : "Сохранить"}
              </KwidButton>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <KwidSection
              title="Основная информация"
              description="Заполните данные категории"
            >
              <div className="space-y-4">
                <KwidInput
                  label="Название категории*"
                  placeholder="Например: FAQ, Документация, Политика"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />

                <KwidSelect
                  label="Родительская категория"
                  value={formData.parentId ?? ""}
                  onChange={(value: string) =>
                    setFormData((prev) => ({ ...prev, parentId: value }))
                  }
                  options={parentOptions}
                />

                <KwidTextarea
                  label="Описание"
                  placeholder="Описание категории (необязательно)"
                  rows={6}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </KwidSection>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Информация
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Категории помогают организовать статьи базы знаний. Вы можете
                создавать подкатегории, назначая родительскую категорию.
              </p>
            </div>
          </div>
        </div>
      </KwidSection>
    </div>
  );
};
