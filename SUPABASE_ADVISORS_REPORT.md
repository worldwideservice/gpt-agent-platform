# 🔍 Отчет по предупреждениям Supabase

**Дата:** 2025-01-26  
**Проект:** `rpzchsgutabxeabbnwas`

---

## 🔒 Security Advisors (1)

### 1. Leaked Password Protection Disabled ⚠️ WARN
- **Проблема:** Защита от утечек паролей отключена
- **Описание:** Supabase Auth может предотвращать использование скомпрометированных паролей, проверяя их через HaveIBeenPwned.org
- **Решение:** 
  - Откройте: https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/auth/policies
  - Включите "Leaked Password Protection" в настройках Auth
- **Ссылка:** https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

---

## ⚡ Performance Advisors

### 1. Unindexed Foreign Keys ℹ️ INFO
- **Таблица:** `public.knowledge_base_articles`
- **Foreign Key:** `knowledge_base_articles_category_id_fkey` (column: `category_id`)
- **Проблема:** Foreign key без индекса может замедлить запросы
- **Решение:** Создать индекс на `category_id`
```sql
CREATE INDEX idx_knowledge_base_articles_category_id ON public.knowledge_base_articles(category_id);
```
- **Ссылка:** https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys

### 2. Auth RLS Initialization Plan ⚠️ WARN (19 таблиц)
**Проблема:** RLS политики используют `auth.<function>()` без `SELECT`, что приводит к переоценке для каждой строки

**Затронутые таблицы:**
- `crm_credentials` - политика "Service role full access"
- `agent_integrations` - 4 политики
- `crm_connections` - политика "Users can manage CRM connections in their org"
- `crm_pipelines` - политика "Users can view CRM pipelines in their org"
- `crm_pipeline_stages` - политика "Users can view CRM pipeline stages in their org"
- `agents` - политика "Users can manage agents in their org"
- `agent_assets` - политика "Users can manage agent assets in their org"
- `knowledge_base_categories` - политика "Users can manage KB categories in their org"
- `agent_pipeline_settings` - политика "Users can manage pipeline settings in their org"
- `agent_conversations` - политика "Users can manage conversations in their org"
- `agent_memory` - политика "Users can manage agent memory in their org"
- `knowledge_base_articles` - политика "Users can manage KB articles in their org"
- `knowledge_chunks` - политика "Users can manage knowledge chunks in their org"
- `company_knowledge` - политика "Users can manage company knowledge in their org"
- `sales_scripts` - политика "Users can manage sales scripts in their org"
- `objection_responses` - политика "Users can manage objections in their org"
- `users` - 5 политик
- `organizations` - политика "Service role full access"
- `organization_members` - политика "Service role full access"

**Решение:** Заменить `auth.uid()` на `(select auth.uid())` во всех RLS политиках
- **Ссылка:** https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select

### 3. Unused Index ℹ️ INFO (27 индексов)
**Неиспользуемые индексы:**
- `idx_agent_conversations_agent_id`
- `idx_agent_memory_conversation_id`
- `idx_agents_connection_id`
- `idx_knowledge_chunks_asset_id`
- `idx_organization_members_user_id`
- `idx_organization_members_invited_by`
- `idx_sales_scripts_agent_id`
- `idx_users_default_org_id`
- И еще 19 индексов...

**Решение:** Удалить неиспользуемые индексы для улучшения производительности записи
- **Ссылка:** https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

### 4. Multiple Permissive Policies ⚠️ WARN (12 случаев)
**Проблема:** Несколько разрешающих RLS политик для одной роли и действия на таблице

**Затронутые таблицы:**
- `organization_members` - 5 случаев (роли: anon, authenticated, authenticator, cli_login_postgres, dashboard_user)
- `organizations` - 5 случаев (роли: anon, authenticated, authenticator, cli_login_postgres, dashboard_user)
- `users` - 2 случая (роли: anon, authenticated)

**Решение:** Объединить политики в одну для каждой роли/действия
- **Ссылка:** https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies

---

## 🎯 Приоритет исправлений

### Критичные (Security)
1. ✅ **Leaked Password Protection** - включить немедленно

### Высокий приоритет (Performance)
1. ⚠️ **Auth RLS Initialization Plan** - исправить для всех таблиц (влияет на производительность)
2. ⚠️ **Multiple Permissive Policies** - объединить политики

### Средний приоритет (Performance)
1. ℹ️ **Unindexed Foreign Keys** - добавить индекс
2. ℹ️ **Unused Index** - удалить неиспользуемые индексы

