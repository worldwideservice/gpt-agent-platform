/**
 * Определение ресурсов для Refine
 * Соответствует структуре Kwid сервиса
 */

import type { ResourceProps } from "@refinedev/core";

export const resources: ResourceProps[] = [
  {
    name: "agents",
    list: "/ai-agents",
    create: "/ai-agents/create",
    edit: "/ai-agents/:id/edit",
    show: "/ai-agents/:id",
    meta: {
      label: "Агенты ИИ",
      icon: "Bot",
    },
  },
  {
    name: "knowledge-items",
    list: "/knowledge-items",
    create: "/knowledge-items/create",
    edit: "/knowledge-items/:id/edit",
    show: "/knowledge-items/:id",
    meta: {
      label: "Статьи",
      icon: "FileText",
      parent: "knowledge-base",
    },
  },
  {
    name: "knowledge-categories",
    list: "/knowledge-categories",
    create: "/knowledge-categories/create",
    edit: "/knowledge-categories/:id/edit",
    show: "/knowledge-categories/:id",
    meta: {
      label: "Категории",
      icon: "Folder",
      parent: "knowledge-base",
    },
  },
];





















