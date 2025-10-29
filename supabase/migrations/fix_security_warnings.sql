-- ============================================
-- ИСПРАВЛЕНИЕ ПРЕДУПРЕЖДЕНИЙ БЕЗОПАСНОСТИ
-- ============================================

-- ============================================
-- 1. ИСПРАВЛЕНИЕ: Function Search Path Mutable
-- Устанавливаем search_path для функции trigger_set_timestamp
-- ============================================

DROP FUNCTION IF EXISTS public.trigger_set_timestamp() CASCADE;

CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.trigger_set_timestamp() IS 'Automatically updates updated_at timestamp. Search path is set for security.';

-- Пересоздаем все триггеры, которые используют эту функцию
DO $$
DECLARE
  r RECORD;
BEGIN
  -- Находим все таблицы с триггерами updated_at
  FOR r IN 
    SELECT DISTINCT 
      schemaname,
      tablename
    FROM pg_trigger t
    JOIN pg_proc p ON t.tgfoid = p.oid
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname = 'trigger_set_timestamp'
    AND t.tgname LIKE '%_updated_at'
  LOOP
    -- Восстанавливаем триггеры
    EXECUTE format('
      DROP TRIGGER IF EXISTS %I ON %I.%I;
      CREATE TRIGGER %I
      BEFORE UPDATE ON %I.%I
      FOR EACH ROW
      EXECUTE FUNCTION public.trigger_set_timestamp();
    ', 
      r.tablename || '_updated_at',
      r.schemaname,
      r.tablename,
      r.tablename || '_updated_at',
      r.schemaname,
      r.tablename
    );
  END LOOP;
END $$;

-- ============================================
-- 2. ПРИМЕЧАНИЕ: Extension in Public
-- Расширение vector в public схеме - это нормально для Supabase
-- Но можно переместить в отдельную схему при необходимости
-- (Оставляем как есть, т.к. это стандартная практика для Supabase pgvector)
-- ============================================

-- ============================================
-- 3. ПРИМЕЧАНИЕ: Leaked Password Protection
-- Это настройка в Supabase Auth Dashboard
-- Включите вручную: Authentication > Settings > Password
-- ============================================

