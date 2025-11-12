# Docker Setup для локальной разработки

> Полная инструкция по настройке Docker для локальной разработки GPT Agent AI Platform
> 
> **Версия:** 1.0  
> **Дата обновления:** 2025-01-26

## 📋 Содержание

1. [Быстрый старт](#быстрый-старт)
2. [Структура Docker](#структура-docker)
3. [docker-compose.yml](#docker-composeyml)
4. [Dockerfile](#dockerfile)
5. [Локальная разработка](#локальная-разработка)
6. [Production деплой](#production-деплой)
7. [Troubleshooting](#troubleshooting)

---

## Быстрый старт

### 1. Клонирование и настройка

```bash
# Клонировать репозиторий
git clone <repository-url>
cd gpt-agent-ai

# Скопировать примеры переменных окружения
cp env.example .env.local

# Отредактировать .env.local с вашими настройками
nano .env.local
```

### 2. Запуск сервисов через Docker

```bash
# Полное dev-окружение (Next + Fastify + Worker + Redis + Supabase)
make dev

# Остановить контейнеры
make dev-down

# Поднять monitoring-стек (Prometheus + Grafana + Alertmanager)
make monitoring
```

### 3. Альтернатива: запуск без Docker

```bash
# Установить зависимости
npm install

# Запустить Next.js (используя локальные сервисы)
npm run dev

# Запустить Fastify API и worker при необходимости
npm run api:dev
(cd services/worker && npm run dev)
```

---

## Структура Docker

### docker-compose.dev.yml

Dev-конфигурация разворачивает полный стек:

- `next`: Next.js в режиме разработки с hot-reload.
- `fastify`: API на Fastify (`npm run api:dev`).
- `worker`: BullMQ worker + health-сервер на `3001`.
- `redis`: локальный Redis для очередей.
- `supabase`: контейнер с Postgres (заменяет Supabase для локальной работы).

### docker-compose.staging.yml

Staging-вариант эмулирует продакшен: контейнеры собираются из исходников (`npm install --omit=dev`), сервисы стартуют в production-режиме.

### Dockerfile

Многоэтапная сборка для оптимизации размера образа:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Создать пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копировать необходимые файлы
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Меняем владельца
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

---

## Локальная разработка

### Вариант 1: Только Redis в Docker

```bash
# Запустить только Redis
docker-compose up -d redis

# Запустить приложение локально
npm run dev
```

**Преимущества:**
- Быстрая разработка
- Hot reload
- Легкая отладка

### Вариант 2: Все в Docker

```bash
# Запустить все сервисы
docker-compose up -d

# Просмотр логов
docker-compose logs -f app
```

**Преимущества:**
- Изолированная среда
- Идентичная production среде
- Легко переключаться между проектами

### Вариант 3: Docker Compose для разработки

Создайте `docker-compose.dev.yml`:

```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes

  # PostgreSQL (если не используется Supabase)
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: gpt_agent
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  redis-data:
  postgres-data:
```

Запуск:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

---

## Production деплой

### Оптимизированный Dockerfile для production

```dockerfile
# Используем Node.js 20 Alpine для минимального размера
FROM node:20-alpine AS base

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем собранное приложение из предыдущего этапа
COPY --from=base /app/package*.json ./
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.js ./
COPY --from=base /app/services ./services
COPY --from=base /app/scripts ./scripts

# Устанавливаем только production зависимости
RUN npm ci --only=production

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Меняем владельца файлов
RUN chown -R nextjs:nodejs /app
USER nextjs

# Экспонируем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]
```

### Docker Compose для production

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: gpt-agent-app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    container_name: gpt-agent-redis
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
    restart: unless-stopped
    networks:
      - app-network

volumes:
  redis-data:

networks:
  app-network:
    driver: bridge
```

---

## Команды Docker

### Основные команды

```bash
# Запустить сервисы
docker-compose up -d

# Остановить сервисы
docker-compose down

# Перезапустить сервисы
docker-compose restart

# Просмотр логов
docker-compose logs -f [service-name]

# Просмотр статуса
docker-compose ps

# Выполнить команду в контейнере
docker-compose exec [service-name] [command]

# Пересобрать образы
docker-compose build

# Очистить volumes (удалит данные!)
docker-compose down -v
```

### Redis команды

```bash
# Подключиться к Redis CLI
docker-compose exec redis redis-cli

# Проверить статус Redis
docker-compose exec redis redis-cli ping

# Очистить Redis
docker-compose exec redis redis-cli FLUSHALL
```

---

## Troubleshooting

### Проблема: Порт уже занят

```bash
# Проверить, что использует порт
lsof -i :3000
lsof -i :6379

# Изменить порт в docker-compose.yml
ports:
  - "3001:3000"  # Внешний:Внутренний
```

### Проблема: Redis не подключается

```bash
# Проверить статус Redis
docker-compose ps redis

# Проверить логи
docker-compose logs redis

# Перезапустить Redis
docker-compose restart redis
```

### Проблема: Ошибки сборки

```bash
# Очистить кэш Docker
docker system prune -a

# Пересобрать без кэша
docker-compose build --no-cache
```

### Проблема: Переменные окружения не загружаются

```bash
# Проверить, что .env.local существует
ls -la .env.local

# Проверить синтаксис .env.local
cat .env.local

# Перезапустить с перезагрузкой env
docker-compose down
docker-compose up -d
```

---

## Оптимизация

### Multi-stage build для уменьшения размера

```dockerfile
# Используйте multi-stage build
FROM node:20-alpine AS builder
# ... build steps ...

FROM node:20-alpine AS runner
# ... только необходимые файлы ...
```

### .dockerignore

Создайте `.dockerignore`:

```
node_modules
.next
.git
.env.local
.env*.local
*.log
.DS_Store
coverage
.nyc_output
.vscode
.idea
```

---

## Мониторинг

### Health checks

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### Логирование

```bash
# Просмотр логов в реальном времени
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f app

# Последние 100 строк
docker-compose logs --tail=100 app
```

---

## Безопасность

### Рекомендации

1. **Не коммитьте секреты** в Dockerfile или docker-compose.yml
2. **Используйте env_file** для переменных окружения
3. **Запускайте от непривилегированного пользователя** (nextjs)
4. **Используйте минимальные образы** (Alpine)
5. **Регулярно обновляйте базовые образы**

### Пример безопасной конфигурации

```dockerfile
# Создать непривилегированного пользователя
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Меняем владельца
RUN chown -R nextjs:nodejs /app

# Переключаемся на пользователя
USER nextjs
```

---

## Полезные ссылки

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
- [Redis Docker Hub](https://hub.docker.com/_/redis)

---

**Дата создания:** 2025-01-26  
**Версия:** 1.0

