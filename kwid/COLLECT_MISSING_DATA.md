# 🚀 Сбор недостающих данных KWID

> Дата: 2025-01-26  
> Статус: Готово к запуску

## 📋 Что нужно собрать

### Приоритет 1: Критичные payload'ы

1. **manual_generation toggle** - включение/выключение
2. **Knowledge Base CRUD** - успешные create/delete
3. **newChat** - создание нового чата

## 🎯 Инструкция по запуску

### Вариант 1: Через скрипт (рекомендуется)

**Шаг 1:** Откройте KWID в браузере:
```
https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices/ai-agents/553/edit
```

**Шаг 2:** Запустите скрипты для сбора данных:

```bash
# 1. Собрать manual_generation toggle
npx ts-node scripts/kwid-scrape.ts --scenario agents:toggle-manual-generation --headed

# 2. Собрать успешное создание статьи Knowledge Base
npx ts-node scripts/kwid-scrape.ts --scenario knowledge:item-create-success --headed

# 3. Собрать newChat для test-chat
npx ts-node scripts/kwid-scrape.ts --scenario test-chat:new --headed
```

### Вариант 2: Через MCP Playwright (если браузер подключен)

Скрипт автоматически найдет открытую вкладку KWID и использует её.

## 📁 Результаты

Все собранные данные сохраняются в:
- `kwid/raw/scrape/actions/` - Livewire payloads
- `kwid/raw/scrape/actions/parsed/` - Parsed версии

## ✅ После сбора

Обновите `kwid/TODO_REMAINING_TASKS.md`, отметив выполненные задачи.


