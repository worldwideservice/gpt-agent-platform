# Токены и секреты

## Основные переменные

| Название | Где используется | Описание |
| --- | --- | --- |
| `ENCRYPTION_KEY` | API сервис | Base64 ключ (32 байта) для шифрования CRM секретов. Генерируется `openssl rand -base64 32`. |
| `BACKEND_API_URL` | Frontend | URL Fastify API (`http://localhost:4000`). |
| `KOMMO_OAUTH_REDIRECT_BASE` | Frontend/API | URL страницы `app/integrations/kommo/oauth/callback`. |
| `KOMMO_WEBHOOK_SECRET` | API сервис | Секрет для проверки подписи Kommo Webhook. |
| `REDIS_URL` | API & Worker | Подключение к Redis (`redis://localhost:6379`). |
| `OPENROUTER_API_KEY` | API & Worker | Токен доступа к OpenRouter (LLM). |
| `CTX7_TOKEN` | MCP серверы/LLM | Токен для ctx7 (если используется). |
| `TVLY_TOKEN` | Интеграции | Токен Tavily API. |

## Kommo OAuth
1. Создайте приложение в Kommo (Разработчикам → API).
2. Укажите Redirect URI: `https://<ваш-домен>/integrations/kommo/oauth/callback`.
3. Полученные Client ID/Secret вводятся через UI (`Интеграции → Kommo`). Секреты шифруются на backend.
4. Webhook подписывается в Kommo на endpoint `https://<api-domain>/kommo/webhook` и использует `KOMMO_WEBHOOK_SECRET`.

## Хранение
- В локальной разработке — файл `.env.local` (Next.js) и `.env` в `services/api` / `services/worker`.
- В production: используйте Secret Manager (Supabase Vault, Doppler, AWS Secrets Manager и т. д.).
- Никогда не коммитьте реальные токены в репозиторий.

## Проверка
- Fastify API выводит предупреждение, если переменная отсутствует.
- Worker падает при запуске, если нет `REDIS_URL` или ключей Supabase.
- UI показывает ошибки, если OAuth не стартует (отсутствуют сохранённые креденшелы).
