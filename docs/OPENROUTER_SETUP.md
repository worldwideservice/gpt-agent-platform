# Настройка OpenRouter API

OpenRouter используется для работы с различными LLM моделями (GPT-4, Claude, Llama и др.) через единый API.

## Получение API ключа

1. Перейдите на [OpenRouter.ai](https://openrouter.ai/)
2. Зарегистрируйтесь или войдите в аккаунт
3. Перейдите в раздел [Keys](https://openrouter.ai/keys)
4. Создайте новый API ключ
5. Скопируйте ключ (он будет показан только один раз!)

## Настройка переменных окружения

### Для локальной разработки (Next.js)

Добавьте в файл `.env.local` в корне проекта:

```bash
# OpenRouter API Key для работы с LLM
OPENROUTER_API_KEY="sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# URL приложения (используется в заголовках запросов)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Для Backend API сервиса

Добавьте в файл `services/api/.env`:

```bash
OPENROUTER_API_KEY="sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Для Worker сервиса

Добавьте в файл `services/worker/.env`:

```bash
OPENROUTER_API_KEY="sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## Проверка настройки

После настройки переменных окружения:

1. Перезапустите все сервисы (Next.js dev server, API, Worker)
2. Откройте страницу чата в приложении
3. Попробуйте отправить сообщение агенту
4. Если всё настроено правильно, вы получите ответ от LLM

## Доступные модели

Система автоматически получает список доступных моделей из OpenRouter. По умолчанию используются:

- `openai/gpt-4o-mini` - быстрая и экономичная модель
- `openai/gpt-4` - более мощная модель
- `openai/gpt-3.5-turbo` - классическая модель
- `anthropic/claude-3-haiku` - быстрая модель от Anthropic
- `anthropic/claude-3-sonnet` - продвинутая модель от Anthropic

Модель можно выбрать при создании или редактировании агента.

## Тарификация

OpenRouter взимает плату за использование моделей в зависимости от:
- Количества токенов (input + output)
- Выбранной модели

Учет токенов ведется автоматически и сохраняется в метаданных сообщений для дальнейшего биллинга.

## Troubleshooting

### Ошибка "OpenRouter API ключ не настроен"

**Решение:** Убедитесь, что:
1. Переменная `OPENROUTER_API_KEY` установлена в `.env.local`
2. Сервер перезапущен после добавления переменной
3. Ключ скопирован полностью без пробелов

### Ошибка 401 Unauthorized

**Решение:** Проверьте, что:
1. API ключ не истек (в OpenRouter проверьте статус ключа)
2. Ключ скопирован полностью
3. Используете правильный ключ (для production/development)

### Ошибка 429 Too Many Requests

**Решение:** 
1. Проверьте лимиты на вашем аккаунте OpenRouter
2. Подождите несколько минут перед повторной попыткой
3. Рассмотрите обновление тарифа в OpenRouter

## Дополнительная информация

- [Документация OpenRouter](https://openrouter.ai/docs)
- [Список доступных моделей](https://openrouter.ai/models)
- [Тарифы и цены](https://openrouter.ai/docs/pricing)


















