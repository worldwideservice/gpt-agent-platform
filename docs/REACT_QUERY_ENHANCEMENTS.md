# React Query - Дополнительные улучшения

Этот документ описывает все улучшения React Query, реализованные в проекте.

## 📋 Содержание

1. [React Query DevTools](#react-query-devtools)
2. [Optimistic Updates](#optimistic-updates)
3. [Infinite Scroll](#infinite-scroll)
4. [Offline Support](#offline-support)

---

## 🛠️ React Query DevTools

### Описание
React Query DevTools - это инструмент для отладки запросов и кеша React Query.

### Возможности
- Просмотр всех активных запросов
- Мониторинг состояния кеша
- Просмотр истории запросов
- Ручная инвалидация кеша
- Отладка в режиме реального времени

### Использование
DevTools автоматически подключается в development режиме:

```tsx
// Кнопка появится в правом нижнем углу приложения
// Нажмите на неё для открытия панели DevTools
```

### Настройки
В `components/providers/QueryClientProvider.tsx`:

```tsx
<ReactQueryDevtools
  initialIsOpen={false}           // Не открывать автоматически
  buttonPosition="bottom-right"   // Позиция кнопки
/>
```

---

## ⚡ Optimistic Updates

### Описание
Optimistic Updates позволяют мгновенно обновлять UI до получения ответа от сервера, улучшая UX.

### Реализованные мутации

#### 1. Создание статьи
```tsx
import { useCreateArticle } from '@/lib/hooks/useKnowledgeMutations'

function CreateArticleForm() {
  const createArticle = useCreateArticle()

  const handleSubmit = async (data) => {
    await createArticle.mutateAsync({
      tenantId: 'tenant-123',
      title: 'Новая статья',
      content: 'Содержание статьи',
    })
  }

  return (
    <button
      onClick={handleSubmit}
      disabled={createArticle.isPending}
    >
      {createArticle.isPending ? 'Создание...' : 'Создать'}
    </button>
  )
}
```

#### 2. Обновление статьи
```tsx
import { useUpdateArticle } from '@/lib/hooks/useKnowledgeMutations'

function EditArticleForm({ articleId, tenantId }) {
  const updateArticle = useUpdateArticle()

  const handleUpdate = async (data) => {
    await updateArticle.mutateAsync({
      tenantId,
      articleId,
      title: data.title,
      content: data.content,
    })
  }

  return (
    <button onClick={handleUpdate}>
      Обновить
    </button>
  )
}
```

#### 3. Удаление статьи
```tsx
import { useDeleteArticle } from '@/lib/hooks/useKnowledgeMutations'

function DeleteButton({ articleId, tenantId }) {
  const deleteArticle = useDeleteArticle()

  const handleDelete = async () => {
    await deleteArticle.mutateAsync({
      tenantId,
      articleId,
    })
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-500"
    >
      Удалить
    </button>
  )
}
```

### Как это работает

1. **onMutate**: Вызывается перед отправкой запроса
   - Отменяет текущие запросы (избегает race conditions)
   - Сохраняет предыдущее состояние
   - Оптимистично обновляет кеш

2. **onError**: Вызывается при ошибке
   - Откатывает изменения к сохраненному состоянию

3. **onSuccess**: Вызывается при успехе
   - Инвалидирует связанные запросы
   - Обновляет UI актуальными данными

---

## 📜 Infinite Scroll

### Описание
Infinite Scroll позволяет загружать данные по мере прокрутки страницы.

### Хуки для Infinite Scroll

#### useInfiniteArticles
```tsx
import { useInfiniteArticles } from '@/lib/hooks/useInfiniteKnowledge'

function ArticlesList({ tenantId }) {
  const {
    data,              // Все загруженные страницы
    fetchNextPage,     // Функция для загрузки следующей страницы
    hasNextPage,       // Есть ли еще данные
    isFetchingNextPage,// Загружается ли следующая страница
    isLoading,         // Первичная загрузка
  } = useInfiniteArticles(tenantId, {
    categoryId: 'cat-123',  // Опционально
    search: 'query',        // Опционально
    pageSize: 20,           // Количество элементов на странице
  })

  // Объединяем все страницы в один массив
  const allArticles = data?.pages.flatMap(page => page.articles) ?? []

  return (
    <div>
      {allArticles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
```

#### useInfiniteProcessingHistory
```tsx
import { useInfiniteProcessingHistory } from '@/lib/hooks/useInfiniteKnowledge'

function HistoryList({ tenantId }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProcessingHistory(tenantId, 15)

  const allItems = data?.pages.flatMap(page => page.items) ?? []

  return (
    <div>
      {allItems.map(item => (
        <HistoryItem key={item.id} item={item} />
      ))}
    </div>
  )
}
```

### Компонент InfiniteScroll

Готовый компонент для удобной работы:

```tsx
import { InfiniteScroll } from '@/components/ui/infinite-scroll'
import { useInfiniteArticles } from '@/lib/hooks/useInfiniteKnowledge'

function ArticlesList({ tenantId }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteArticles(tenantId)

  const articles = data?.pages.flatMap(page => page.articles) ?? []

  return (
    <InfiniteScroll
      onLoadMore={fetchNextPage}
      hasMore={hasNextPage ?? false}
      isLoading={isFetchingNextPage}
      threshold={200}                    // Отступ для триггера загрузки
      endMessage={<div>Все загружено</div>}
    >
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </InfiniteScroll>
  )
}
```

### Готовый компонент с примером

Используйте готовый компонент `KnowledgeInfiniteList`:

```tsx
import { KnowledgeInfiniteList } from '@/components/features/knowledge/KnowledgeInfiniteList'

function KnowledgePage({ tenantId }) {
  return (
    <div>
      <h1>База знаний</h1>
      <KnowledgeInfiniteList
        tenantId={tenantId}
        categoryId="optional-category-id"
      />
    </div>
  )
}
```

Этот компонент включает:
- Бесконечную прокрутку
- Поиск по статьям
- Скелетоны загрузки
- Обработку ошибок
- Счетчик результатов

---

## 💾 Offline Support

### Описание
Offline Support позволяет сохранять кеш React Query в localStorage для работы без интернета.

### Как это работает

1. **Автоматическое сохранение**: Кеш автоматически сохраняется в `localStorage`
2. **Восстановление при загрузке**: При перезагрузке страницы кеш восстанавливается
3. **Работа без интернета**: Приложение показывает кешированные данные

### Настройка

В `components/providers/QueryClientProvider.tsx`:

```tsx
const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'REACT_QUERY_OFFLINE_CACHE',
})

<PersistQueryClientProvider
  client={queryClient}
  persistOptions={{ persister }}
>
  {children}
</PersistQueryClientProvider>
```

### Ключ в localStorage
Все данные сохраняются под ключом: `REACT_QUERY_OFFLINE_CACHE`

### Очистка кеша

Для очистки кеша:

```tsx
// Вручную
localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE')

// Программно через QueryClient
import { useQueryClient } from '@tanstack/react-query'

function ClearCacheButton() {
  const queryClient = useQueryClient()

  const handleClear = () => {
    queryClient.clear()
    localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE')
  }

  return <button onClick={handleClear}>Очистить кеш</button>
}
```

---

## 🎯 Best Practices

### 1. Именование ключей запросов
```tsx
// ✅ Хорошо - структурированные ключи
['knowledge', 'articles', tenantId, categoryId]
['dashboard', 'stats', tenantId]

// ❌ Плохо - неструктурированные ключи
['articles']
['stats']
```

### 2. Использование Optimistic Updates
```tsx
// ✅ Хорошо - всегда сохраняйте предыдущее состояние
onMutate: async (newData) => {
  await queryClient.cancelQueries({ queryKey })
  const previousData = queryClient.getQueryData(queryKey)
  queryClient.setQueryData(queryKey, newData)
  return { previousData }
}

// ❌ Плохо - нет rollback при ошибке
onMutate: async (newData) => {
  queryClient.setQueryData(queryKey, newData)
}
```

### 3. Infinite Scroll
```tsx
// ✅ Хорошо - используйте flatMap для объединения страниц
const items = data?.pages.flatMap(page => page.items) ?? []

// ❌ Плохо - map создает вложенные массивы
const items = data?.pages.map(page => page.items) ?? []
```

### 4. StaleTime и CacheTime
```tsx
// ✅ Хорошо - разумные значения
{
  staleTime: 2 * 60 * 1000,    // 2 минуты
  gcTime: 5 * 60 * 1000,       // 5 минут
}

// ❌ Плохо - слишком агрессивное кеширование
{
  staleTime: Infinity,
  gcTime: Infinity,
}
```

---

## 🧪 Тестирование

### Тестирование с React Query

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, waitFor } from '@testing-library/react'

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

function renderWithQueryClient(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={testQueryClient}>
      {ui}
    </QueryClientProvider>
  )
}

test('loads and displays articles', async () => {
  const { getByText } = renderWithQueryClient(<ArticlesList />)
  await waitFor(() => expect(getByText('Article 1')).toBeInTheDocument())
})
```

---

## 📦 Установленные пакеты

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.90.6",
    "@tanstack/react-query-persist-client": "latest"
  },
  "devDependencies": {
    "@tanstack/react-query-devtools": "latest"
  }
}
```

---

## 🔗 Полезные ссылки

- [React Query Docs](https://tanstack.com/query/latest)
- [Optimistic Updates Guide](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
- [Infinite Queries Guide](https://tanstack.com/query/latest/docs/react/guides/infinite-queries)
- [Persistence Guide](https://tanstack.com/query/latest/docs/react/plugins/persistQueryClient)

---

## 📝 Примеры использования

### Полный пример с мутацией
```tsx
import { useCreateArticle } from '@/lib/hooks/useKnowledgeMutations'
import { useKnowledgeArticles } from '@/lib/hooks/useKnowledgeBase'

function ArticlesManager({ tenantId }) {
  const { data: articles, isLoading } = useKnowledgeArticles(tenantId)
  const createArticle = useCreateArticle()

  const handleCreate = async () => {
    try {
      await createArticle.mutateAsync({
        tenantId,
        title: 'Новая статья',
        content: 'Содержание',
      })
      alert('Статья создана!')
    } catch (error) {
      alert('Ошибка при создании')
    }
  }

  if (isLoading) return <div>Загрузка...</div>

  return (
    <div>
      <button onClick={handleCreate}>Создать статью</button>
      {articles?.map(article => (
        <div key={article.id}>{article.title}</div>
      ))}
    </div>
  )
}
```

### Полный пример с Infinite Scroll
```tsx
import { useInfiniteArticles } from '@/lib/hooks/useInfiniteKnowledge'
import { InfiniteScroll } from '@/components/ui/infinite-scroll'

function InfiniteArticlesList({ tenantId }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteArticles(tenantId, { pageSize: 20 })

  if (isLoading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка: {error.message}</div>

  const articles = data?.pages.flatMap(page => page.articles) ?? []

  return (
    <InfiniteScroll
      onLoadMore={fetchNextPage}
      hasMore={hasNextPage ?? false}
      isLoading={isFetchingNextPage}
      endMessage={<div>Все статьи загружены</div>}
    >
      {articles.map(article => (
        <div key={article.id} className="p-4 border rounded">
          <h3>{article.title}</h3>
          <p>{article.content}</p>
        </div>
      ))}
    </InfiniteScroll>
  )
}
```

---

## ✨ Заключение

Все улучшения React Query успешно интегрированы в проект и готовы к использованию:

- ✅ DevTools для отладки
- ✅ Optimistic Updates для мгновенного UX
- ✅ Infinite Scroll для больших списков
- ✅ Offline Support для работы без интернета

Используйте эти инструменты для создания быстрого и отзывчивого интерфейса!
