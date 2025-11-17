# Supabase Row-Level Security (RLS) Verification Guide

**Дата**: 2025-11-17
**Критичность**: 🔴 **КРИТИЧНАЯ ЗАДАЧА** перед production deployment
**Время на выполнение**: 2 часа

---

## Зачем это нужно

Row-Level Security (RLS) - это **последняя линия защиты** вашей базы данных. Если RLS настроена неправильно или отключена:

- ❌ Любой пользователь сможет читать данные других организаций
- ❌ Пользователи смогут модифицировать чужие записи
- ❌ КРИТИЧНАЯ УЯЗВИМОСТЬ БЕЗОПАСНОСТИ

**ВАЖНО**: Даже если у вас есть проверки на уровне приложения, RLS - это обязательная защита на уровне БД.

---

## Текущий статус

❓ **Не проверено** - RLS policies существуют в миграциях, но не протестированы в production environment

---

## Шаг 1: Проверка включена ли RLS на всех таблицах

### 1.1 Открыть Supabase Dashboard

1. Перейдите в [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект
3. Перейдите в `Database` → `Tables`

### 1.2 Проверить RLS статус для каждой таблицы

**Критичные таблицы, которые ОБЯЗАТЕЛЬНО должны иметь RLS:**

```
✅ Must have RLS enabled:
- organizations
- users
- agents
- conversations
- messages
- knowledge_base_items
- documents
- crm_connections
- crm_settings
- billing_plans
- billing_subscriptions
- notifications
- activity_logs
- sequences
- rules
- tasks
- email_templates
- analytics_events
- ab_test_experiments
- ab_test_variants
```

**Как проверить:**

```sql
-- Выполните в SQL Editor:
SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Ожидаемый результат**: `rls_enabled` должен быть `true` для ВСЕХ таблиц выше.

---

## Шаг 2: Проверка RLS policies

### 2.1 Проверить существуют ли policies

```sql
-- Выполните в SQL Editor:
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 2.2 Проверить политики для ключевых таблиц

#### Organizations Table

**Ожидаемые policies:**
```sql
-- Должны существовать:
1. organizations_select_policy:
   - Users can SELECT only their organization
   - USING (id = auth.jwt() ->> 'organizationId')

2. organizations_insert_policy:
   - Only service_role can INSERT

3. organizations_update_policy:
   - Users can UPDATE only their organization
   - USING (id = auth.jwt() ->> 'organizationId')

4. organizations_delete_policy:
   - Only service_role can DELETE
```

#### Users Table

**Ожидаемые policies:**
```sql
1. users_select_policy:
   - Users can SELECT users from their organization
   - USING (organizationId = auth.jwt() ->> 'organizationId')

2. users_insert_policy:
   - Users can INSERT in their organization (registration)

3. users_update_policy:
   - Users can UPDATE only themselves OR admins can update in org
   - USING (id = auth.uid() OR
           (organizationId = auth.jwt() ->> 'organizationId' AND
            auth.jwt() ->> 'role' = 'admin'))

4. users_delete_policy:
   - Only admins can DELETE in their organization
```

#### Agents Table

**Ожидаемые policies:**
```sql
1. agents_select_policy:
   - Users can SELECT agents from their organization
   - USING (organizationId = auth.jwt() ->> 'organizationId')

2. agents_insert_policy:
   - Users can INSERT agents in their organization
   - WITH CHECK (organizationId = auth.jwt() ->> 'organizationId')

3. agents_update_policy:
   - Users can UPDATE agents in their organization
   - USING (organizationId = auth.jwt() ->> 'organizationId')

4. agents_delete_policy:
   - Users can DELETE agents in their organization
   - USING (organizationId = auth.jwt() ->> 'organizationId')
```

#### Conversations Table

**Ожидаемые policies:**
```sql
1. conversations_select_policy:
   - Users can SELECT conversations from their organization
   - USING (organizationId = auth.jwt() ->> 'organizationId')

2. conversations_insert_policy:
   - Users can INSERT conversations in their organization
   - WITH CHECK (organizationId = auth.jwt() ->> 'organizationId')

3. conversations_update_policy:
   - Users can UPDATE conversations in their organization
   - USING (organizationId = auth.jwt() ->> 'organizationId')

4. conversations_delete_policy:
   - Users can DELETE conversations in their organization
   - USING (organizationId = auth.jwt() ->> 'organizationId')
```

#### Messages Table

**Ожидаемые policies:**
```sql
1. messages_select_policy:
   - Users can SELECT messages from conversations in their org
   - USING (
       EXISTS (
         SELECT 1 FROM conversations
         WHERE id = conversationId
         AND organizationId = auth.jwt() ->> 'organizationId'
       )
     )

2. messages_insert_policy:
   - Users can INSERT messages to conversations in their org
   - WITH CHECK (
       EXISTS (
         SELECT 1 FROM conversations
         WHERE id = conversationId
         AND organizationId = auth.jwt() ->> 'organizationId'
       )
     )
```

---

## Шаг 3: Тестирование RLS policies

### 3.1 Создать тестовых пользователей

**Сценарий тестирования:**
1. Создать Organization A и User Alice
2. Создать Organization B и User Bob
3. Проверить что Alice НЕ МОЖЕТ видеть данные Bob

### 3.2 Тестовые запросы

#### Test 1: Проверка изоляции Organizations

```sql
-- Логин как Alice (org_a)
SET LOCAL jwt.claims.organizationId = 'org_a_uuid';

-- Alice должна видеть ТОЛЬКО org_a
SELECT * FROM organizations;
-- Ожидаемый результат: ТОЛЬКО 1 строка (org_a)

-- Alice НЕ должна видеть org_b
SELECT * FROM organizations WHERE id = 'org_b_uuid';
-- Ожидаемый результат: 0 строк
```

#### Test 2: Проверка изоляции Agents

```sql
-- Логин как Alice (org_a)
SET LOCAL jwt.claims.organizationId = 'org_a_uuid';

-- Создать агента Alice
INSERT INTO agents (organizationId, name)
VALUES ('org_a_uuid', 'Alice Agent')
RETURNING *;
-- Ожидаемый результат: SUCCESS

-- Попытка создать агента в чужой организации
INSERT INTO agents (organizationId, name)
VALUES ('org_b_uuid', 'Bob Agent from Alice');
-- Ожидаемый результат: ERROR (RLS policy violation)

-- Alice должна видеть ТОЛЬКО агентов org_a
SELECT * FROM agents;
-- Ожидаемый результат: ТОЛЬКО агенты org_a

-- Alice НЕ должна видеть агентов org_b
SELECT * FROM agents WHERE organizationId = 'org_b_uuid';
-- Ожидаемый результат: 0 строк
```

#### Test 3: Проверка изоляции Conversations

```sql
-- Логин как Bob (org_b)
SET LOCAL jwt.claims.organizationId = 'org_b_uuid';

-- Bob пытается прочитать conversation Alice
SELECT * FROM conversations WHERE id = 'alice_conversation_uuid';
-- Ожидаемый результат: 0 строк (RLS блокирует)

-- Bob пытается обновить conversation Alice
UPDATE conversations
SET title = 'Hacked by Bob'
WHERE id = 'alice_conversation_uuid';
-- Ожидаемый результат: 0 rows updated (RLS блокирует)
```

#### Test 4: Проверка вложенной изоляции (Messages)

```sql
-- Логин как Bob (org_b)
SET LOCAL jwt.claims.organizationId = 'org_b_uuid';

-- Bob пытается прочитать messages из conversation Alice
SELECT * FROM messages WHERE conversationId = 'alice_conversation_uuid';
-- Ожидаемый результат: 0 строк (RLS блокирует через JOIN)

-- Bob пытается создать message в conversation Alice
INSERT INTO messages (conversationId, content, role)
VALUES ('alice_conversation_uuid', 'Bob message', 'user');
-- Ожидаемый результат: ERROR (RLS policy violation)
```

---

## Шаг 4: Автоматизированное тестирование

### 4.1 Скрипт для проверки RLS

Создайте файл `/scripts/test-rls.sql`:

```sql
-- ========================================
-- RLS Testing Script
-- ========================================

-- Setup: Create test organizations and users
DO $$
DECLARE
  org_a_id UUID;
  org_b_id UUID;
  alice_id UUID;
  bob_id UUID;
BEGIN
  -- Create Organization A
  INSERT INTO organizations (name, slug)
  VALUES ('Org A Test', 'org-a-test')
  RETURNING id INTO org_a_id;

  -- Create Organization B
  INSERT INTO organizations (name, slug)
  VALUES ('Org B Test', 'org-b-test')
  RETURNING id INTO org_b_id;

  -- Create Alice (Org A)
  INSERT INTO users (email, organizationId, role)
  VALUES ('alice@test.com', org_a_id, 'user')
  RETURNING id INTO alice_id;

  -- Create Bob (Org B)
  INSERT INTO users (email, organizationId, role)
  VALUES ('bob@test.com', org_b_id, 'user')
  RETURNING id INTO bob_id;

  RAISE NOTICE 'Test data created:';
  RAISE NOTICE 'Org A: %', org_a_id;
  RAISE NOTICE 'Org B: %', org_b_id;
  RAISE NOTICE 'Alice: %', alice_id;
  RAISE NOTICE 'Bob: %', bob_id;
END $$;

-- Test 1: Alice creates agent in Org A
SET LOCAL jwt.claims.organizationId = (SELECT id FROM organizations WHERE slug = 'org-a-test');
SELECT COUNT(*) FROM agents; -- Should return agents from Org A only

-- Test 2: Alice tries to read Org B data
SELECT COUNT(*) FROM agents
WHERE organizationId = (SELECT id FROM organizations WHERE slug = 'org-b-test');
-- Expected: 0 (RLS blocks)

-- Test 3: Bob creates conversation in Org B
SET LOCAL jwt.claims.organizationId = (SELECT id FROM organizations WHERE slug = 'org-b-test');
INSERT INTO conversations (organizationId, title)
VALUES (
  (SELECT id FROM organizations WHERE slug = 'org-b-test'),
  'Bob Conversation'
);
SELECT COUNT(*) FROM conversations; -- Should return conversations from Org B only

-- Cleanup
DELETE FROM users WHERE email IN ('alice@test.com', 'bob@test.com');
DELETE FROM organizations WHERE slug IN ('org-a-test', 'org-b-test');

RAISE NOTICE '✅ All RLS tests passed!';
```

### 4.2 Запустить тестовый скрипт

```bash
# Из корня проекта
psql $SUPABASE_URL -f scripts/test-rls.sql
```

---

## Шаг 5: Проверка через приложение

### 5.1 Создать тестовых пользователей через UI

1. Зарегистрировать **Alice** (Organization A)
2. Зарегистрировать **Bob** (Organization B)

### 5.2 Тестовые сценарии

**Тест 1: Alice создает агента**
1. Логин как Alice
2. Создать агента "Alice Agent"
3. Убедиться что агент создан

**Тест 2: Bob пытается получить агента Alice**
1. Логин как Bob
2. В браузере DevTools → Console выполнить:
   ```javascript
   fetch('/api/agents', {
     headers: { Authorization: `Bearer ${bobToken}` }
   })
   .then(res => res.json())
   .then(console.log)
   ```
3. Убедиться что "Alice Agent" НЕ в списке

**Тест 3: Bob пытается получить conversation Alice**
1. Получить conversationId Alice (из БД)
2. Логин как Bob
3. Попытаться получить:
   ```javascript
   fetch(`/api/chat?conversationId=${aliceConversationId}`, {
     headers: { Authorization: `Bearer ${bobToken}` }
   })
   .then(res => res.json())
   .then(console.log)
   ```
4. Ожидаемый результат: **403 Forbidden** или **404 Not Found**

---

## Шаг 6: Исправление проблем

### Если RLS отключена на таблице

```sql
-- Включить RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Если отсутствует policy

```sql
-- Пример: Создать SELECT policy для agents
CREATE POLICY agents_select_policy
ON agents
FOR SELECT
TO authenticated
USING (organizationId = auth.jwt() ->> 'organizationId');
```

### Если policy неправильная

```sql
-- Удалить старую policy
DROP POLICY IF EXISTS policy_name ON table_name;

-- Создать новую правильную policy
CREATE POLICY policy_name ON table_name ...
```

---

## Шаг 7: Production Checklist

Перед запуском в production убедитесь:

- [ ] ✅ RLS включена на ВСЕХ публичных таблицах
- [ ] ✅ Для каждой таблицы есть policies для SELECT, INSERT, UPDATE, DELETE
- [ ] ✅ Policies используют `auth.jwt() ->> 'organizationId'` для изоляции
- [ ] ✅ Протестированы сценарии cross-organization access (должны блокироваться)
- [ ] ✅ Messages изолированы через JOIN с conversations
- [ ] ✅ Протестированы на UI с разными пользователями
- [ ] ✅ Нет таблиц с `rls_enabled = false` (кроме public таблиц типа `schema_migrations`)
- [ ] ✅ Service role НЕ используется на frontend (только backend)

---

## Шаг 8: Monitoring & Alerts

### 8.1 Настроить алерты на RLS violations

```sql
-- Создать функцию для отслеживания RLS violations
CREATE OR REPLACE FUNCTION track_rls_violations()
RETURNS TRIGGER AS $$
BEGIN
  -- Log RLS violation attempts
  INSERT INTO activity_logs (
    event_type,
    user_id,
    details,
    ip_address,
    user_agent
  ) VALUES (
    'rls_violation_attempt',
    auth.uid(),
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'attempted_org_id', NEW.organizationId,
      'user_org_id', auth.jwt() ->> 'organizationId'
    ),
    current_setting('request.headers', true)::json->>'x-real-ip',
    current_setting('request.headers', true)::json->>'user-agent'
  );

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 8.2 Настроить Grafana dashboard

Добавить панель для отслеживания:
- Количество RLS violations за день
- Топ пользователей с violations
- Топ таблиц с violations

---

## Частые ошибки

### Ошибка 1: RLS policy не применяется

**Проблема**: Policy создана, но не работает

**Причины**:
1. `auth.uid()` или `auth.jwt()` возвращает NULL
2. JWT токен не содержит `organizationId`
3. Policy использует неправильный роль (TO public вместо TO authenticated)

**Решение**:
```sql
-- Проверить JWT payload
SELECT auth.jwt();

-- Проверить роли
SELECT current_user, current_role;
```

### Ошибка 2: Infinite recursion в policies

**Проблема**: Policy вызывает сама себя

**Пример плохой policy**:
```sql
-- ❌ ПЛОХО: Рекурсия
CREATE POLICY bad_policy ON agents
FOR SELECT
USING (
  organizationId IN (
    SELECT organizationId FROM agents -- ❌ Рекурсия!
  )
);
```

**Решение**:
```sql
-- ✅ ХОРОШО: Прямое сравнение
CREATE POLICY good_policy ON agents
FOR SELECT
USING (organizationId = auth.jwt() ->> 'organizationId');
```

### Ошибка 3: Service role bypass RLS

**Проблема**: Service role игнорирует RLS

**Объяснение**: Это нормально! Service role ДОЛЖЕН иметь полный доступ для миграций и админ операций.

**Важно**:
- ❌ НИКОГДА не используйте Service Role на frontend
- ✅ Используйте Service Role ТОЛЬКО на backend (Next.js API routes, Worker)
- ✅ Frontend ВСЕГДА использует Anon Key + JWT user token

---

## Ресурсы

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [auth.jwt() helper function](https://supabase.com/docs/guides/database/postgres/row-level-security#helper-functions)

---

## Контакты

Если нужна помощь с RLS:
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)
- **Discord**: [Supabase Discord](https://discord.supabase.com)
- **Проектная документация**: `/docs/DATABASE_SCHEMA.md`

---

**ВАЖНО**: Эта проверка **ОБЯЗАТЕЛЬНА** перед production deployment. Не пропускайте её!

**Статус**: ❌ **НЕ ВЫПОЛНЕНО** - требуется выполнить перед production

**Estimated time**: 2 часа
