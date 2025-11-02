-- ============================================
-- ИСПРАВЛЕНИЕ: Добавление политики INSERT для users
-- Разрешает создание пользователей через регистрацию
-- ============================================

-- Удаляем старые политики для users если есть
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Service role can manage users" ON public.users;
DROP POLICY IF EXISTS "Allow user registration" ON public.users;

-- Политика SELECT: пользователи видят только свои данные
CREATE POLICY "Users can view own data" ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Политика UPDATE: пользователи могут обновлять свои данные
CREATE POLICY "Users can update own data" ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- КРИТИЧНО: Политика INSERT для регистрации
-- Разрешает создание пользователей (для регистрации через API)
-- Service role обходит RLS, но эта политика нужна для дополнительной безопасности
CREATE POLICY "Allow user registration" ON public.users
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Для service role - полный доступ (хотя service role должен обходить RLS)
-- Но на всякий случай добавляем
CREATE POLICY "Service role can manage users" ON public.users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

