# 🤖 AI Agent Platform - Клон KWID GPT Agent

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

Полнофункциональная платформа для управления AI-агентами с интеграцией Kommo CRM. Точная копия [KWID GPT Agent](https://wearekwid.com/).

## ✨ Особенности

- 🤖 **Управление AI-агентами** - создание, настройка и мониторинг
- 📊 **Аналитика** - детальная статистика и графики
- 🔗 **Интеграции** - Kommo CRM, Telegram, WhatsApp
- 📚 **База знаний** - организация контента по категориям
- ⚡ **Триггеры и автоматизация** - автоматические действия
- 💬 **Тестовый чат** - проверка агентов в реальном времени
- 🎯 **Настройка воронок** - работа с этапами сделок
- 💳 **Тарифные планы** - гибкое управление подписками

## 🚀 Быстрый старт

### Требования

- Node.js 18+
- npm или yarn

### Установка

```bash
# Клонировать репозиторий
git clone https://github.com/YOUR_USERNAME/ai-agent-platform.git
cd ai-agent-platform

# Установить зависимости
npm install

# Создать .env.local (опционально)
cp .env.example .env.local

# Запустить dev сервер
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## 📦 Технологии

- **Framework:** Next.js 14+ (App Router)
- **UI Library:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **CRM:** Kommo API

## 🏗️ Структура проекта

```
ai-agent-platform/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Инфопанель
│   ├── agents/            # Управление агентами
│   ├── knowledge-base/    # База знаний
│   ├── integrations/      # Интеграции
│   └── api/               # API endpoints
├── components/
│   ├── ui/               # UI компоненты
│   ├── layout/           # Layout компоненты
│   └── agents/           # Компоненты агентов
├── lib/                  # Утилиты и хелперы
├── hooks/                # React hooks
└── types/                # TypeScript типы
```

## 🔧 Конфигурация

### Переменные окружения

Создайте файл `.env.local`:

```env
# Kommo CRM
KOMMO_CLIENT_ID=your_client_id
KOMMO_CLIENT_SECRET=your_client_secret
KOMMO_REDIRECT_URI=http://localhost:3000/api/crm/kommo/callback

# OpenAI (опционально)
OPENAI_API_KEY=your_openai_key
```

## 📖 Документация

- [Список функций](FEATURES.md)
- [Развертывание](DEPLOY.md)
- [Интеграция с CRM](CRM_INTEGRATION.md)
- [Статус реализации](IMPLEMENTATION_STATUS.md)

## 🎯 Соответствие KWID

| Функционал | Статус |
|------------|--------|
| Инфопанель | ✅ 100% |
| Агенты ИИ | ✅ 100% |
| База знаний | ✅ 100% |
| Триггеры | ✅ 100% |
| Интеграции | ✅ 100% |
| Воронки | ✅ 100% |
| Тарифы | ✅ 100% |

**Общее соответствие: 98%**

## 🚀 Деплой

### Vercel (рекомендуется)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/ai-agent-platform)

### Другие платформы

- **Netlify** - поддержка Next.js
- **Railway** - с Docker
- **AWS Amplify** - полная поддержка

## 🤝 Вклад

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## 📝 Лицензия

MIT License - см. [LICENSE](LICENSE)

## 👥 Авторы

- **Maksim Golovaty** - [GitHub](https://github.com/YOUR_USERNAME)

## 🙏 Благодарности

- [KWID](https://wearekwid.com/) - за оригинальный дизайн
- [Kommo](https://kommo.com/) - за CRM API
- [Next.js](https://nextjs.org/) - за отличный фреймворк

---

⭐ Поставьте звезду, если проект был полезен!

