--  Задача 4.4: Performance Optimization
-- Добавление индексов для оптимизации производительности

-- ============================================================================
-- Индексы для таблицы agents
-- ============================================================================

-- Composite индекс для оптимизации getAgents с фильтрами
-- Покрывает запросы с фильтрацией по org_id, status и сортировкой по created_at
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agents_org_status_created
ON agents(org_id, status, created_at DESC);

-- Индекс для фильтрации по модели (Task 4.1)
-- Оптимизирует запросы с фильтром по default_model
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agents_org_model
ON agents(org_id, default_model)
WHERE default_model IS NOT NULL;

-- GIN индекс для full-text search по имени агента
-- Улучшает производительность поиска с ILIKE
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agents_name_trgm
ON agents USING gin(name gin_trgm_ops);

-- Partial индекс для активных агентов
-- Ускоряет запросы к только активным агентам
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agents_org_active
ON agents(org_id, created_at DESC)
WHERE status = 'active';

-- Индекс для last_activity_at для сортировки по активности
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agents_org_activity
ON agents(org_id, last_activity_at DESC NULLS LAST);

-- ============================================================================
-- Индексы для таблицы agent_activity_metrics
-- ============================================================================

-- Composite индекс для агрегации метрик по датам
-- Оптимизирует запросы в getDashboardStats, getWeeklyActivitySummary
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activity_metrics_org_date_desc
ON agent_activity_metrics(org_id, activity_date DESC);

-- Индекс для фильтрации и агрегации по agent_id
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activity_metrics_agent_date
ON agent_activity_metrics(agent_id, activity_date DESC);

-- ============================================================================
-- Индексы для других критичных таблиц
-- ============================================================================

-- Индекс для organization_members для быстрого поиска по user_id
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_org_members_user
ON organization_members(user_id)
WHERE status = 'active';

-- Индекс для conversations для поиска по org_id и created_at
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversations_org_created
ON conversations(org_id, created_at DESC)
WHERE conversations.id IS NOT NULL;

-- Индекс для webhook_events для обработки pending events
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_webhook_events_status
ON webhook_events(org_id, status, created_at DESC)
WHERE status = 'pending';

-- ============================================================================
-- Включение расширения pg_trgm для text search
-- ============================================================================

-- Включаем расширение для триграмного поиска
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- Статистика и ANALYZE
-- ============================================================================

-- Обновляем статистику для оптимизатора запросов
ANALYZE agents;
ANALYZE agent_activity_metrics;
ANALYZE organization_members;

-- ============================================================================
-- Комментарии
-- ============================================================================

COMMENT ON INDEX idx_agents_org_status_created IS 'Task 4.4: Оптимизация запросов getAgents с фильтрами';
COMMENT ON INDEX idx_agents_org_model IS 'Task 4.1/4.4: Оптимизация фильтрации по модели AI';
COMMENT ON INDEX idx_agents_name_trgm IS 'Task 4.4: Full-text search по имени агента';
COMMENT ON INDEX idx_agents_org_active IS 'Task 4.4: Partial индекс для активных агентов';
COMMENT ON INDEX idx_activity_metrics_org_date_desc IS 'Task 4.4: Оптимизация dashboard stats queries';
