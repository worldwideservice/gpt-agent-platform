-- Миграция: Создание таблицы knowledge_base_categories
-- Эта таблица была отсутствовала в базе данных, что вызывало ошибку 500 на страницах knowledge-base

CREATE TABLE IF NOT EXISTS knowledge_base_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  parent_id uuid REFERENCES knowledge_base_categories(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (org_id, name, parent_id)
);

CREATE INDEX IF NOT EXISTS idx_kb_categories_org ON knowledge_base_categories(org_id);
CREATE INDEX IF NOT EXISTS idx_kb_categories_parent ON knowledge_base_categories(parent_id);

CREATE TRIGGER knowledge_base_categories_updated_at
BEFORE UPDATE ON knowledge_base_categories
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Включение RLS
ALTER TABLE knowledge_base_categories ENABLE ROW LEVEL SECURITY;

-- RLS политика
DROP POLICY IF EXISTS "Users can manage KB categories in their org" ON public.knowledge_base_categories;
CREATE POLICY "Users can manage KB categories in their org"
ON public.knowledge_base_categories FOR ALL
TO authenticated
USING (
  org_id IN (
    SELECT org_id FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Добавление внешнего ключа для articles, если его еще нет
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'knowledge_base_articles_category_id_fkey'
    AND table_name = 'knowledge_base_articles'
  ) THEN
    ALTER TABLE knowledge_base_articles 
    ADD CONSTRAINT knowledge_base_articles_category_id_fkey 
    FOREIGN KEY (category_id) REFERENCES knowledge_base_categories(id) ON DELETE SET NULL;
  END IF;
END $$;


