-- Создание Storage Bucket через SQL
-- Применить в Supabase Dashboard -> SQL Editor

-- Создание bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'agent-assets',
  'agent-assets',
  false,
  52428800, -- 50 MB
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/html',
    'text/markdown'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- RLS политика: пользователи могут загружать файлы в bucket своей организации
CREATE POLICY IF NOT EXISTS "Users can upload files to agent-assets bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'agent-assets' AND
  auth.uid() IS NOT NULL
);

-- RLS политика: пользователи могут читать файлы из bucket своей организации
CREATE POLICY IF NOT EXISTS "Users can read files from agent-assets bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'agent-assets' AND
  auth.uid() IS NOT NULL
);

-- RLS политика: пользователи могут удалять свои файлы
CREATE POLICY IF NOT EXISTS "Users can delete files from agent-assets bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'agent-assets' AND
  auth.uid() IS NOT NULL
);

-- Проверка создания bucket
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'agent-assets';


















