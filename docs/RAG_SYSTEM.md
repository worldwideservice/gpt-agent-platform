# 🔍 RAG (Retrieval Augmented Generation) Система

Комплексная система для обработки файлов, создания векторных embeddings и построения Knowledge Graph для улучшения работы AI-агентов.

## 📋 Архитектура

### Компоненты системы:

1. **Загрузка файлов** (`/api/agents/[id]/assets`)
   - Загрузка файлов в Supabase Storage
   - Поддержка: PDF, DOCX, TXT, HTML, Markdown
   - Максимальный размер: 50 MB

2. **Парсер файлов** (`lib/services/file-parser.ts`)
   - Извлечение текста из различных форматов
   - Нормализация текста

3. **Worker обработки** (`services/worker/src/tasks/process-asset.ts`)
   - Асинхронная обработка файлов в фоне
   - Разбивка на chunks
   - Генерация embeddings
   - Извлечение сущностей для Knowledge Graph

4. **Векторный поиск** (`lib/repositories/knowledge-search.ts`)
   - Поиск релевантных chunks по запросу
   - Использование pgvector для быстрого поиска

5. **Knowledge Graph** (`lib/services/knowledge-graph.ts`)
   - Извлечение сущностей (люди, организации, продукты, концепции)
   - Построение связей между сущностями
   - Использование LLM для анализа

## 📊 Структура базы данных

### Таблицы:

#### `agent_assets`
Хранение информации о загруженных файлах:
```sql
- id: uuid
- agent_id: uuid (ссылка на агента)
- org_id: uuid
- type: text ('file')
- source_name: text (имя файла)
- storage_path: text (путь в Storage)
- status: 'pending' | 'processing' | 'completed' | 'failed'
- file_size: bigint
- mime_type: text
- chunks_count: integer
- processing_error: text
```

#### `knowledge_chunks`
Chunks из файлов с embeddings:
```sql
- id: uuid
- agent_id: uuid (опционально, для файлов агента)
- org_id: uuid
- asset_id: uuid (ссылка на файл)
- article_id: uuid (ссылка на статью базы знаний)
- content: text (текст chunk)
- embedding: vector(1536) (векторное представление)
- metadata: jsonb (дополнительная информация)
```

#### `knowledge_graph_entities`
Сущности извлеченные из документов:
```sql
- id: uuid
- org_id: uuid
- agent_id: uuid (опционально)
- entity_type: 'person' | 'organization' | 'product' | 'service' | 'concept' | 'event'
- entity_name: text
- entity_value: text
- confidence: numeric(3,2) (уверенность извлечения)
- source_chunk_id: uuid
```

#### `knowledge_graph_relationships`
Связи между сущностями:
```sql
- id: uuid
- org_id: uuid
- source_entity_id: uuid
- target_entity_id: uuid
- relationship_type: 'works_for' | 'provides' | 'uses' | 'related_to' | 'part_of'
- confidence: numeric(3,2)
```

## 🚀 Использование

### 1. Загрузка файла через API

```typescript
const formData = new FormData()
formData.append('file', fileBlob, 'document.pdf')

const response = await fetch(`/api/agents/${agentId}/assets`, {
  method: 'POST',
  body: formData,
})

const { data } = await response.json()
// data: { id, name, size, type, status: 'pending' }
```

### 2. Статус обработки

Файл автоматически добавляется в очередь обработки. Статусы:
- `pending` - файл загружен, ожидает обработки
- `processing` - идет обработка
- `completed` - обработка завершена успешно
- `failed` - ошибка обработки (см. `processing_error`)

### 3. Использование в чате

При отправке сообщения в чат, система автоматически:
1. Генерирует embedding для запроса пользователя
2. Ищет релевантные chunks через векторный поиск
3. Включает найденные chunks в контекст для LLM

```typescript
// В /api/chat автоматически используется searchKnowledgeBase
const chunks = await searchKnowledgeBase(orgId, userMessage, agentId, 5)
// chunks включаются в промпт для LLM
```

## 🔧 Настройка

### Установка зависимостей для парсинга

```bash
cd services/worker
npm install pdf-parse mammoth cheerio
```

### Создание Storage bucket в Supabase

```sql
-- Создайте bucket для хранения файлов агентов
INSERT INTO storage.buckets (id, name, public)
VALUES ('agent-assets', 'agent-assets', false);

-- Настройте RLS политики для bucket
CREATE POLICY "Users can upload agent assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'agent-assets' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can read own agent assets"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'agent-assets' AND
  auth.uid() IS NOT NULL
);
```

### Настройка переменных окружения

Убедитесь, что `OPENROUTER_API_KEY` установлен для генерации embeddings.

## 📈 Производительность

### Оптимизация:

1. **Индексы pgvector**: Используется IVFFlat индекс для быстрого поиска
2. **Размер chunks**: 600 токенов с overlap 120 (настраивается)
3. **Batch обработка**: Worker обрабатывает файлы асинхронно

### Ограничения:

- Максимальный размер файла: 50 MB
- Поддерживаемые форматы: PDF, DOCX, TXT, HTML, Markdown
- Размерность embeddings: 1536 (OpenAI text-embedding-3-large)

## 🎯 Knowledge Graph

Knowledge Graph автоматически строится при обработке файлов:
- LLM извлекает сущности из текста
- Определяет связи между сущностями
- Сохраняет в БД для дальнейшего использования

**Пример использования:**

```typescript
import { getRelatedEntities } from '@/lib/services/knowledge-graph'

// Получить связанные сущности для контекста
const related = await getRelatedEntities(orgId, ['Иван Петров', 'Компания ABC'], 10)
// Использовать в промпте для улучшения контекста
```

## 🔄 Процесс обработки файла

```
1. Пользователь загружает файл
   ↓
2. Файл сохраняется в Supabase Storage
   ↓
3. Создается запись в agent_assets (status: 'pending')
   ↓
4. Добавляется задача в очередь (Redis/BullMQ)
   ↓
5. Worker обрабатывает файл:
   a) Скачивает файл из Storage
   b) Парсит текст
   c) Разбивает на chunks
   d) Генерирует embeddings
   e) Извлекает сущности (Knowledge Graph)
   f) Сохраняет chunks в БД
   ↓
6. Обновляет статус на 'completed'
```

## ⚠️ Важные заметки

1. **Парсинг файлов**: Требует установки библиотек:
   - `pdf-parse` для PDF
   - `mammoth` для DOCX
   - `cheerio` для HTML (опционально)

2. **Knowledge Graph**: Извлечение сущностей использует LLM, что требует:
   - Настроенный `OPENROUTER_API_KEY`
   - Дополнительные токены для обработки

3. **Storage**: Не забудьте создать bucket и настроить RLS политики

## 🐛 Troubleshooting

### Файл не обрабатывается
- Проверьте логи worker: `cd services/worker && npm run dev`
- Проверьте Redis подключение
- Проверьте наличие `OPENROUTER_API_KEY`

### Embeddings не генерируются
- Проверьте ключ OpenRouter
- Проверьте лимиты API
- Убедитесь, что модель embeddings доступна

### Knowledge Graph не создается
- Проверьте логи worker (может быть не критичная ошибка)
- Проверьте, что LLM модель доступна
- Убедитесь, что текст достаточно информативен

## 📚 Дополнительные ресурсы

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [pgvector Docs](https://github.com/pgvector/pgvector)
- [OpenRouter Embeddings](https://openrouter.ai/docs/embeddings)










