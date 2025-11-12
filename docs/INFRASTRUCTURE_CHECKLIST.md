# Инфраструктурный чеклист GPT Agent AI

Документ собирает инфраструктурные шаги, которые уже реализованы в репозитории, и обозначает следующий объём работы (Docker, env, мониторинг, деплой).

## 1. Docker и локальная среда
- `docker-compose.dev.yml` и `docker-compose.staging.yml` собирают Next.js, Fastify API, worker, Redis и Supabase.
- Makefile упрощает команды (`make dev`, `make staging`, `make monitoring`).
- Документация обновлена (`docs/DOCKER_SETUP.md`) с инструкциями для разработки и staging.

## 2. Переменные окружения
- Шаблоны `env.example`, `env.staging.example`, `env.production.example` консолидированы и документированы.
- Новый скрипт `scripts/verify-env.ts` (команда `npm run verify:env`, `make verify-env`) проверяет наличие значений и предупреждает о заглушках.
- `docs/ENVIRONMENT_VARIABLES.md` дополнен описанием стадий и чек-листом.

## 3. Мониторинг и наблюдаемость
- Fastify API и worker отдают Prometheus-метрики; Next.js предоставляет `/api/metrics`.
- `monitoring/docker-compose.yml` разворачивает Prometheus, Grafana, Alertmanager, node-exporter, cAdvisor и redis-exporter.
- Добавлены alert-правила для Next, Fastify и worker. Логирование переведено на Pino + интеграцию с Sentry/OTel.

## 4. Тесты и CI
- Основной workflow (`main.yml`) теперь запускает `npm run verify:env`, type-check, lint, тесты, сборку и деплой.
- Дополнительные workflow обновлены для использования секрета окружения без бэкапных значений.

## 5. Документация и дальнейшие шаги
- README ссылается на `PROJECT_STRUCTURE.md` и детали API/AI/Kommo (см. ссылки в README).  
- Следующий этап: описать `docs/INFRASTRUCTURE_CHECKLIST.md` (этот файл) в README, добавить секцию о мониторинге (Latency, queue depth, Kommo sync), и обновить `docs/PROJECT_FULL_ANALYSIS.md` по результатам реализации.
