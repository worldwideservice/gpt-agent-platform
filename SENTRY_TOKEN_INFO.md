# 🔑 Информация о Sentry токене

## Токен получен

```
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
```

## 📋 Информация из токена

**Декодировано:**
```json
{
  "iat": 1762182224.686496,
  "url": "https://sentry.io",
  "region_url": "https://de.sentry.io",
  "org": "world-wide-services"
}
```

**Организация:** `world-wide-services`  
**Регион:** `de.sentry.io` (немецкий регион)

---

## ⚠️ Проблема

**Ошибка API:** `"You do not have permission to perform this action."`

**Причина:** Токен не имеет прав на чтение проектов через API.

**Возможные причины:**
1. Токен не имеет нужных scopes (требуется `org:read`, `project:read`)
2. Это не API token, а токен для sourcemaps или другого назначения
3. Токен ограничен определенными проектами

---

## ✅ РЕШЕНИЕ

### Вариант 1: Получить DSN через Dashboard (30 секунд) ✅

1. Откройте: **https://sentry.io/organizations/world-wide-services/projects/**
2. Выберите проект (или создайте новый)
3. **Settings** → **Client Keys (DSN)** → Скопируйте DSN
4. Затем автоматически добавить:
   ```bash
   bash scripts/complete-sentry-setup.sh <ваш-dsn>
   ```

### Вариант 2: Создать новый API токен с правами

1. Откройте: https://sentry.io/settings/account/api/auth-tokens/
2. **Create New Token**
3. Настройки:
   - **Scopes:** `org:read`, `project:read`, `project:write`
   - **Expiration:** No expiration
4. Используйте новый токен

---

## 🚀 БЫСТРОЕ РЕШЕНИЕ

**Если у вас есть доступ к Dashboard:**

1. **Получите DSN (30 сек):**
   - https://sentry.io → Organizations → world-wide-services → Projects
   - Settings → Client Keys → Копировать DSN

2. **Автоматически добавьте в Vercel (1 мин):**
   ```bash
   bash scripts/complete-sentry-setup.sh <ваш-dsn>
   ```

**✅ Результат:** Sentry полностью настроен автоматически!

---

**Токен сохранен в:** `scripts/complete-sentry-setup.sh`  
**Готов к использованию:** После получения DSN через Dashboard


