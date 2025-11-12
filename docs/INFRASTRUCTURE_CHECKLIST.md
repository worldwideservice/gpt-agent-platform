# Инфраструктурный чеклист GPT Agent AI

Документ собирает инфраструктурные шаги, которые уже реализованы в репозитории, и обозначает следующий объём работы (Docker, env, мониторинг, деплой).

## 1. Docker и локальная среда
- `docker-compose.yml` и `Dockerfile` описывают Next.js приложение и Redis.  
- Запуск: `docker-compose up -d redis` для разработки + `npm run dev` в контейнере.  
- Следующее: добавить `docker-compose.dev.yml`, объединяющий Next.js, Fastify/worker сервиса, Supabase CLI и Redis (пока только два сервиса).
- В документации (см. `docs/DOCKER_SETUP.md`) прописать окружение и команды `npm run docker:redis`, `npm run docker:down`.

## 2. Переменные окружения
- Список обязательных переменных описан в `docs/ENVIRONMENT_VARIABLES.md`.  
- Скрипты `scripts/check-env.js` и `scripts/verify-env.js` используются для валидации перед запуском/деплоем (`npm run check:env`, `npm run verify:env`).  
- Следующая итерация: централизовать шаблоны env (убрать дубли `.env.production 2.example`, `env.production`) и добавить команду `npm run setup:env`, которая вызывает `scripts/auto-setup-env.sh`.

## 3. Мониторинг и наблюдаемость
- `monitoring/` содержит шаблоны для Sentry/Prometheus (файлы описаны, но требуют подключения).  
- Скрипты `scripts/check-redis.js`, `scripts/check-worker.js`, `scripts/check-all-errors.sh` позволяют запускать базовые health-checked (в git-логе).  
- Необходимо: добавить `/api/health` endpoints (Next + Fastify), интегрировать alerting (Sentry DSN, Prometheus push), и описать настройки в README.

## 4. Тесты и CI
- `npm run lint`, `npm run test:unit`, `npm run test:e2e`, `npm run test:components` уже описаны (см. `package.json`).  
- `playwright` настроен для e2e/UI (см. `playwright.config.ts`).  
- Добавить GitHub workflow, который вызывает `npm run lint` и `npm run test`, а также публикует Playwright отчёт.

## 5. Документация и дальнейшие шаги
- README ссылается на `PROJECT_STRUCTURE.md` и детали API/AI/Kommo (см. ссылки в README).  
- Следующий этап: описать `docs/INFRASTRUCTURE_CHECKLIST.md` (этот файл) в README, добавить секцию о мониторинге (Latency, queue depth, Kommo sync), и обновить `docs/PROJECT_FULL_ANALYSIS.md` по результатам реализации.
