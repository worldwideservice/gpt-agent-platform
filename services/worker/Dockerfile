# Multi-stage build для Worker сервиса
FROM node:20-alpine AS base

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем зависимости для сборки
COPY package.json package-lock.json ./
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Устанавливаем wget для health check
RUN apk add --no-cache wget

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json для production зависимостей
COPY package.json package-lock.json ./

# Устанавливаем только production зависимости
RUN npm ci --only=production

# Копируем собранное приложение из предыдущего этапа
COPY --from=base /app/dist ./dist

# Копируем tsconfig и другие необходимые файлы
COPY --from=base /app/tsconfig.json ./

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

# Запускаем worker
CMD ["node", "dist/index.js"]

