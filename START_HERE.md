# 🎯 НАЧНИ ОТСЮДА - Полная настройка проекта

## ✅ Что уже сделано автоматически

- ✅ Созданы шаблоны `.env` файлов
- ✅ Создан Docker Compose для Redis
- ✅ Настроены скрипты автоматизации
- ✅ Создана подробная документация

## 📋 Ваши следующие шаги (30 минут)

### Шаг 1: Переменные окружения (10 минут)

**Автоматический способ:**
```bash
bash scripts/auto-setup-env.sh
```

Затем заполните **реальные значения** в созданных файлах.

**Что нужно получить:**

1. **Supabase** (5 мин):
   - https://supabase.com/dashboard → Settings → API
   - Скопируйте: URL, anon key, service_role key
   - Получите ORGANIZATION_ID через SQL Editor

2. **OpenRouter** (3 мин):
   - https://openrouter.ai/keys → Create Key
   - Скопируйте ключ

3. **Проверка:**
   ```bash
   npm run check:env
   ```

### Шаг 2: Redis (2 минуты)

```bash
docker-compose up -d redis
```

Или установите локально:
```bash
brew install redis && brew services start redis  # macOS
```

### Шаг 3: Миграции БД (3 минуты)

1. **Откройте Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Выберите проект
   - SQL Editor → New query

2. **Скопируйте SQL:**
   - Откройте файл: `scripts/apply-all-setup.sql`
   - Ctrl+A, Ctrl+C (выделить всё, скопировать)

3. **Выполните:**
   - Вставьте в SQL Editor (Ctrl+V)
   - Нажмите Run (или F5)

4. **Проверьте:**
   - Должны вернуться 5 таблиц
   - Должен вернуться 1 bucket

### Шаг 4: Запуск (15 минут)

**Терминал 1 - Redis:**
```bash
docker-compose up -d redis
```

**Терминал 2 - Frontend:**
```bash
npm install
npm run dev
```

**Терминал 3 - Backend API:**
```bash
cd services/api
npm install
npm run dev
```

**Терминал 4 - Worker:**
```bash
cd services/worker
npm install
npm run dev
```

### Шаг 5: Проверка работы

1. Откройте http://localhost:3000
2. Войдите в систему
3. Создайте тестового агента
4. Попробуйте загрузить файл
5. Протестируйте чат

## 📚 Дополнительная документация

- **Детальный анализ:** `PROJECT_ANALYSIS_RU.md`
- **Пошаговый деплой:** `DEPLOY_STEPS.md`
- **Быстрый старт:** `QUICK_START.md`

## 🆘 Проблемы?

### "Environment variable not found"
→ Проверьте что все `.env` файлы созданы и заполнены

### "Cannot connect to Redis"
→ Убедитесь что Redis запущен: `docker-compose ps`

### "Database migration failed"
→ Проверьте SQL скрипт, возможно нужно выполнить по частям

### "OpenRouter API key invalid"
→ Проверьте формат ключа: должен начинаться с `sk-or-v1-`

## ✅ Готово к деплою?

См. `DEPLOY_STEPS.md` для полной инструкции по деплою на продакшен.

---

**После выполнения всех шагов ваш сервис готов к использованию! 🎉**

