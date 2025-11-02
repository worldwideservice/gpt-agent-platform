# Kwid Service Full Extraction Tool

Инструменты для полного извлечения всех данных из сервиса Kwid.

## Установка

```bash
npm install
```

## Использование

### Полное извлечение всех данных:
```bash
npm run full
```

### Отдельные команды:

1. **Извлечение всех статических и динамических данных:**
```bash
npm run extract
```

2. **Извлечение Livewire компонентов:**
```bash
npm run extract-livewire
```

3. **Анализ компонентов:**
```bash
npm run analyze
```

## Структура извлеченных данных

```
kwid-extraction/
├── assets/
│   ├── js/          # Все JavaScript файлы
│   ├── css/         # Все CSS файлы
│   ├── images/      # Изображения
│   └── fonts/       # Шрифты
├── data/
│   ├── html/        # HTML страниц
│   ├── snapshots/   # Livewire snapshots
│   ├── network/     # Network requests/responses
│   ├── localStorage/ # LocalStorage данные
│   └── livewire/    # Livewire компоненты
├── components/      # Анализ компонентов
└── analysis/        # Дополнительный анализ
```

## Что извлекается

1. ✅ Все HTML страницы
2. ✅ Все JavaScript файлы (декомпилированные)
3. ✅ Все CSS файлы
4. ✅ Все Livewire компоненты и их структура
5. ✅ Все network requests/responses
6. ✅ LocalStorage/SessionStorage
7. ✅ Все CSS классы
8. ✅ Структура форм, кнопок, инпутов
9. ✅ Alpine.js компоненты
10. ✅ Meta теги и конфигурация

