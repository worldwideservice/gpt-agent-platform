# Используем Node.js 20 Alpine для минимального размера образа
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
