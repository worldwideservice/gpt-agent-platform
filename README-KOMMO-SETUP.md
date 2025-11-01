# Настройка переменных окружения для тестирования Kommo API

## Проблема
В окружении отсутствуют настроенные переменные `KOMMO_TEST_*`, необходимые для тестирования интеграции с Kommo CRM.

## Решение

### Шаг 1: Создайте файл `.env.local`
Создайте файл `.env.local` в корне проекта со следующим содержимым:

```bash
# === KOMMO CRM TESTING (DEV ONLY) ===
KOMMO_TEST_ENABLED=1
KOMMO_TEST_DOMAIN=ваш-домен-kommo
KOMMO_TEST_CLIENT_ID=ваш-client-id
KOMMO_TEST_CLIENT_SECRET=ваш-client-secret
KOMMO_TEST_REDIRECT_URI=http://localhost:3000/api/auth/kommo/callback
KOMMO_TEST_ACCESS_TOKEN=ваш-access-token
KOMMO_TEST_REFRESH_TOKEN=ваш-refresh-token
```

### Шаг 2: Получите значения для переменных

#### 2.1 Регистрация в Kommo
- Перейдите на [https://www.kommo.com/](https://www.kommo.com/)
- Создайте аккаунт или войдите в существующий

#### 2.2 Создание интеграции
1. В настройках аккаунта перейдите в раздел **"Интеграции"**
2. Создайте новое приложение для интеграции
3. Получите **CLIENT_ID** и **CLIENT_SECRET**

#### 2.3 Настройка домена
- **KOMMO_TEST_DOMAIN** - это поддомен вашего аккаунта Kommo
- Пример: если ваш URL `https://mycompany.amocrm.ru`, то домен будет `mycompany`

#### 2.4 Получение токенов доступа
Используйте OAuth 2.0 flow для получения ACCESS_TOKEN и REFRESH_TOKEN:

```javascript
// Пример кода для получения токенов
const getTokens = async () => {
  const response = await fetch(`https://${domain}.amocrm.ru/oauth2/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: AUTHORIZATION_CODE, // получить из OAuth flow
      redirect_uri: REDIRECT_URI
    })
  });

  const data = await response.json();
  console.log('Access Token:', data.access_token);
  console.log('Refresh Token:', data.refresh_token);
};
```

### Шаг 3: Тестирование настройки
После заполнения всех переменных запустите тест:

```bash
npx tsx test-kommo.ts
```

Если все настроено правильно, вы увидите:
```
🔍 Тестирование Kommo API интеграции...
🔧 API URL: https://ваш-домен.amocrm.ru/api/v4
1️⃣ Получение пользователей...
   Найдено пользователей: X
2️⃣ Получение воронок продаж...
   Найдено воронок: X
3️⃣ Получение статистики по сделкам...
   Всего сделок: X
🎉 Все тесты выполнены успешно
```

## Переменные окружения

| Переменная | Описание | Пример |
|------------|----------|---------|
| `KOMMO_TEST_ENABLED` | Включить тестирование (1/0) | `1` |
| `KOMMO_TEST_DOMAIN` | Домен Kommo аккаунта | `mycompany` |
| `KOMMO_TEST_CLIENT_ID` | ID клиентского приложения | `12345678-abcd-...` |
| `KOMMO_TEST_CLIENT_SECRET` | Секрет клиентского приложения | `abcdef123456...` |
| `KOMMO_TEST_REDIRECT_URI` | URI перенаправления OAuth | `http://localhost:3000/api/auth/kommo/callback` |
| `KOMMO_TEST_ACCESS_TOKEN` | Токен доступа | `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...` |
| `KOMMO_TEST_REFRESH_TOKEN` | Токен обновления | `def50200...` |

## Безопасность
- Файл `.env.local` игнорируется Git (проверьте `.gitignore`)
- Никогда не коммитьте реальные токены в репозиторий
- Используйте переменные только для разработки и тестирования
