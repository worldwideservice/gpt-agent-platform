-- Скрипт для быстрого тестирования системы подписок
-- Используйте в Supabase SQL Editor для тестирования middleware и UI

-- =====================================================
-- 1. Создание тестовой активной подписки
-- =====================================================

-- ВАЖНО: Замените 'YOUR_ORG_ID' на реальный org_id из таблицы organizations
-- Проверить org_id можно так:
-- SELECT id, name FROM organizations LIMIT 5;

INSERT INTO subscriptions (
  id,
  org_id,
  paddle_subscription_id,
  status,
  current_period_start,
  current_period_end,
  plan_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'YOUR_ORG_ID',           -- ← ЗАМЕНИТЕ НА РЕАЛЬНЫЙ ORG_ID
  'sub_test_active_001',    -- Тестовый Paddle Subscription ID
  'active',                 -- Статус: активная подписка
  NOW(),                    -- Начало периода: сейчас
  NOW() + INTERVAL '30 days',  -- Конец периода: через 30 дней
  'pro_monthly'             -- План (можно изменить на starter/scale/enterprise)
)
ON CONFLICT (org_id)
DO UPDATE SET
  status = 'active',
  current_period_start = NOW(),
  current_period_end = NOW() + INTERVAL '30 days',
  paddle_subscription_id = 'sub_test_active_001',
  updated_at = NOW();

-- Результат: Middleware разрешит мутации, LicenseAlert покажет дату через 30 дней


-- =====================================================
-- 2. Создание тестовой истекшей подписки
-- =====================================================

INSERT INTO subscriptions (
  id,
  org_id,
  paddle_subscription_id,
  status,
  current_period_start,
  current_period_end,
  plan_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'YOUR_ORG_ID',           -- ← ЗАМЕНИТЕ НА РЕАЛЬНЫЙ ORG_ID
  'sub_test_expired_002',
  'expired',                -- Статус: истекшая
  NOW() - INTERVAL '60 days',  -- Начало: 60 дней назад
  NOW() - INTERVAL '30 days',  -- Конец: 30 дней назад (истекла)
  'pro_monthly'
)
ON CONFLICT (org_id)
DO UPDATE SET
  status = 'expired',
  current_period_start = NOW() - INTERVAL '60 days',
  current_period_end = NOW() - INTERVAL '30 days',
  paddle_subscription_id = 'sub_test_expired_002',
  updated_at = NOW();

-- Результат: Middleware ЗАБЛОКИРУЕТ мутации (402), красный алерт в UI


-- =====================================================
-- 3. Создание подписки истекающей через 2 дня (warning)
-- =====================================================

INSERT INTO subscriptions (
  id,
  org_id,
  paddle_subscription_id,
  status,
  current_period_start,
  current_period_end,
  plan_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'YOUR_ORG_ID',           -- ← ЗАМЕНИТЕ НА РЕАЛЬНЫЙ ORG_ID
  'sub_test_warning_003',
  'active',
  NOW() - INTERVAL '28 days',
  NOW() + INTERVAL '2 days',  -- Истекает через 2 дня
  'pro_monthly'
)
ON CONFLICT (org_id)
DO UPDATE SET
  status = 'active',
  current_period_start = NOW() - INTERVAL '28 days',
  current_period_end = NOW() + INTERVAL '2 days',
  paddle_subscription_id = 'sub_test_warning_003',
  updated_at = NOW();

-- Результат: Middleware разрешит, но LicenseAlert покажет КРАСНЫЙ WARNING


-- =====================================================
-- 4. Проверка текущей подписки
-- =====================================================

SELECT
  org_id,
  paddle_subscription_id,
  status,
  plan_id,
  current_period_start,
  current_period_end,
  EXTRACT(DAY FROM (current_period_end - NOW())) AS days_left,
  created_at
FROM subscriptions
WHERE org_id = 'YOUR_ORG_ID'  -- ← ЗАМЕНИТЕ
ORDER BY created_at DESC
LIMIT 1;


-- =====================================================
-- 5. Удаление тестовой подписки
-- =====================================================

DELETE FROM subscriptions
WHERE org_id = 'YOUR_ORG_ID'  -- ← ЗАМЕНИТЕ
  AND paddle_subscription_id LIKE 'sub_test_%';

-- Результат: Middleware будет блокировать все мутации


-- =====================================================
-- ЧЕКЛИСТ ТЕСТИРОВАНИЯ
-- =====================================================

/*
[ ] 1. Активная подписка (30 дней):
    - Middleware НЕ блокирует POST/PUT/DELETE/PATCH
    - LicenseAlert показывает дату (не красный)
    - NotificationsPanelClient НЕ показывает алерт

[ ] 2. Истекшая подписка:
    - Middleware БЛОКИРУЕТ мутации → 402 Payment Required
    - LicenseAlert показывает КРАСНЫЙ бейдж
    - NotificationsPanelClient показывает красный алерт

[ ] 3. Подписка истекает через 2 дня:
    - Middleware НЕ блокирует
    - LicenseAlert показывает КРАСНЫЙ WARNING (< 3 дней)
    - NotificationsPanelClient показывает желтый warning

[ ] 4. Нет подписки:
    - Middleware БЛОКИРУЕТ мутации → 402
    - LicenseAlert показывает "Free Plan"
    - UI предлагает купить подписку
*/


-- =====================================================
-- ДОПОЛНИТЕЛЬНО: Проверка всех подписок
-- =====================================================

SELECT
  o.id AS org_id,
  o.name AS org_name,
  s.paddle_subscription_id,
  s.status,
  s.plan_id,
  s.current_period_end,
  CASE
    WHEN s.current_period_end < NOW() THEN 'EXPIRED'
    WHEN s.current_period_end < NOW() + INTERVAL '3 days' THEN 'WARNING'
    ELSE 'ACTIVE'
  END AS license_status,
  EXTRACT(DAY FROM (s.current_period_end - NOW())) AS days_left
FROM organizations o
LEFT JOIN subscriptions s ON s.org_id = o.id
ORDER BY o.created_at DESC
LIMIT 10;
