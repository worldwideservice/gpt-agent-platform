# 📦 Руководство по сбору всех данных KWID

> Полное руководство для достижения 100% покрытия данных KWID

## 🎯 Цель

Собрать **все недостающие данные** для полной репликации сервиса KWID, включая:
- Все Livewire payloads
- Все формы и их поведение
- Все UI состояния
- Все сетевые запросы
- Полные настройки Kommo Widget

## 📋 Подготовка

### 1. Убедитесь, что у вас есть доступ:
- ✅ Аккаунт в Kommo CRM (worldwideservices.kommo.com)
- ✅ Доступ к KWID (через Kommo интеграцию)
- ✅ Установлен Node.js и зависимости проекта

### 2. Откройте KWID в браузере:
```bash
# Вариант 1: Через Kommo
# 1. Войдите в Kommo
# 2. Настройки → Интеграции
# 3. Найдите "GPT Agent" или "KWID"
# 4. Нажмите "Открыть настройки"

# Вариант 2: Прямая ссылка (если есть magic link)
# https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices
```

### 3. Проверьте переменные окружения (опционально):
```bash
export KWID_AGENT_ID=553  # ID агента для тестирования
export KOMMO_ENTRY_URL=https://worldwideservices.kommo.com
export KWID_BASE_URL=https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices
```

## 🚀 Способы запуска

### Вариант 1: Автоматический сбор всех данных (рекомендуется)

Запускает все сценарии подряд без остановок:

```bash
./scripts/collect-all-kwid-data.sh
```

**Преимущества:**
- ✅ Автоматический запуск всех сценариев
- ✅ Подсчет успешных/неуспешных выполнений
- ✅ Цветной вывод для удобства

**Недостатки:**
- ⚠️ Нельзя пропускать сценарии
- ⚠️ При ошибке продолжает выполнение

### Вариант 2: Пошаговый сбор с возможностью пропуска

Интерактивный режим с возможностью пропускать сценарии:

```bash
./scripts/collect-kwid-data-step-by-step.sh
```

**Преимущества:**
- ✅ Можно пропускать сценарии (нажать 's')
- ✅ Можно выйти в любой момент (нажать 'q')
- ✅ Группировка по категориям
- ✅ Подтверждение перед каждым сценарием

### Вариант 3: Ручной запуск отдельных сценариев

Для точного контроля над каждым сценарием:

```bash
# AI Agents
npx ts-node scripts/kwid-scrape.ts --scenario agents:toggle-manual-generation --headed
npx ts-node scripts/kwid-scrape.ts --scenario agents:copy --headed
npx ts-node scripts/kwid-scrape.ts --scenario agents:pagination --headed
npx ts-node scripts/kwid-scrape.ts --scenario agents:knowledge-task-configure --headed
npx ts-node scripts/kwid-scrape.ts --scenario agents:fallback-with-url --headed

# База знаний
npx ts-node scripts/kwid-scrape.ts --scenario knowledge:item-create-success --headed
npx ts-node scripts/kwid-scrape.ts --scenario knowledge:item-delete --headed
npx ts-node scripts/kwid-scrape.ts --scenario knowledge:category-crud --headed
npx ts-node scripts/kwid-scrape.ts --scenario knowledge:bulk-delete --headed
npx ts-node scripts/kwid-scrape.ts --scenario knowledge:filters-search --headed

# Тестовый чат
npx ts-node scripts/kwid-scrape.ts --scenario test-chat:new --headed
npx ts-node scripts/kwid-scrape.ts --scenario test-chat:complete-response --headed

# Глобальные элементы
npx ts-node scripts/kwid-scrape.ts --scenario global:notifications --headed
npx ts-node scripts/kwid-scrape.ts --scenario global:theme-toggle --headed
npx ts-node scripts/kwid-scrape.ts --scenario global:breadcrumbs --headed
npx ts-node scripts/kwid-scrape.ts --scenario global:search --headed

# Kommo Widget
npx ts-node scripts/kwid-scrape.ts --scenario kommo:widget-settings --headed
```

## 📊 Список всех сценариев

### 🤖 AI Agents (5 сценариев)

1. **`agents:toggle-manual-generation`** - Тоггл "Проверять перед отправкой"
   - Собирает: Livewire payloads для enable/disable manual_generation
   - Файлы: `agent_toggle_manual_generation.*.json`

2. **`agents:copy`** - Копирование агента
   - Собирает: Livewire payload для tableAction('copy')
   - Файлы: `ai_agent_copy.*.json`

3. **`agents:pagination`** - Пагинация таблицы агентов
   - Собирает: Livewire payload для переключения страниц
   - Файлы: `ai_agents_pagination.*.json`

4. **`agents:knowledge-task-configure`** - Конфигурация задачи при отсутствии ответа
   - Собирает: Полный payload с настройками knowledge_not_found_task
   - Файлы: `knowledge_not_found_task.configure.*.json`

5. **`agents:fallback-with-url`** - Fallback сообщение с URL
   - Собирает: Payload с текстом fallback + URL
   - Файлы: `fallback_message.with_url.*.json`

### 📚 База знаний (5 сценариев)

6. **`knowledge:item-create-success`** - Успешное создание статьи
   - Собирает: Успешный response с record
   - Файлы: `knowledge_item_create.success.*.json`

7. **`knowledge:item-delete`** - Удаление статьи
   - Собирает: Livewire payload для tableAction('delete')
   - Файлы: `knowledge_item_delete.*.json`

8. **`knowledge:category-crud`** - Создание и удаление категории
   - Собирает: Успешные create/delete payloads
   - Файлы: `knowledge_category_create.success.*.json`, `knowledge_category_delete.*.json`

9. **`knowledge:bulk-delete`** - Массовое удаление
   - Собирает: Livewire payload для bulk actions
   - Файлы: `knowledge_bulk_delete.*.json`

10. **`knowledge:filters-search`** - Фильтры и поиск
    - Собирает: Payloads для фильтрации и поиска
    - Файлы: `knowledge_filters.*.json`, `knowledge_search.*.json`

### 💬 Тестовый чат (2 сценария)

11. **`test-chat:new`** - Создание нового чата
    - Собирает: Livewire payload для newChat
    - Файлы: `test_chat_new.*.json`

12. **`test-chat:complete-response`** - Полный ответ ассистента
    - Собирает: Полный response с сообщениями ассистента
    - Файлы: `test_chat_response_complete.*.json`, `test-chat.messages.complete.json`

### 🌐 Глобальные элементы (4 сценария)

13. **`global:notifications`** - Уведомления
    - Собирает: DOM модалки, Livewire payload для markAllRead
    - Файлы: `modals/notifications.*`, `notifications_mark_all_read.*.json`

14. **`global:theme-toggle`** - Переключение темы
    - Собирает: Livewire payload для переключения темы
    - Файлы: `theme_toggle.*.json`

15. **`global:breadcrumbs`** - Breadcrumbs навигация
    - Собирает: Livewire payload для переключения вкладок
    - Файлы: `navigation_tab_switch.*.json`

16. **`global:search`** - Глобальный поиск
    - Собирает: Результаты поиска, Livewire payload
    - Файлы: `global-search.json`, `global_search.*.json`

### 🔧 Kommo Widget (1 сценарий)

17. **`kommo:widget-settings`** - Настройки виджета в Kommo
    - Собирает: Полный HTML, JSON структуру, сетевые запросы
    - Файлы: `kommo-widget-settings.*`, `kommo-widget-requests.json`, `kommo-widget-responses.json`

## 📁 Где сохраняются данные

Все данные сохраняются в: `kwid/raw/scrape/`

```
kwid/raw/scrape/
├── actions/              # Livewire payloads
│   ├── *.request.json   # Request payloads
│   ├── *.response.json  # Response payloads
│   └── parsed/          # Парсированные данные
├── forms/               # Снапшоты форм
├── behavior/            # Логика работы форм
├── mapping/             # Маппинг компонентов
├── modals/              # Модальные окна
└── kommo-widget-*.json  # Данные Kommo Widget
```

## ✅ Проверка результатов

После выполнения всех сценариев проверьте:

1. **Все файлы созданы:**
   ```bash
   ls -la kwid/raw/scrape/actions/
   ```

2. **Обновите статус:**
   - Откройте `kwid/docs/KWID_SCRAPE_STATUS.md`
   - Отметьте собранные данные как ✅

3. **Проверьте структуру:**
   - Убедитесь, что все `*.request.json` имеют соответствующие `*.response.json`
   - Проверьте наличие `parsed/*.json` для важных payloads

## 🐛 Решение проблем

### Проблема: Сценарий не находит элементы на странице

**Решение:**
1. Убедитесь, что KWID открыт и загружен
2. Проверьте, что вы авторизованы
3. Попробуйте запустить сценарий вручную с `--headed` для визуального контроля

### Проблема: Livewire payload не перехватывается

**Решение:**
1. Проверьте, что страница использует Livewire
2. Убедитесь, что действие действительно выполняется
3. Проверьте консоль браузера на ошибки

### Проблема: Kommo Widget не открывается

**Решение:**
1. Убедитесь, что вы авторизованы в Kommo
2. Проверьте URL виджета в переменных окружения
3. Попробуйте открыть виджет вручную в браузере

## 📝 После сбора данных

1. **Обновите документацию:**
   - `KWID_SCRAPE_STATUS.md` - отметьте собранные данные
   - `KWID_ARCHITECTURE.md` - добавьте новые находки

2. **Проверьте полноту:**
   - Сравните список файлов с требованиями
   - Убедитесь, что все payloads имеют parsed версии

3. **Создайте резервную копию:**
   ```bash
   tar -czf kwid-backup-$(date +%Y%m%d).tar.gz kwid/
   ```

## 🎉 Готово!

После выполнения всех сценариев у вас будет **100% данных** для полной репликации KWID!

