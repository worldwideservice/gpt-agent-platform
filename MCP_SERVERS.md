# 🔌 MCP Серверы - Model Context Protocol

## Что такое MCP?

**MCP (Model Context Protocol)** - это протокол, который позволяет AI-ассистентам в Cursor IDE получать доступ к внешним инструментам и данным через специальные серверы.

---

## ✅ Подключенные MCP серверы

### 1. 🗂️ Filesystem MCP Server

**Назначение:** Предоставляет AI доступ к файловой системе проекта

**Возможности:**
- ✅ Чтение файлов проекта
- ✅ Просмотр структуры директорий
- ✅ Поиск файлов
- ✅ Анализ содержимого
- ✅ Навигация по файловой системе

**Использование в Cursor:**
```
💬 "Покажи все TypeScript файлы в папке components"
💬 "Найди все файлы, которые импортируют Button компонент"
💬 "Какие файлы были изменены недавно?"
```

**Конфигурация:**
```json
{
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "/path/to/project"
  ]
}
```

---

### 2. 🎭 Playwright MCP Server

**Назначение:** Интеграция с Playwright для автоматизации тестирования и браузера

**Возможности:**
- ✅ Создание E2E тестов
- ✅ Автоматизация браузера
- ✅ Скриншоты веб-страниц
- ✅ Тестирование UI компонентов
- ✅ Проверка accessibility

**Использование в Cursor:**
```
💬 "Создай Playwright тест для страницы логина"
💬 "Напиши E2E тест для создания агента"
💬 "Добавь тест для проверки формы регистрации"
```

**Установлено:**
```bash
npm install -D @playwright/test
```

**Конфигурация:**
```json
{
  "command": "npx",
  "args": [
    "-y",
    "@playwright/mcp-server"
  ]
}
```

---

## 📝 Файл конфигурации

### Расположение
```
.cursor/mcp.json
```

### Содержимое
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/maksimgolovaty/Library/Mobile Documents/com~apple~CloudDocs/Development/AI agent"
      ]
    },
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp-server"
      ]
    }
  }
}
```

---

## 🚀 Как использовать MCP серверы

### 1. Автоматическая активация

После создания `.cursor/mcp.json` и перезапуска Cursor IDE, MCP серверы активируются автоматически.

### 2. В Cursor Chat

MCP серверы расширяют возможности AI в Cursor Chat:

#### Filesystem примеры:

```
💬 "Найди все компоненты, которые используют useState"

✅ AI просканирует файлы через Filesystem MCP и покажет список
```

```
💬 "Покажи структуру папки components"

✅ AI покажет дерево файлов используя Filesystem MCP
```

```
💬 "Какие файлы импортируют Kommo API?"

✅ AI найдет все импорты через grep в Filesystem MCP
```

#### Playwright примеры:

```
💬 "Создай тест для проверки создания агента"

✅ AI создаст Playwright тест с правильными селекторами
```

```
💬 "Напиши E2E тест для формы логина"

✅ AI создаст тест с заполнением полей и проверкой
```

```
💬 "Добавь accessibility тесты для главной страницы"

✅ AI создаст тесты с проверками ARIA атрибутов
```

### 3. В Composer (Cmd+I)

При использовании Composer, MCP серверы предоставляют контекст:

```
✨ Composer: "Рефактори компонент Button"

🔍 Filesystem MCP:
- Найдет все использования Button
- Покажет импорты
- Проанализирует зависимости

✅ AI предложит рефакторинг учитывая все использования
```

---

## 💡 Практические примеры

### Пример 1: Анализ структуры проекта

**Промпт:**
```
Проанализируй структуру папки components и расскажи какие UI компоненты есть
```

**Что делает Filesystem MCP:**
1. Сканирует папку `components/`
2. Читает содержимое файлов
3. Анализирует экспорты и типы
4. Находит зависимости

**Результат:**
```
📊 Найдено UI компонентов:
- Button (5 вариантов)
- Card (Header, Body, Footer)
- Input (с валидацией)
- Table (с сортировкой)
- Modal (с анимацией)
...
```

### Пример 2: Создание тестов

**Промпт:**
```
Создай Playwright тесты для всех страниц в app/
```

**Что делает Playwright MCP:**
1. Анализирует страницы
2. Определяет интерактивные элементы
3. Создает тестовые сценарии
4. Добавляет проверки

**Результат:**
```typescript
// tests/dashboard.spec.ts
import { test, expect } from '@playwright/test'

test('Dashboard page loads correctly', async ({ page }) => {
  await page.goto('http://localhost:3000')
  
  // Проверка заголовка
  await expect(page.getByText('Инфопанель')).toBeVisible()
  
  // Проверка статистики
  await expect(page.getByText('Ответы ИИ за месяц')).toBeVisible()
  
  // Проверка графика
  await expect(page.locator('.chart')).toBeVisible()
})
```

### Пример 3: Поиск и рефакторинг

**Промпт:**
```
Найди все места где используется устаревший API и предложи замену
```

**Что делает Filesystem MCP:**
1. Grep по всем файлам
2. Анализирует импорты
3. Находит паттерны использования
4. Показывает контекст

**Результат:**
```
🔍 Найдено 12 использований устаревшего API:

1. components/AgentTable.tsx:45
   - Старое: useEffect(() => fetchData(), [])
   - Новое: const { data } = useSWR('/api/agents')

2. app/chat/page.tsx:78
   - Старое: setState(prev => [...prev, item])
   - Новое: setState(items => [...items, item])

...
```

---

## 🛠️ Настройка и проверка

### 1. Проверка установки

После перезапуска Cursor IDE проверьте:

```
Settings → MCP Servers
```

Должны отображаться:
- ✅ filesystem (активен)
- ✅ playwright (активен)

### 2. Тестирование

Откройте Cursor Chat и попробуйте:

```
💬 "Покажи все файлы в папке app/"
```

Если MCP работает, вы получите список файлов.

### 3. Отладка

Если MCP серверы не работают:

1. **Проверьте файл конфигурации:**
```bash
cat .cursor/mcp.json
```

2. **Проверьте права:**
```bash
ls -la .cursor/
```

3. **Перезапустите Cursor IDE:**
- Закройте полностью
- Откройте заново
- Подождите 10-15 секунд

4. **Проверьте логи:**
```
Cursor → Help → Show Logs
```

---

## 📚 Дополнительные MCP серверы

### Популярные серверы с cursor.directory:

1. **GitHub MCP**
   - Интеграция с GitHub API
   - Issues, PRs, commits

2. **Database MCP**
   - Подключение к базам данных
   - Запросы и схемы

3. **Brave Search MCP**
   - Веб-поиск
   - Актуальная информация

4. **Slack MCP**
   - Интеграция со Slack
   - Сообщения, каналы

5. **Memory MCP**
   - Долгосрочная память AI
   - Контекст между сессиями

### Как добавить новый MCP сервер

Отредактируйте `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "filesystem": { ... },
    "playwright": { ... },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-token"
      }
    }
  }
}
```

---

## 🎯 Best Practices

### 1. Используйте MCP для анализа

```
✅ "Найди все TODO комментарии в проекте"
✅ "Покажи файлы без TypeScript типов"
✅ "Какие компоненты не имеют тестов?"
```

### 2. Создавайте тесты через MCP

```
✅ "Создай тесты для всех API routes"
✅ "Добавь E2E тест для user flow создания агента"
✅ "Напиши unit тесты для utils функций"
```

### 3. Рефакторинг с контекстом

```
✅ "Переименуй все использования oldFunction на newFunction"
✅ "Обнови все импорты после переименования файла"
✅ "Найди и исправь все deprecated API calls"
```

### 4. Документирование

```
✅ "Создай документацию для всех компонентов в components/ui/"
✅ "Сгенерируй JSDoc комментарии для всех функций"
✅ "Добавь примеры использования для каждого компонента"
```

---

## ⚡ Примеры промптов для MCP

### Filesystem MCP

```bash
# Анализ кода
"Найди все компоненты без PropTypes"
"Покажи файлы больше 300 строк"
"Какие файлы импортируют deprecated библиотеки?"

# Структура проекта
"Построй граф зависимостей для компонента UserProfile"
"Покажи дерево импортов для модуля auth"
"Какие компоненты используются только один раз?"

# Поиск паттернов
"Найди все console.log в production коде"
"Покажи все useState без initial value"
"Какие компоненты не используют TypeScript?"
```

### Playwright MCP

```bash
# Создание тестов
"Создай E2E тест для полного flow создания агента"
"Напиши тесты для всех форм в приложении"
"Добавь visual regression тесты для UI компонентов"

# Accessibility
"Проверь accessibility всех интерактивных элементов"
"Создай тесты для keyboard navigation"
"Протестируй screen reader compatibility"

# Performance
"Добавь тесты для измерения loading time"
"Создай тесты для проверки bundle size"
"Протестируй memory leaks в компонентах"
```

---

## 🔧 Troubleshooting

### Проблема: MCP серверы не запускаются

**Решение:**
```bash
# 1. Проверьте Node.js версию
node --version  # Должно быть >= 18

# 2. Очистите npm cache
npm cache clean --force

# 3. Переустановите зависимости
rm -rf node_modules package-lock.json
npm install

# 4. Проверьте права на .cursor/mcp.json
chmod 644 .cursor/mcp.json
```

### Проблема: Filesystem MCP не видит файлы

**Решение:**
```json
// Проверьте правильность пути в .cursor/mcp.json
{
  "filesystem": {
    "args": [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      "/полный/путь/к/проекту"  // <- Должен быть абсолютный путь
    ]
  }
}
```

### Проблема: Playwright MCP не работает

**Решение:**
```bash
# Установите Playwright browsers
npx playwright install

# Проверьте установку
npx playwright --version
```

---

## 📊 Метрики и мониторинг

MCP серверы логируют свою активность. Проверить можно в:

```
Cursor → Help → Show Logs
```

Ищите строки с `[MCP]`:
```
[MCP] Filesystem: Scanning directory /components
[MCP] Playwright: Creating test suite
[MCP] Server connected: filesystem
```

---

## ✅ Checklist после установки

- [ ] Файл `.cursor/mcp.json` создан
- [ ] Playwright установлен (`npm install -D @playwright/test`)
- [ ] Cursor IDE перезапущен
- [ ] MCP серверы показываются в настройках
- [ ] Тестовый промпт работает (`"Покажи файлы в app/"`)
- [ ] Документация прочитана

---

## 🎉 Итог

### Активированы MCP серверы:

1. **Filesystem** 🗂️
   - Анализ структуры проекта
   - Поиск файлов и кода
   - Навигация по файловой системе

2. **Playwright** 🎭
   - Создание E2E тестов
   - Автоматизация браузера
   - Accessibility проверки

### Преимущества:

- ✅ AI понимает структуру проекта
- ✅ Контекстуальные ответы
- ✅ Автоматическое создание тестов
- ✅ Глубокий анализ кода
- ✅ Умный рефакторинг

**Теперь Cursor IDE знает о вашем проекте гораздо больше! 🚀**

---

**Дата настройки:** 28 октября 2024  
**Версия проекта:** 1.0.2  
**Статус:** ✅ MCP серверы активны

