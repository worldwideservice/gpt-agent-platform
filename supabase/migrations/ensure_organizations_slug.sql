-- Миграция: обеспечить наличие slug для всех организаций
-- Генерирует slug на основе name для организаций без slug

DO $$
DECLARE
  org_record RECORD;
  new_slug TEXT;
  slug_counter INTEGER;
  base_slug TEXT;
BEGIN
  -- Обновляем все организации без slug
  FOR org_record IN 
    SELECT id, name 
    FROM organizations 
    WHERE slug IS NULL OR slug = ''
  LOOP
    -- Генерируем базовый slug из имени
    base_slug := LOWER(REGEXP_REPLACE(
      REGEXP_REPLACE(org_record.name, '[^a-zA-Z0-9\s]', '', 'g'),
      '\s+', '-', 'g'
    ));
    
    -- Если после обработки slug пустой, используем ID
    IF base_slug = '' OR base_slug IS NULL THEN
      base_slug := 'org-' || SUBSTRING(org_record.id::TEXT FROM 1 FOR 8);
    END IF;
    
    -- Проверяем уникальность и добавляем суффикс если нужно
    new_slug := base_slug;
    slug_counter := 1;
    
    WHILE EXISTS (
      SELECT 1 FROM organizations 
      WHERE slug = new_slug AND id != org_record.id
    ) LOOP
      new_slug := base_slug || '-' || slug_counter;
      slug_counter := slug_counter + 1;
      
      -- Защита от бесконечного цикла
      IF slug_counter > 1000 THEN
        new_slug := 'org-' || SUBSTRING(org_record.id::TEXT FROM 1 FOR 8) || '-' || slug_counter;
        EXIT;
      END IF;
    END LOOP;
    
    -- Обновляем slug
    UPDATE organizations
    SET slug = new_slug
    WHERE id = org_record.id;
    
    RAISE NOTICE 'Updated organization % with slug %', org_record.id, new_slug;
  END LOOP;
END $$;

-- Убеждаемся, что поле slug NOT NULL (только если все значения заполнены)
-- ALTER TABLE organizations ALTER COLUMN slug SET NOT NULL;

