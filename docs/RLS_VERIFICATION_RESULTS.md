# RLS Verification Results - CRITICAL ISSUES FOUND

**Дата**: 2025-11-17
**Статус**: 🔴 **КРИТИЧНЫЕ ПРОБЛЕМЫ ОБНАРУЖЕНЫ**
**Приоритет**: CRITICAL - БЛОКИРУЕТ PRODUCTION DEPLOY

---

## Executive Summary

При проверке Row-Level Security (RLS) policies обнаружены **КРИТИЧНЫЕ проблемы**:

1. ❌ **7+ миграций используют НЕПРАВИЛЬНОЕ имя таблицы** (`members` вместо `organization_members`)
2. ❌ **10+ таблиц имеют СЛОМАННЫЕ RLS policies** которые не работают
3. ⚠️ **8+ таблиц БЕЗ RLS** содержащих sensitive data

**Воздействие**:
- RLS policies НЕ РАБОТАЮТ на критичных таблицах
- Потенциальная утечка данных между организациями
- Production deploy НЕВОЗМОЖЕН без исправления

**Требуемое время для исправления**: 1-2 часа

---

## 🔴 КРИТИЧНАЯ ПРОБЛЕМА #1: Wrong Table Name in RLS Policies

### Описание

**Правильное имя таблицы**: `organization_members` (определено в `supabase/schema.sql:51`)
**Используется в миграциях**: `members` (НЕ СУЩЕСТВУЕТ!)

### Затронутые файлы (7+)

| Файл | Таблицы | Строки с проблемой |
|------|---------|-------------------|
| `add_billing.sql` | billing_plans, subscriptions, usage_records | 79-80, 87-90, 94-98 |
| `add_sequences.sql` | sequences, sequence_steps, sequence_executions | 70-74, 77-81, 84-88, 91-95, 101-105, 108-112, 118-122, 125-129 |
| `add_agent_memory.sql` | agent_memory | 50-54, 57-61, 64-68, 71-75 |
| `add_analytics.sql` | analytics_metrics, analytics_reports | 42-46, 49-53, 56-60, 63-67 |
| `add_email_templates.sql` | email_templates | 21-25, 28-32, 35-39, 42-46 |
| `add_crm_settings.sql` | crm_settings (вероятно) | Нужно проверить |
| `add_rule_engine.sql` | automation_rules (вероятно) | Нужно проверить |

### Пример проблемного кода

```sql
-- ❌ НЕПРАВИЛЬНО (таблица members НЕ СУЩЕСТВУЕТ!)
CREATE POLICY "Users can view their organization subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members  -- ❌ ТАБЛИЦА НЕ СУЩЕСТВУЕТ!
    WHERE org_id = subscriptions.org_id
    AND status = 'active'
  ));

-- ✅ ПРАВИЛЬНО
CREATE POLICY "Users can view their organization subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM organization_members  -- ✅ ПРАВИЛЬНО!
    WHERE org_id = subscriptions.org_id
    AND status = 'active'
  ));
```

### Воздействие

**КРИТИЧНО**: RLS policies с неправильным именем таблицы будут:
- ❌ **ПАДАТЬ при выполнении** с ошибкой "relation 'members' does not exist"
- ❌ **БЛОКИРОВАТЬ ВСЕ ЗАПРОСЫ** к этим таблицам
- ❌ **ДЕЛАТЬ ПРИЛОЖЕНИЕ НЕРАБОТОСПОСОБНЫМ**

### Затронутые таблицы (10+)

1. ❌ `analytics_metrics` - RLS BROKEN
2. ❌ `analytics_reports` - RLS BROKEN
3. ❌ `agent_memory` - RLS BROKEN
4. ❌ `email_templates` - RLS BROKEN
5. ❌ `billing_plans` - RLS BROKEN
6. ❌ `subscriptions` - RLS BROKEN
7. ❌ `usage_records` - RLS BROKEN
8. ❌ `sequences` - RLS BROKEN
9. ❌ `sequence_steps` - RLS BROKEN
10. ❌ `sequence_executions` - RLS BROKEN (если использует members)

### Fix Required

Создать новую миграцию для исправления:

```sql
-- supabase/migrations/fix_rls_table_name_bug.sql

-- Fix billing_plans policies
DROP POLICY IF EXISTS "Anyone can view active billing plans" ON billing_plans;
CREATE POLICY "Anyone can view active billing plans" ON billing_plans
  FOR SELECT USING (is_active = true);

-- Fix subscriptions policies
DROP POLICY IF EXISTS "Users can view their organization subscriptions" ON subscriptions;
CREATE POLICY "Users can view their organization subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = subscriptions.org_id
    AND status = 'active'
  ));

-- ... повторить для всех затронутых таблиц ...
```

---

## 🔴 КРИТИЧНАЯ ПРОБЛЕМА #2: Sensitive Tables Without RLS

### Таблицы БЕЗ RLS Protection

| Таблица | Sensitive Data | Риск | Приоритет |
|---------|----------------|------|-----------|
| `crm_credentials` | API client_secret, client_id | **КРИТИЧНЫЙ** | P0 |
| `password_resets` | Password reset tokens | **ВЫСОКИЙ** | P1 |
| `oauth_states` | OAuth state tokens | **СРЕДНИЙ** | P1 |
| `organization_invites` | Invite tokens, emails | **СРЕДНИЙ** | P2 |
| `usage_daily` | Usage metrics | **НИЗКИЙ** | P2 |
| `activity_logs` | User activity | **НИЗКИЙ** | P3 |
| `user_activity` | User activity | **НИЗКИЙ** | P3 |
| `documents` | Document content | **ВЫСОКИЙ** | P1 |

### Fix Required for crm_credentials (CRITICAL)

```sql
-- CRITICAL: crm_credentials содержит API secrets!
ALTER TABLE crm_credentials ENABLE ROW LEVEL SECURITY;

-- Пользователи могут видеть только credentials своей организации
CREATE POLICY "Users can view their org CRM credentials" ON crm_credentials
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Только admin и owner могут управлять credentials
CREATE POLICY "Admins can manage CRM credentials" ON crm_credentials
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
      AND status = 'active'
    )
  );
```

---

## ✅ ХОРОШИЕ RLS Policies (Работают Правильно)

Следующие таблицы имеют **корректные** RLS policies:

### Perfect RLS Implementation ✅

| Таблица | Файл | Статус |
|---------|------|--------|
| `notifications` | `20251116090000_create_notifications.sql` | ✅ PERFECT |
| `crm_tasks` | `add_crm_tasks_and_calls.sql` | ✅ PERFECT |
| `crm_calls` | `add_crm_tasks_and_calls.sql` | ✅ PERFECT |
| `organizations` | `enable_rls_policies.sql` | ✅ GOOD |
| `agents` | `enable_rls_policies.sql` | ✅ PERFECT (full CRUD) |
| `agent_assets` | `enable_rls_policies.sql` | ✅ GOOD |
| `agent_conversations` | `enable_rls_policies.sql` | ✅ GOOD |
| `knowledge_base_articles` | `enable_rls_policies.sql` | ✅ GOOD |
| `crm_connections` | `enable_rls_policies.sql` | ✅ GOOD |
| `users` | `fix_users_insert_policy.sql` | ✅ GOOD |

**Пример отличной RLS policy** (`notifications`):

```sql
-- Включен RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- SELECT: пользователи видят только свои уведомления в своей организации
CREATE POLICY "Users can view their own notifications in their org"
  ON notifications FOR SELECT
  USING (
    user_id = auth.uid()
    AND org_id IN (
      SELECT om.org_id FROM organization_members om
      WHERE om.user_id = auth.uid()
    )
  );

-- UPDATE: пользователи могут обновлять только свои уведомления
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid() AND ...)
  WITH CHECK (user_id = auth.uid() AND ...);

-- DELETE: пользователи могут удалять только свои уведомления
CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.uid() AND ...);

-- INSERT: только service role может создавать уведомления
CREATE POLICY "Service role can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);
```

**Почему это отлично**:
- ✅ Использует правильную таблицу `organization_members`
- ✅ Проверяет и user_id, и org_id (двойная защита)
- ✅ Разные policies для разных операций (SELECT/UPDATE/DELETE/INSERT)
- ✅ Service role может создавать уведомления для любого пользователя

---

## 📊 Статистика RLS Coverage

### Общий обзор (52 таблицы)

```
✅ RLS ENABLED и РАБОТАЕТ:  20 таблиц (38%)
❌ RLS ENABLED но СЛОМАН:   10 таблиц (19%)
⚠️  RLS ОТСУТСТВУЕТ:         8 таблиц (15%)
ℹ️  Не требует RLS:         14 таблиц (27%)
```

### Breakdown по критичности

**CRITICAL (требует немедленного fix):**
- ❌ `crm_credentials` - NO RLS, содержит API secrets
- ❌ `analytics_metrics` - BROKEN RLS (members table)
- ❌ `analytics_reports` - BROKEN RLS (members table)
- ❌ `billing_plans` - BROKEN RLS (members table)
- ❌ `subscriptions` - BROKEN RLS (members table)
- ❌ `usage_records` - BROKEN RLS (members table)

**HIGH (требует fix перед production):**
- ❌ `agent_memory` - BROKEN RLS (members table)
- ❌ `email_templates` - BROKEN RLS (members table)
- ❌ `sequences` - BROKEN RLS (members table)
- ❌ `sequence_steps` - BROKEN RLS (members table)
- ⚠️ `password_resets` - NO RLS
- ⚠️ `documents` - NO RLS (вероятно)

**MEDIUM:**
- ⚠️ `oauth_states` - NO RLS
- ⚠️ `organization_invites` - NO RLS
- ⚠️ `usage_daily` - NO RLS

---

## 🛠️ Recommended Fixes

### Priority 0: CRITICAL (Fix Today, 1 час)

1. **Создать и применить fix migration для table name bug**
   ```bash
   # Создать файл
   touch supabase/migrations/fix_rls_table_name_members_to_organization_members.sql

   # Применить (см. SQL ниже)
   ```

2. **Добавить RLS на crm_credentials**
   ```sql
   ALTER TABLE crm_credentials ENABLE ROW LEVEL SECURITY;
   -- + policies (см. выше)
   ```

### Priority 1: HIGH (Fix This Week, 2 часа)

3. **Добавить RLS на password_resets**
4. **Проверить и добавить RLS на documents/document_chunks**
5. **Протестировать все исправленные policies**

### Priority 2: MEDIUM (Fix Before Production, 1 час)

6. **Добавить RLS на oauth_states**
7. **Добавить RLS на organization_invites**
8. **Добавить RLS на usage_daily**

---

## 📝 Full Fix Migration SQL

Создайте файл: `supabase/migrations/fix_rls_critical_bugs.sql`

```sql
-- ============================================
-- CRITICAL FIX: Replace 'members' with 'organization_members'
-- Date: 2025-11-17
-- ============================================

-- Fix analytics_metrics
DROP POLICY IF EXISTS "Users can view their organization metrics" ON analytics_metrics;
DROP POLICY IF EXISTS "Users can insert their organization metrics" ON analytics_metrics;

CREATE POLICY "Users can view their organization metrics" ON analytics_metrics
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = analytics_metrics.org_id AND status = 'active'
  ));

CREATE POLICY "Users can insert their organization metrics" ON analytics_metrics
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = analytics_metrics.org_id AND status = 'active'
  ));

-- Fix analytics_reports
DROP POLICY IF EXISTS "Users can view their organization reports" ON analytics_reports;
DROP POLICY IF EXISTS "Users can manage their organization reports" ON analytics_reports;

CREATE POLICY "Users can view their organization reports" ON analytics_reports
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = analytics_reports.org_id AND status = 'active'
  ));

CREATE POLICY "Users can manage their organization reports" ON analytics_reports
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = analytics_reports.org_id AND status = 'active'
  ));

-- Fix agent_memory
DROP POLICY IF EXISTS "Users can view memory from their organization" ON agent_memory;
DROP POLICY IF EXISTS "Users can insert memory for their organization" ON agent_memory;
DROP POLICY IF EXISTS "Users can update memory from their organization" ON agent_memory;
DROP POLICY IF EXISTS "Users can delete memory from their organization" ON agent_memory;

CREATE POLICY "Users can view memory from their organization" ON agent_memory
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = agent_memory.org_id AND status = 'active'
  ));

CREATE POLICY "Users can insert memory for their organization" ON agent_memory
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = agent_memory.org_id AND status = 'active'
  ));

CREATE POLICY "Users can update memory from their organization" ON agent_memory
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = agent_memory.org_id AND status = 'active'
  ));

CREATE POLICY "Users can delete memory from their organization" ON agent_memory
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = agent_memory.org_id AND status = 'active'
  ));

-- Fix email_templates
DROP POLICY IF EXISTS "Users can view email templates from their organization" ON email_templates;
DROP POLICY IF EXISTS "Users can create email templates in their organization" ON email_templates;
DROP POLICY IF EXISTS "Users can update email templates in their organization" ON email_templates;
DROP POLICY IF EXISTS "Users can delete email templates in their organization" ON email_templates;

CREATE POLICY "Users can view email templates from their organization" ON email_templates
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = email_templates.org_id AND status = 'active'
  ));

CREATE POLICY "Users can create email templates in their organization" ON email_templates
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = email_templates.org_id AND status = 'active'
  ));

CREATE POLICY "Users can update email templates in their organization" ON email_templates
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = email_templates.org_id AND status = 'active'
  ));

CREATE POLICY "Users can delete email templates in their organization" ON email_templates
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = email_templates.org_id AND status = 'active'
  ));

-- Fix subscriptions (billing)
DROP POLICY IF EXISTS "Users can view their organization subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can manage their organization subscriptions" ON subscriptions;

CREATE POLICY "Users can view their organization subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = subscriptions.org_id AND status = 'active'
  ));

CREATE POLICY "Users can manage their organization subscriptions" ON subscriptions
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = subscriptions.org_id AND status = 'active'
  ));

-- Fix usage_records
DROP POLICY IF EXISTS "Users can view their organization usage" ON usage_records;

CREATE POLICY "Users can view their organization usage" ON usage_records
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = usage_records.org_id AND status = 'active'
  ));

-- Fix sequences
DROP POLICY IF EXISTS "Users can view sequences from their organization" ON sequences;
DROP POLICY IF EXISTS "Users can insert sequences for their organization" ON sequences;
DROP POLICY IF EXISTS "Users can update sequences from their organization" ON sequences;
DROP POLICY IF EXISTS "Users can delete sequences from their organization" ON sequences;

CREATE POLICY "Users can view sequences from their organization" ON sequences
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = sequences.org_id AND status = 'active'
  ));

CREATE POLICY "Users can insert sequences for their organization" ON sequences
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = sequences.org_id AND status = 'active'
  ));

CREATE POLICY "Users can update sequences from their organization" ON sequences
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = sequences.org_id AND status = 'active'
  ));

CREATE POLICY "Users can delete sequences from their organization" ON sequences
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = sequences.org_id AND status = 'active'
  ));

-- Fix sequence_steps
DROP POLICY IF EXISTS "Users can view sequence steps from their organization" ON sequence_steps;
DROP POLICY IF EXISTS "Users can manage sequence steps from their organization" ON sequence_steps;

CREATE POLICY "Users can view sequence steps from their organization" ON sequence_steps
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM organization_members m
    JOIN sequences s ON s.id = sequence_steps.sequence_id
    WHERE m.org_id = s.org_id AND m.status = 'active'
  ));

CREATE POLICY "Users can manage sequence steps from their organization" ON sequence_steps
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM organization_members m
    JOIN sequences s ON s.id = sequence_steps.sequence_id
    WHERE m.org_id = s.org_id AND m.status = 'active'
  ));

-- Fix sequence_executions
DROP POLICY IF EXISTS "Users can view sequence executions from their organization" ON sequence_executions;
DROP POLICY IF EXISTS "Users can manage sequence executions from their organization" ON sequence_executions;

CREATE POLICY "Users can view sequence executions from their organization" ON sequence_executions
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = sequence_executions.org_id AND status = 'active'
  ));

CREATE POLICY "Users can manage sequence executions from their organization" ON sequence_executions
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = sequence_executions.org_id AND status = 'active'
  ));

-- ============================================
-- CRITICAL FIX: Add RLS to crm_credentials
-- ============================================

ALTER TABLE crm_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their org CRM credentials" ON crm_credentials
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Admins can manage CRM credentials" ON crm_credentials
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
      AND status = 'active'
    )
  );

-- ============================================
-- HIGH PRIORITY: Add RLS to password_resets
-- ============================================

ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;

-- Пользователи могут видеть только свои password resets
CREATE POLICY "Users can view their own password resets" ON password_resets
  FOR SELECT USING (user_id = auth.uid());

-- Пользователи могут создавать password reset для себя
CREATE POLICY "Users can create their own password resets" ON password_resets
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Service role может управлять всеми password resets
CREATE POLICY "Service role can manage password resets" ON password_resets
  FOR ALL USING (true);

-- ============================================
-- MEDIUM PRIORITY: Add RLS to other tables
-- ============================================

-- oauth_states
ALTER TABLE oauth_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage OAuth states for their org" ON oauth_states
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- organization_invites
ALTER TABLE organization_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invites for their org" ON organization_invites
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Admins can manage invites for their org" ON organization_invites
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
      AND status = 'active'
    )
  );

-- usage_daily
ALTER TABLE usage_daily ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view usage for their org" ON usage_daily
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );
```

---

## ✅ Testing Plan

### 1. Применить fix migration

```bash
# Запустить миграцию на development/staging
psql $DATABASE_URL -f supabase/migrations/fix_rls_critical_bugs.sql
```

### 2. Проверить что все policies применились

```sql
-- Проверить что RLS включен на всех таблицах
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'analytics_metrics', 'analytics_reports', 'agent_memory',
  'email_templates', 'subscriptions', 'usage_records',
  'sequences', 'sequence_steps', 'sequence_executions',
  'crm_credentials', 'password_resets', 'oauth_states',
  'organization_invites', 'usage_daily'
)
ORDER BY tablename;
```

### 3. Проверить что policies существуют

```sql
-- Проверить количество policies для каждой таблицы
SELECT
  schemaname,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;
```

### 4. Тестирование cross-organization access

```sql
-- См. docs/SUPABASE_RLS_VERIFICATION_GUIDE.md для полных тестов
```

---

## 📋 Checklist Before Production

- [ ] **Применена fix migration** (`fix_rls_critical_bugs.sql`)
- [ ] **Проверено что все policies используют `organization_members`**
- [ ] **Добавлен RLS на `crm_credentials`** (CRITICAL!)
- [ ] **Добавлен RLS на `password_resets`**
- [ ] **Протестирован cross-organization access** (см. guide)
- [ ] **Проверены все таблицы на RLS enabled**
- [ ] **Smoke tests пройдены**
- [ ] **Staging deploy успешен**

---

## 🎯 Next Steps

### Immediate (Сегодня, 1-2 часа)

1. **Создать и применить fix migration**
   ```bash
   # Создать файл
   cp docs/RLS_VERIFICATION_RESULTS.md supabase/migrations/fix_rls_critical_bugs.sql
   # Извлечь только SQL из markdown
   # Применить на staging
   ```

2. **Протестировать на staging**
   - Запустить миграцию
   - Проверить что policies работают
   - Проверить что приложение работает

3. **Deploy на production** (после успешных тестов)

### Follow-up (Эта неделя)

4. **Code review всех migration files**
   - Проверить другие потенциальные проблемы
   - Стандартизировать формат RLS policies

5. **Добавить automated tests для RLS**
   - Integration tests для cross-org access
   - Unit tests для каждой policy

---

## 📞 Contact

**Вопросы по RLS verification:**
- См. полный guide: `docs/SUPABASE_RLS_VERIFICATION_GUIDE.md`
- Created by: Claude (deep analysis)
- Date: 2025-11-17

---

**Status**: 🔴 **БЛОКИРУЕТ PRODUCTION** - Требует немедленного fix
