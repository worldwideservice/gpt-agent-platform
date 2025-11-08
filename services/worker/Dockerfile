# Multi-stage build для Worker сервиса
# Этот Dockerfile запускается из services/worker (Root Directory = /services/worker)
# Railway копирует содержимое services/worker в /app
FROM node:20-alpine AS base

# Устанавливаем рабочую директорию в /app (Railway копирует сюда содержимое services/worker)
WORKDIR /app

# Копируем package.json для установки зависимостей
COPY package.json package-lock.json ./

# Копируем весь проект Worker
COPY . .

# Устанавливаем зависимости и собираем
RUN npm ci
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Устанавливаем wget для health check
RUN apk add --no-cache wget

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json для production зависимостей
COPY package.json package-lock.json ./

# Копируем собранное приложение
COPY --from=base /app/dist ./dist

# Копируем локальный lib из src/lib для резолва импортов
COPY --from=base /app/src/lib ./lib

# Копируем tsconfig.json для правильного резолва path aliases (если есть в корне)
COPY --from=base /app/tsconfig.json ./tsconfig.json 2>/dev/null || echo "No tsconfig.json in worker dir"

# Устанавливаем production зависимости
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

# Запускаем worker напрямую через tsx из node_modules
# tsx позволяет динамически импортировать .ts файлы во время выполнения
WORKDIR /app
CMD ["node", "/app/node_modules/.bin/tsx", "--tsconfig", "/app/tsconfig.json", "dist/index.js"]
