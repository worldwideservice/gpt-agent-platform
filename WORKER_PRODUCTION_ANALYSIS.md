# 🔍 Worker сервис - Анализ Production Readiness

**Дата:** 2024-11-15  
**Статус:** ❌ НЕ ГОТОВ К PRODUCTION (45/100)  
**Критичность:** 🔴 ВЫСОКАЯ

---

## 📊 ИТОГОВАЯ ОЦЕНКА

| Категория | Оценка | Статус |
|-----------|--------|--------|
| **Архитектура** | 8/10 | ✅ Хорошая |
| **Надежность** | 3/10 | ❌ Критичные баги |
| **Observability** | 8/10 | ✅ Хорошая |
| **Code Quality** | 6/10 | ⚠️ Есть проблемы |
| **Documentation** | 2/10 | ❌ Почти нет |
| **Testing** | 0/10 | ❌ Нет тестов |
| **Deployment** | 5/10 | ⚠️ Конфликты конфига |
| **ИТОГО** | **45/100** | **❌ НЕГОТОВ** |

---

## 🔴 КРИТИЧНЫЕ ПРОБЛЕМЫ (Must Fix)

### 1. BUG: updateAssetStatus() - Некорректные вызовы
**Файл:** `/services/worker/src/tasks/process-asset.ts`  
**Строки:** 410, 510, 518  
**Severity:** 🔴 CRITICAL

Функция определена как принимающая 2 параметра:
```typescript
const updateAssetStatus = async (assetId: string, update: AssetStatusUpdate)
```

Но вызывается неправильно:
```typescript
// ❌ Строка 410
await updateAssetStatus(assetId, 'processing')

// ❌ Строка 510
await updateAssetStatus(assetId, 'completed', null, chunksWithEmbeddings.length)

// ❌ Строка 518
await updateAssetStatus(assetId, 'failed', errorMessage)
```

**Риск:** Asset статус НЕ обновляется в БД, остается stuck в "обработке"

---

### 2. MISSING: Graceful Shutdown
**Файл:** `/services/worker/src/index.ts`  
**Severity:** 🔴 CRITICAL

Отсутствует обработка SIGTERM/SIGINT сигналов. При restart/масштабировании:
- Kubernetes отправляет SIGTERM
- Worker не закрывается корректно
- Jobs могут быть потеряны или обработаны дважды

**Решение:** Добавить в конец index.ts:
```typescript
process.on('SIGTERM', async () => {
  await worker.close()
  await connection.quit()
  process.exit(0)
})
```

---

### 3. MISSING: Dead Letter Queue (DLQ)
**Файл:** `/services/worker/src/index.ts`  
**Severity:** 🔴 CRITICAL

После 5-10 неудачных попыток job просто удаляется:
```typescript
removeOnFail: {
  count: 5000,
  age: 7 * 24 * 3600, // 7 дней - потом УДАЛЯЕТСЯ БЕЗ УВЕДОМЛЕНИЯ!
}
```

**Риск:** 
- CRM sync jobs теряются
- Message sending jobs исчезают
- Нет возможности отладить
- Администратор не узнает о проблеме

---

### 4. MISSING: Job Timeout
**Файл:** `/services/worker/src/index.ts`  
**Severity:** 🔴 CRITICAL

Worker создается БЕЗ timeout:
```typescript
const worker = new Worker(
  env.JOB_QUEUE_NAME,
  handler,
  {
    // ❌ timeout НЕ УСТАНОВЛЕН!
    lockDuration: 30000,
    lockRenewTime: 15000,
  }
)
```

**Риск:** Зависшие jobs навсегда блокируют worker slot

---

### 5. MISSING: npm Dependencies
**Файл:** `/services/worker/package.json`  
**Severity:** 🔴 CRITICAL

Используются пакеты которых нет в зависимостях:
- ❌ `pdf-parse` - для обработки PDF
- ❌ `mammoth` - для обработки DOCX

Код требует их (process-asset.ts, строки 150-176), но они не указаны в package.json

**Риск:** Runtime error при обработке PDF/DOCX файлов

---

## 🟠 СЕРЬЕЗНЫЕ ПРОБЛЕМЫ (High Priority)

### 6. Config Conflicts: JOB_CONCURRENCY
**Разные значения в разных файлах:**
- env.ts: default = 25
- railway.json: 5
- render.yaml: 5

**Риск:** Непредсказуемое поведение в production

---

### 7. OpenRouter Rate Limiting не интегрирован
**Файл:** `/services/worker/src/lib/openrouter-rate-limit.ts`  
**Severity:** 🟠 SERIOUS

Класс создан но никто не использует его! processAsset и extractKnowledgeGraph вызывают OpenRouter API БЕЗ rate limiting проверки.

**Риск:** При 25 concurrent jobs легко превышаются лимиты API (429 errors)

---

### 8. console.log вместо logger
**Файл:** `/services/worker/src/tasks/process-asset.ts`  
**Строки:** 309, 434, 512, 515, 357

**Проблемы:**
- Несходится с остальным кодом (используется `logger`)
- Не структурировано в JSON (production logs)
- Нельзя фильтровать в log aggregation системах

---

## ⚠️ ВАЖНЫЕ ПРОБЛЕМЫ (Medium Priority)

- Process Asset loads entire files into memory (OOM risk)
- Knowledge Graph extraction swallows errors silently
- No unit/integration tests (0% coverage)
- Webhook validation может быть обойдена если KOMMO_WEBHOOK_SECRET не установлен
- Docker использует tsx вместо pre-compiled код

---

## ✅ ЧТО РАБОТАЕТ ХОРОШО

- ✅ Redis интеграция (TLS, retry strategy)
- ✅ BullMQ configuration (concurrency, locks)
- ✅ Logging & Monitoring (Pino, OpenTelemetry, Sentry)
- ✅ Prometheus metrics
- ✅ Health check endpoints
- ✅ CRM integration (Kommo)
- ✅ Asset processing (multiple formats)
- ✅ Knowledge Graph extraction

---

## 🚀 DEPLOYMENT CHECKLIST

### CRITICAL (Must fix перед production):
- [ ] Исправить updateAssetStatus bug
- [ ] Добавить graceful shutdown
- [ ] Установить pdf-parse и mammoth
- [ ] Добавить timeout для worker
- [ ] Реализовать Dead Letter Queue

### HIGH PRIORITY (First week):
- [ ] Синхронизировать JOB_CONCURRENCY
- [ ] Интегрировать OpenRouter rate limiting
- [ ] Заменить console.log на logger
- [ ] Настроить alerting для failed jobs

### MEDIUM PRIORITY:
- [ ] Добавить unit tests
- [ ] Memory monitoring
- [ ] Monitoring dashboard
- [ ] Load testing

---

## 📋 ДЕТАЛЬНЫЙ ОТЧЕТ

Для более подробного анализа смотрите:
- `WORKER_CRITICAL_ISSUES_WITH_CODE.md` - кодовые примеры проблем
- `WORKER_ANALYSIS_SUMMARY.txt` - полный текстовый отчет

---

## 💡 РЕКОМЕНДАЦИЯ

**НЕ деплоить в production** без исправления хотя бы 5 критичных проблем.

После исправления критичных можно деплоить с:
- ВНИМАТЕЛЬНЫМ мониторингом
- Alerting настроенным
- DLQ dashboard доступным

