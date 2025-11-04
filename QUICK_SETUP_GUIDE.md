# 🚀 Быстрая инструкция по завершению настройки

**Дата:** 2025-01-26  
**Статус:** Критичные задачи выполнены

---

## ✅ Уже выполнено

1. ✅ **Email-сервис SendGrid** - код полностью реализован
2. ✅ **Отправка системных писем** - заглушки заменены
3. ✅ **Интеграция в восстановление пароля** - добавлена
4. ✅ **Переменные окружения в Vercel** - частично проверены

---

## ⚡ Быстрое завершение (5-10 минут)

### 1. Добавить переменные SendGrid в Vercel

**Ссылка:** https://vercel.com/world-wide-services-62780b79/gpt-agent-kwid/settings/environment-variables

**Добавить для Production:**
- `SMTP_HOST` = `smtp.sendgrid.net`
- `SMTP_PORT` = `587`
- `SMTP_USER` = `apikey`
- `SMTP_PASS` = `<SENDGRID_API_KEY>` (отметить как Sensitive)
- `FROM_EMAIL` = `noreply@worldwideservices.eu`

**Или использовать скрипт:**
```bash
./scripts/add-sendgrid-vars-vercel.sh
```

---

### 2. Проверить переменные в Railway

**Ссылка:** https://railway.app/project/[YOUR_PROJECT_ID]/variables

**Проверить наличие:**
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ENCRYPTION_KEY`
- `JOB_QUEUE_NAME` = `agent-jobs`
- `JOB_CONCURRENCY` = `25`
- `PORT` = `3001`
- `NODE_ENV` = `production`

**Обновить:**
- `RAILWAY_TOKEN` = `<RAILWAY_TOKEN>`

---

### 3. Добавить GitHub Secrets

**Ссылка:** https://github.com/worldwideservice/gpt-agent-platform/settings/secrets/actions

**Добавить:**
- `VERCEL_TOKEN` = `g5wBHt7TxDknUEIHchTJUHEK`
- `VERCEL_ORG_ID` = `team_eYhYqLCO9dqINAo5SeQGntIH`
- `VERCEL_PROJECT_ID` = `prj_oK3wwLSXPxenw9FvFZVeVp0xhGKv`

---

### 4. Ротировать токены (через браузер)

1. **Sentry:** https://sentry.io/settings/account/api/auth-tokens/
   - Создать новый токен
   - Обновить в Vercel и Railway

2. **Vercel:** https://vercel.com/account/tokens
   - Создать новый токен
   - Обновить в GitHub Secrets

3. **Upstash:** https://console.upstash.com/redis
   - Создать новый токен
   - Обновить в Railway

4. **Supabase:** https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/settings/api
   - Сгенерировать новый Service Role Key
   - Обновить в Vercel и Railway

5. **OpenRouter:** https://openrouter.ai/keys
   - Создать новый ключ
   - Обновить в Vercel

---

### 5. Настроить Cron для бэкапов

**Railway (рекомендуется):**
1. Открыть: https://railway.app/project/[YOUR_PROJECT_ID]
2. Добавить Cron Job
3. Schedule: `0 2 * * *` (каждый день в 2:00)
4. Command: `bash scripts/backup-database-cron.sh`

**Или Vercel:**
1. Открыть: https://vercel.com/world-wide-services-62780b79/gpt-agent-kwid/settings/cron-jobs
2. Добавить новый Cron Job
3. Schedule: `0 2 * * *`
4. Endpoint: `/api/cron/backup`

---

## 🧪 Тестирование

После добавления переменных SendGrid:

1. **Тест восстановления пароля:**
   - Открыть: https://gpt-agent-kwid.vercel.app/reset-password/request
   - Ввести email
   - Проверить почту (письмо должно прийти)

2. **Проверить логи:**
   - Vercel: https://vercel.com/world-wide-services-62780b79/gpt-agent-kwid/logs
   - Искать: "Email sent successfully" или "Error sending email"

---

## 📝 Примечания

- Все переменные должны быть добавлены для **Production** окружения
- `SMTP_PASS` должен быть отмечен как **Sensitive** в Vercel
- После добавления переменных требуется **новый деплой** в Vercel
- Railway автоматически подхватит новые переменные после перезапуска

---

**Время выполнения:** 5-10 минут  
**Сложность:** Легко (через веб-интерфейсы)

