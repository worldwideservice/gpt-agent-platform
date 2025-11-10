# Multi-stage build для Worker сервиса
# Railway может запускать сборку из разных директорий
FROM node:20-alpine AS base

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package.json package-lock.json* ./

# Копируем весь проект
COPY . .

# Переходим в директорию Worker (если запускаем из корня)
# Или остаемся здесь (если запускаем из services/worker)
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
COPY --from=base /app/services/worker/package.json ./services/worker/

# Копируем собранное приложение Worker
COPY --from=base /app/services/worker/dist ./services/worker/dist

# Копируем локальный lib из services/worker/src/lib для резолва импортов ../lib/* из dist/index.js
COPY --from=base /app/services/worker/src/lib ./services/worker/lib

# Копируем lib и types директории из корня (могут быть нужны для динамических импортов)
COPY --from=base /app/lib ./lib
COPY --from=base /app/types ./types
# Копируем tsconfig.json для правильного резолва path aliases
COPY --from=base /app/tsconfig.json ./tsconfig.json

# Переходим в директорию Worker для установки production зависимостей
WORKDIR /app/services/worker
RUN npm ci --only=production

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

# Запускаем worker напрямую через tsx из node_modules для поддержки TypeScript импортов из lib/
WORKDIR /app/services/worker
CMD ["node", "node_modules/.bin/tsx", "--tsconfig", "/app/tsconfig.json", "dist/index.js"]
