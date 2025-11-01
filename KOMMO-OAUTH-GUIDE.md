# 🔑 Полное руководство по настройке Kommo OAuth

## 🚀 Быстрый старт

### Шаг 1: Откройте OAuth Helper
```bash
# Сервер уже запущен на порту 8080
# Откройте в браузере:
open http://localhost:8080/oauth-helper.html
```

### Шаг 2: Получите токены
1. В браузере нажмите **"🚀 Начать авторизацию (авто)"**
2. Авторизуйтесь в Kommo
3. Разрешите доступ приложению
4. Токены будут получены автоматически

### Шаг 3: Тестирование
```bash
# Быстрое тестирование
node quick-test-tokens.js

# Полное тестирование
npx tsx test-kommo.ts
```

## 📋 Детальное руководство

### Актуальные данные интеграции
```
Client ID:     2a5c1463-43dd-4ccc-abd0-79516f785e57
Client Secret: 6FhlKjCZehELKIShuUQcPHdrF9uUHKLQosf0tDsSvdTuUoahVz3EO44xzVinlbh7
Redirect URI:  https://gpt-agent-kwid-44gyznxsi-world-wide-services-62780b79.vercel.app/integrations/kommo/oauth/callback
Domain:        kwid
```

### Ручной процесс (если автоматический не работает)

#### Вариант A: Использование OAuth Helper
1. Откройте `http://localhost:8080/oauth-helper.html`
2. Перейдите на вкладку **"Ручной"**
3. Нажмите **"🔗 Показать URL авторизации"**
4. Скопируйте и откройте URL в браузере
5. Авторизуйтесь в Kommo
6. Скопируйте URL после перенаправления
7. Вставьте его в поле **"URL после авторизации"**
8. Нажмите **"🔄 Обменять на токены"**

#### Вариант B: Ручной обмен кода
```bash
# 1. Получите authorization code из URL после авторизации
# URL выглядит так:
# https://gpt-agent-kwid-44gyznxsi-world-wide-services-62780b79.vercel.app/integrations/kommo/oauth/callback?code=ABC123...&state=...

# 2. Извлеките code (все после code= до &)
# 3. Обменяйте на токены:
curl -X POST https://kommo.com/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=2a5c1463-43dd-4ccc-abd0-79516f785e57" \
  -d "client_secret=6FhlKjCZehELKIShuUQcPHdrF9uUHKLQosf0tDsSvdTuUoahVz3EO44xzVinlbh7" \
  -d "grant_type=authorization_code" \
  -d "code=YOUR_CODE_HERE" \
  -d "redirect_uri=https://gpt-agent-kwid-44gyznxsi-world-wide-services-62780b79.vercel.app/integrations/kommo/oauth/callback"
```

### Обновление переменных окружения

#### Автоматически
```bash
node auto-update-env.js "YOUR_ACCESS_TOKEN" "YOUR_REFRESH_TOKEN"
```

#### Вручную
Добавьте в `.env.local`:
```bash
KOMMO_TEST_ACCESS_TOKEN=your_access_token_here
KOMMO_TEST_REFRESH_TOKEN=your_refresh_token_here
```

## 🧪 Тестирование интеграции

### Быстрое тестирование токенов
```bash
node quick-test-tokens.js
```

### Полное тестирование Kommo API
```bash
npx tsx test-kommo.ts
```

### Тестирование через OAuth Helper
1. Откройте `http://localhost:8080/oauth-helper.html`
2. Перейдите на вкладку **"Тестирование"**
3. Вставьте токены
4. Нажмите **"🧪 Протестировать токены"**

## 🔧 Устранение неполадок

### Ошибка "Invalid email or password"
- Это ошибка аутентификации приложения, а не токенов
- Используйте ручной OAuth процесс (Вариант B)
- Токены можно получить напрямую через API

### Ошибка "Redirect URI mismatch"
- Убедитесь, что в Kommo настроен правильный Redirect URI
- Должен быть: `https://gpt-agent-kwid-44gyznxsi-world-wide-services-62780b79.vercel.app/integrations/kommo/oauth/callback`

### Ошибка "Bad Request" при тестировании
- Проверьте `KOMMO_TEST_DOMAIN` в `.env.local`
- Должен быть `kwid` (не `kommo.com`)

### Токены не работают
```bash
# Проверьте токены
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     https://kwid.amocrm.ru/api/v4/users
```

## 📊 Проверка статуса

### Текущие настройки
```bash
cat .env.local | grep KOMMO_TEST
```

### Логи Kommo API
```bash
# Посмотреть логи (если настроено логирование)
tail -f logs/kommo.log
```

## 🎯 Следующие шаги

После успешного тестирования:

1. ✅ Токены работают
2. ✅ API Kommo доступен
3. ✅ Интеграция настроена

Теперь можно:
- Настраивать синхронизацию данных
- Создавать webhooks
- Разрабатывать бизнес-логику интеграции

## 📞 Поддержка

Если что-то не работает:
1. Проверьте логи браузера (F12 → Console)
2. Проверьте Network вкладку
3. Убедитесь, что сервер запущен (`python3 -m http.server 8080`)
4. Проверьте переменные окружения

---

**Создано:** 1 ноября 2025 г.
**Версия:** 2.0
