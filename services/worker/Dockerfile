# Multi-stage build для Worker сервиса
# Этот Dockerfile запускается из корня проекта (Root Directory = /)
FROM node:20-alpine AS base

# Устанавливаем рабочую директорию в корень проекта
WORKDIR /app

# Копируем package.json Worker для установки зависимостей
COPY services/worker/package.json services/worker/package-lock.json ./services/worker/

# Копируем весь проект (включая lib/)
COPY . .

# Переходим в директорию Worker и собираем
WORKDIR /app/services/worker

# Устанавливаем зависимости и собираем
RUN npm ci
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Устанавливаем wget для health check
RUN apk add --no-cache wget

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json Worker для production зависимостей
COPY services/worker/package.json services/worker/package-lock.json ./services/worker/

# Копируем собранное приложение Worker
COPY --from=base /app/services/worker/dist ./services/worker/dist

# Копируем lib директорию из корня (нужна для импортов во время выполнения)
COPY --from=base /app/lib ./lib
# Копируем lib/ в services/worker/lib/ для динамических импортов (используют ../lib/)
RUN mkdir -p ./services/worker/lib && cp -r ./lib/* ./services/worker/lib/

# Переходим в директорию Worker для установки production зависимостей
WORKDIR /app/services/worker
RUN npm ci --only=production

# Возвращаемся в корень для правильных путей импорта
WORKDIR /app

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 worker

# Меняем владельца файлов
RUN chown -R worker:nodejs /app

# Переключаемся на непривилегированного пользователя
USER worker

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3001}/health || exit 1

# Запускаем worker из services/worker/dist/index.js
CMD ["node", "services/worker/dist/index.js"]
