# ✅ Инструкция по применению миграций БД

## 🎯 Быстрый способ (2 минуты):

### 1. Откройте файл миграции:
```bash
open scripts/apply-all-setup.sql
# или
code scripts/apply-all-setup.sql
```

### 2. Скопируйте весь файл:
- Нажмите `Ctrl+A` (или `Cmd+A` на Mac)
- Нажмите `Ctrl+C` (или `Cmd+C`)

### 3. Откройте Supabase Dashboard:
- https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/sql/new
- Или: https://supabase.com/dashboard → выберите проект → SQL Editor → New query

### 4. Вставьте SQL:
- Вставьте скопированный код (Ctrl+V / Cmd+V)
- Нажмите **Run** (или Ctrl+Enter / Cmd+Enter)

### 5. Проверьте результат:
- Должны вернуться **5 таблиц** (в первом SELECT)
- Должен вернуться **1 bucket** (во втором SELECT)

---

## ✅ Альтернативные способы:

### Через скрипт:
```bash
bash scripts/execute-migration.sh
```

Этот скрипт:
- Откроет файл SQL для копирования
- Откроет Supabase Dashboard в браузере
- Покажет пошаговые инструкции

---

## 📋 Что будет создано:

### Таблицы:
1. ✅ `company_knowledge` - знания компании
2. ✅ `sales_scripts` - скрипты продаж
3. ✅ `objection_responses` - ответы на возражения
4. ✅ `agent_memory` - память агента
5. ✅ `agent_pipeline_settings` - настройки воронок

### Storage:
- ✅ Bucket `agent-assets` (50 MB лимит, приватный)

### Дополнительно:
- ✅ Индексы для всех таблиц
- ✅ Триггеры для обновления `updated_at`
- ✅ RLS политики для bucket

---

## 🔍 Проверка после выполнения:

Выполните в Supabase SQL Editor:

```sql
-- Проверка таблиц
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'agent_pipeline_settings',
  'company_knowledge',
  'sales_scripts',
  'objection_responses',
  'agent_memory'
)
ORDER BY table_name;

-- Проверка bucket
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'agent-assets';
```

Должно вернуться: **5 строк** в первом запросе, **1 строка** во втором.

---

## ⚠️ Если что-то пошло не так:

### Ошибка: "relation already exists"
- Таблица уже существует - это нормально
- Скрипт использует `CREATE TABLE IF NOT EXISTS`

### Ошибка: "bucket already exists"
- Bucket уже создан - это нормально
- Скрипт использует `ON CONFLICT DO NOTHING`

### Ошибка: "permission denied"
- Проверьте что вы используете Service Role Key
- Или выполните через Supabase Dashboard (автоматически использует правильные права)

---

**После успешного выполнения миграций проект готов к запуску! 🚀**

