# Маппинг Kwid → Refine + Shadcn UI

> Документ для преобразования архитектуры Kwid в структуру на основе Refine.dev + Shadcn UI  
> Дата: 2025-01-XX

## Общая архитектура

### Технологический стек
- **Framework:** Next.js 14 App Router
- **UI Framework:** Refine.dev + Shadcn UI
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **API:** Next.js API Routes (уже существуют)

---

## Структура файлов

```
app/
├── manage/[tenantId]/
│   ├── layout.tsx              # Refine Provider wrapper
│   ├── page.tsx                # Dashboard
│   ├── ai-agents/
│   │   ├── page.tsx           # List (Refine List)
│   │   ├── create/
│   │   │   └── page.tsx       # Create (Refine Create)
│   │   └── [id]/
│   │       ├── edit/
│   │       │   └── page.tsx  # Edit (Refine Edit)
│   │       └── show/
│   │           └── page.tsx  # Show (Refine Show, опционально)
│   ├── knowledge-items/
│   │   ├── page.tsx
│   │   ├── create/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx
│   ├── knowledge-categories/
│   │   ├── page.tsx
│   │   ├── create/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx
│   ├── test-chat/
│   │   └── page.tsx
│   ├── account-settings/
│   │   └── page.tsx
│   └── pricing/
│       └── page.tsx

components/
├── layout/
│   ├── Header.tsx              # Уже существует (упростить)
│   ├── Sidebar.tsx             # Уже существует (расширить)
│   └── Layout.tsx              # Обертка для Refine
├── refine/
│   ├── providers.tsx          # Refine providers конфигурация
│   └── resources.ts           # Определение resources
└── ui/                        # Shadcn UI компоненты (уже есть)

lib/
├── providers/
│   ├── data-provider.ts       # Custom data provider для API
│   └── auth-provider.ts       # NextAuth integration
```

---

## Refine Resources

### 1. AI Agents Resource

```typescript
{
  name: "ai-agents",
  list: "/manage/[tenantId]/ai-agents",
  create: "/manage/[tenantId]/ai-agents/create",
  edit: "/manage/[tenantId]/ai-agents/:id/edit",
  show: "/manage/[tenantId]/ai-agents/:id", // опционально
  meta: {
    label: "Агенты ИИ",
    icon: "Bot", // lucide-react icon
  },
}
```

**API Endpoints:**
- `GET /api/agents` - список
- `POST /api/agents` - создание
- `GET /api/agents/:id` - получение
- `PUT /api/agents/:id` - обновление
- `DELETE /api/agents/:id` - удаление

**Custom Actions:**
- `POST /api/agents/:id/copy` - копирование

---

### 2. Knowledge Items Resource

```typescript
{
  name: "knowledge-items",
  list: "/manage/[tenantId]/knowledge-items",
  create: "/manage/[tenantId]/knowledge-items/create",
  edit: "/manage/[tenantId]/knowledge-items/:id/edit",
  meta: {
    label: "Статьи",
    icon: "FileText",
    parent: "knowledge-base",
  },
}
```

**API Endpoints:**
- `GET /api/knowledge-items`
- `POST /api/knowledge-items`
- `GET /api/knowledge-items/:id`
- `PUT /api/knowledge-items/:id`
- `DELETE /api/knowledge-items/:id`

---

### 3. Knowledge Categories Resource

```typescript
{
  name: "knowledge-categories",
  list: "/manage/[tenantId]/knowledge-categories",
  create: "/manage/[tenantId]/knowledge-categories/create",
  edit: "/manage/[tenantId]/knowledge-categories/:id/edit",
  meta: {
    label: "Категории",
    icon: "Folder",
    parent: "knowledge-base",
  },
}
```

**API Endpoints:**
- `GET /api/knowledge-categories`
- `POST /api/knowledge-categories`
- `GET /api/knowledge-categories/:id`
- `PUT /api/knowledge-categories/:id`
- `DELETE /api/knowledge-categories/:id`

---

## Маппинг страниц

### Dashboard

**Файл:** `app/manage/[tenantId]/page.tsx`

**Refine:** Не использует Refine (кастомная страница)

**Компоненты:**
- Статистические карточки (Shadcn Card)
- Графики (Recharts или Chart.js)
- Запрос данных через `useQuery` (TanStack Query)

**API:**
- `GET /api/dashboard/stats`

---

### AI Agents List

**Файл:** `app/manage/[tenantId]/ai-agents/page.tsx`

**Refine Component:** `RefineList`

**Особенности:**
- Таблица с колонками: Checkbox, Название, Активно (Switch), Модель ИИ, Actions
- Поиск (Refine built-in)
- Массовые действия (Refine bulk actions)
- Кнопка "Переключить столбцы" (custom)

**Код:**
```typescript
<List>
  <Table>
    <Column title="Название" dataIndex="name" />
    <Column title="Активно" dataIndex="active" render={(value) => <Switch checked={value} />} />
    <Column title="Модель ИИ" dataIndex="model" />
  </Table>
</List>
```

---

### AI Agents Create

**Файл:** `app/manage/[tenantId]/ai-agents/create/page.tsx`

**Refine Component:** `RefineCreate`

**Форма:**
- Поле "Название" (обязательное)
- Кнопки: "Создать", "Создать и Создать еще", "Отмена"

**Код:**
```typescript
<Create>
  <Form>
    <FormItem name="name" rules={[{ required: true }]}>
      <Input placeholder="Название*" />
    </FormItem>
    <FormFooter>
      <Button type="submit">Создать</Button>
      <Button type="submit" onClick={handleCreateAndContinue}>
        Создать и Создать еще
      </Button>
      <Button variant="outline" onClick={() => router.back()}>
        Отмена
      </Button>
    </FormFooter>
  </Form>
</Create>
```

---

### AI Agents Edit

**Файл:** `app/manage/[tenantId]/ai-agents/[id]/edit/page.tsx`

**Refine Component:** `RefineEdit`

**Особенности:**
- Множество вкладок (Tabs от Shadcn)
- Сложная форма с множеством секций
- Вложенные формы (Pipeline settings)

**Структура:**
```typescript
<Edit>
  <Tabs defaultValue="basic">
    <TabsList>
      <TabsTrigger value="basic">Основные</TabsTrigger>
      <TabsTrigger value="deals">Сделки и контакты</TabsTrigger>
      <TabsTrigger value="triggers">Триггеры</TabsTrigger>
      <TabsTrigger value="chains">Цепочки</TabsTrigger>
      <TabsTrigger value="integrations">Интеграции</TabsTrigger>
      <TabsTrigger value="advanced">Дополнительно</TabsTrigger>
    </TabsList>
    
    <TabsContent value="basic">
      <Form>
        {/* Основные поля */}
      </Form>
    </TabsContent>
    
    {/* Другие вкладки */}
  </Tabs>
</Edit>
```

---

### Knowledge Items List

**Файл:** `app/manage/[tenantId]/knowledge-items/page.tsx`

**Refine Component:** `RefineList`

**Особенности:**
- Фильтры (Refine Filters)
- Поиск
- Переключение столбцов (custom)

**Код:**
```typescript
<List
  filters={[
    {
      field: "category",
      operator: "eq",
      value: undefined,
    },
  ]}
>
  <Table />
</List>
```

---

## Data Provider

**Файл:** `lib/providers/data-provider.ts`

**Задача:**
Подключить существующие API endpoints к Refine

```typescript
import { DataProvider } from "@refinedev/core";

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    // Вызов /api/${resource}
    // Преобразование в формат Refine
  },
  
  create: async ({ resource, variables }) => {
    // POST /api/${resource}
  },
  
  update: async ({ resource, id, variables }) => {
    // PUT /api/${resource}/${id}
  },
  
  deleteOne: async ({ resource, id }) => {
    // DELETE /api/${resource}/${id}
  },
  
  getOne: async ({ resource, id }) => {
    // GET /api/${resource}/${id}
  },
  
  custom: async ({ url, method, payload, headers }) => {
    // Для кастомных операций (copy, sync CRM, etc.)
  },
};
```

---

## Auth Provider

**Файл:** `lib/providers/auth-provider.ts`

**Задача:**
Интеграция NextAuth с Refine

```typescript
import { AuthProvider } from "@refinedev/core";
import { signIn, signOut, getSession } from "next-auth/react";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    if (result?.error) {
      return {
        success: false,
        error: { message: result.error },
      };
    }
    
    return {
      success: true,
      redirectTo: "/manage/[tenantId]",
    };
  },
  
  logout: async () => {
    await signOut({ redirectTo: "/login" });
    return { success: true };
  },
  
  check: async () => {
    const session = await getSession();
    return {
      authenticated: !!session,
      redirectTo: session ? undefined : "/login",
    };
  },
  
  getIdentity: async () => {
    const session = await getSession();
    return session?.user || null;
  },
  
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
```

---

## Refine Provider Setup

**Файл:** `app/manage/[tenantId]/layout.tsx`

```typescript
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { dataProvider } from "@/lib/providers/data-provider";
import { authProvider } from "@/lib/providers/auth-provider";
import { resources } from "@/components/refine/resources";

export default function ManageLayout({ children, params }) {
  return (
    <RefineKbarProvider>
      <Refine
        dataProvider={dataProvider}
        authProvider={authProvider}
        resources={resources}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
        }}
      >
        {children}
        <RefineKbar />
      </Refine>
    </RefineKbarProvider>
  );
}
```

---

## Sidebar Integration

**Файл:** `components/layout/Sidebar.tsx`

**Задача:**
Расширить существующий Sidebar, используя Refine resources для генерации меню

```typescript
import { useMenu } from "@refinedev/core";
import { useResources } from "@refinedev/core";

export const Sidebar = () => {
  const { resources } = useResources();
  
  return (
    <aside>
      {/* Logo */}
      <nav>
        {resources.map((resource) => (
          <NavItem
            key={resource.name}
            href={resource.list}
            icon={resource.meta?.icon}
            label={resource.meta?.label}
          />
        ))}
      </nav>
    </aside>
  );
};
```

---

## Кастомные компоненты для Shadcn UI

### Switch компонент

**Уже существует:** `components/ui/switch.tsx`

**Использование в Refine:**
```typescript
<Column
  title="Активно"
  render={(record) => (
    <Switch
      checked={record.active}
      onCheckedChange={(checked) => {
        // Обновить через Refine
      }}
    />
  )}
/>
```

### Tabs компонент

**Уже существует:** `components/ui/tabs.tsx`

**Использование:**
```typescript
<Tabs defaultValue="basic">
  <TabsList>
    <TabsTrigger value="basic">Основные</TabsTrigger>
  </TabsList>
  <TabsContent value="basic">
    {/* Контент */}
  </TabsContent>
</Tabs>
```

---

## Массовые действия

**Реализация:**

```typescript
import { useSelect, useDeleteMany } from "@refinedev/core";

const { selectProps } = useSelect();
const { mutate: deleteMany } = useDeleteMany();

<Table
  rowSelection={{
    type: "checkbox",
    ...selectProps,
  }}
>
  {/* Колонки */}
</Table>

{/* Кнопка удаления выбранных */}
<Button
  onClick={() => {
    deleteMany({
      resource: "ai-agents",
      ids: selectedRowKeys,
    });
  }}
>
  Удалить выбранные
</Button>
```

---

## Фильтры

**Реализация:**

```typescript
import { useSelect } from "@refinedev/core";

<FilterDrawer>
  <FormItem name="category">
    <Select
      placeholder="Выберите категорию"
      options={categories}
    />
  </FormItem>
</FilterDrawer>
```

---

## Поиск

**Refine встроенный:**

```typescript
<List
  headerButtons={[
    <SearchInput key="search" />,
  ]}
>
  {/* Таблица */}
</List>
```

---

## Пагинация

**Refine встроенная:**

```typescript
<List pagination={{ pageSize: 10 }}>
  {/* Таблица */}
</List>
```

---

## Копирование агента

**Custom Action:**

```typescript
import { useCustom } from "@refinedev/core";

const { mutate: copyAgent } = useCustom();

<Button
  onClick={() => {
    copyAgent({
      url: `/api/agents/${id}/copy`,
      method: "post",
    });
  }}
>
  Копировать
</Button>
```

---

## Синхронизация с CRM

**Custom Action:**

```typescript
const { mutate: syncCRM } = useCustom();

<Button
  onClick={() => {
    syncCRM({
      url: "/api/crm/sync",
      method: "post",
      values: {
        resource: "pipelines", // или "channels"
      },
    });
  }}
>
  Синхронизировать настройки CRM
</Button>
```

---

## Breadcrumbs

**Refine встроенные:**

```typescript
<Breadcrumb>
  <BreadcrumbItem href="/manage/[tenantId]">
    Главная
  </BreadcrumbItem>
  <BreadcrumbItem href="/manage/[tenantId]/ai-agents">
    Агенты ИИ
  </BreadcrumbItem>
  <BreadcrumbItem>Создать</BreadcrumbItem>
</Breadcrumb>
```

---

## Следующие шаги

1. ✅ Установить Refine packages:
   ```bash
   npm install @refinedev/core @refinedev/nextjs-router @refinedev/shadcn-ui
   ```

2. ✅ Настроить data provider для существующих API endpoints

3. ✅ Настроить auth provider с NextAuth

4. ✅ Создать resources конфигурацию

5. ✅ Обновить Sidebar для использования Refine resources

6. ✅ Реализовать страницы с Refine компонентами

7. ✅ Добавить кастомные действия (copy, sync CRM)

8. ✅ Настроить фильтры и поиск

9. ✅ Добавить валидацию форм

10. ✅ Реализовать массовые действия

---

## Преимущества использования Refine

1. **Автоматический CRUD** - минимум кода для базовых операций
2. **Встроенные компоненты** - таблицы, формы, фильтры, поиск
3. **TypeScript** - полная типизация
4. **Гибкость** - можно кастомизировать любую часть
5. **Shadcn UI интеграция** - красивые компоненты из коробки
6. **React Query** - автоматическое кэширование и инвалидация
7. **Массовые действия** - встроенная поддержка
8. **Пагинация и сортировка** - автоматическая

---

## Примечания

- Некоторые страницы (Dashboard, Test Chat, Account Settings, Pricing) не используют Refine - это кастомные страницы
- Сложные формы (Edit Agent) требуют кастомизации через Tabs и вложенные формы
- Custom actions (copy, sync) реализуются через `useCustom` hook
- Фильтры требуют настройки в data provider для корректной работы с API



