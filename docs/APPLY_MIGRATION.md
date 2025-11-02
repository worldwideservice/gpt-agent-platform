# Применение миграции ensure_organizations_slug.sql

## Способ 1: Через Supabase Dashboard (Рекомендуется)

1. Откройте Supabase Dashboard вашего проекта
2. Перейдите в раздел **SQL Editor**
3. Скопируйте содержимое файла `supabase/migrations/ensure_organizations_slug.sql`
4. Вставьте SQL код в редактор
5. Нажмите **Run** для выполнения миграции
6. Проверьте результаты в сообщениях (RAISE NOTICE сообщения покажут обновленные организации)

## Способ 2: Через Supabase CLI

Если у вас настроен Supabase CLI и проект подключен:

```bash
# Подключиться к проекту (если еще не подключен)
supabase link --project-ref YOUR_PROJECT_REF

# Применить миграцию
supabase db push
```

Или выполнить SQL напрямую:

```bash
supabase db execute --file supabase/migrations/ensure_organizations_slug.sql
```

## Способ 3: Через psql (прямое подключение)

Если у вас есть доступ к базе данных через psql:

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" -f supabase/migrations/ensure_organizations_slug.sql
```

## Проверка результатов

После применения миграции проверьте, что все организации имеют slug:

```sql
SELECT id, name, slug 
FROM organizations 
WHERE slug IS NULL OR slug = '';
```

Этот запрос должен вернуть пустой результат, если миграция выполнена успешно.

## Что делает миграция

1. Находит все организации без slug (где slug IS NULL или пустая строка)
2. Генерирует slug на основе имени организации
3. Проверяет уникальность slug
4. При необходимости добавляет числовой суффикс для обеспечения уникальности
5. Обновляет поле slug в базе данных

Миграция безопасна и может быть выполнена несколько раз - она обновит только организации без slug.

