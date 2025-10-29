# Чеклист для деплоя

## ✅ Критические проверки перед деплоем

### 1. База данных
- [ ] Применить все миграции из `supabase/migrations/`:
  - [ ] `add_company_knowledge.sql` - структурированные знания, скрипты, возражения
  - [ ] `add_agent_pipeline_settings.sql` - настройки воронок для агентов
- [ ] Проверить что таблицы существуют:
  ```sql
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN (
    'agent_pipeline_settings',
    'company_knowledge',
    'sales_scripts',
    'objection_responses',
    'agent_memory'
  );
  ```
- [ ] Создать Storage bucket для файлов агентов:
  ```sql
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('agent-assets', 'agent-assets', false);
  ```

### 2. Переменные окружения

#### Root (.env.local)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `SUPABASE_DEFAULT_ORGANIZATION_ID`
- [ ] `OPENROUTER_API_KEY`
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `AUTH_SECRET` или `NEXTAUTH_SECRET` (критично!)
- [ ] `BACKEND_API_URL`

#### services/api/.env
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `REDIS_URL`
- [ ] `ENCRYPTION_KEY` (32 байта base64)
- [ ] `OPENROUTER_API_KEY`
- [ ] `KOMMO_OAUTH_REDIRECT_BASE`
- [ ] `KOMMO_WEBHOOK_SECRET`

#### services/worker/.env
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `REDIS_URL`
- [ ] `ENCRYPTION_KEY`
- [ ] `OPENROUTER_API_KEY`
- [ ] `JOB_QUEUE_NAME`
- [ ] `JOB_CONCURRENCY`

### 3. Зависимости
- [ ] Установить все зависимости: `npm install`
- [ ] В `services/api`: `npm install`
- [ ] В `services/worker`: `npm install`
- [ ] Опционально: установить `cheerio` для лучшего парсинга HTML:
  ```bash
  npm install cheerio @types/cheerio
  ```

### 4. Redis
- [ ] Redis запущен и доступен
- [ ] URL подключения корректный (`REDIS_URL`)
- [ ] Тест подключения: `redis-cli ping`

### 5. Supabase Storage
- [ ] Bucket `agent-assets` создан
- [ ] RLS политики настроены для bucket
- [ ] Service Role имеет доступ к bucket

### 6. API Endpoints проверка
- [ ] `/api/auth/*` работает
- [ ] `/api/agents` - список агентов
- [ ] `/api/agents/[id]` - CRUD агентов
- [ ] `/api/agents/[id]/status` - изменение статуса
- [ ] `/api/agents/[id]/assets` - загрузка файлов
- [ ] `/api/agents/[id]/pipeline-settings` - настройки воронок
- [ ] `/api/agents/[id]/fields` - поля CRM
- [ ] `/api/agents/[id]/scripts` - скрипты продаж
- [ ] `/api/agents/[id]/objections` - ответы на возражения
- [ ] `/api/agents/[id]/knowledge` - знания компании
- [ ] `/api/chat` - чат с агентом

### 7. Worker сервис
- [ ] Worker запущен и обрабатывает задачи
- [ ] Подключение к Redis работает
- [ ] Очередь `agent-jobs` создана
- [ ] Тестовая задача обрабатывается

### 8. Frontend проверки
- [ ] Страница входа работает
- [ ] Дашборд загружается
- [ ] Создание/редактирование агентов
- [ ] Обучение агента (загрузка файлов, знания, скрипты)
- [ ] Настройка CRM (синхронизация воронок)
- [ ] Активация/деактивация агента
- [ ] Чат с агентом

### 9. Security
- [ ] Все `.env` файлы в `.gitignore`
- [ ] `AUTH_SECRET` сильный (32+ символа)
- [ ] `ENCRYPTION_KEY` правильно сгенерирован
- [ ] RLS политики в Supabase включены
- [ ] API endpoints защищены middleware

### 10. Performance
- [ ] Database indexes созданы
- [ ] Векторные индексы для embeddings работают
- [ ] Redis кеширование настроено

## 🐛 Известные TODO (не критично для MVP)

1. **HTML парсинг** - используется упрощенный вариант без cheerio
2. **CRM поля** - используются стандартные поля, интеграция с Kommo API для кастомных полей TODO
3. **Pipeline stage ID в чате** - автоматическое определение из CRM TODO
4. **OpenRouter API ключ** - из настроек организации (сейчас из env)

## 📝 После деплоя

1. Создать тестового пользователя
2. Создать тестового агента
3. Загрузить тестовые файлы
4. Протестировать обучение
5. Протестировать синхронизацию CRM
6. Протестировать чат

## 🚨 Критические проблемы исправлены

- ✅ Добавлен `checkBeforeSending` в `AgentSettings`
- ✅ Добавлены `dealFields` и `contactFields` в `AgentSettings`
- ✅ Все API endpoints проверены
- ✅ Статус агента правильно обновляется


