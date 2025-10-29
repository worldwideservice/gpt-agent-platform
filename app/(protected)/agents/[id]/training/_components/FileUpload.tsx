'use client'

import { useCallback, useEffect, useState } from 'react'
import { Upload, X, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'

interface FileUploadProps {
  agentId: string
  onUploadComplete?: () => void
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

export const FileUpload = ({ agentId, onUploadComplete }: FileUploadProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Загружаем список существующих файлов
  const fetchFiles = useCallback(async () => {
    try {
      const response = await fetch(`/api/agents/${agentId}/assets`)
      if (!response.ok) {
        throw new Error('Не удалось загрузить файлы')
      }

      const payload = (await response.json()) as {
        success: boolean
        data: UploadedFile[]
      }

      if (payload.success) {
        setFiles(payload.data)
      }
    } catch (err) {
      console.error('Failed to fetch files', err)
    }
  }, [agentId])

  // Обработка загрузки файлов
  const handleUpload = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) {
        return
      }

      setIsUploading(true)
      setError(null)

      try {
        const uploadedFiles: UploadedFile[] = []

        for (const file of Array.from(fileList)) {
          // Проверка размера
          if (file.size > 50 * 1024 * 1024) {
            setError(`Файл ${file.name} слишком большой (максимум 50 MB)`)
            continue
          }

          // Проверка типа
          const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'text/html',
            'text/markdown',
          ]

          const isValidType =
            allowedTypes.includes(file.type) ||
            file.name.match(/\.(pdf|docx|txt|html|md)$/i)

          if (!isValidType) {
            setError(`Неподдерживаемый тип файла: ${file.name}`)
            continue
          }

          // Загрузка файла
          const formData = new FormData()
          formData.append('file', file)

          const response = await fetch(`/api/agents/${agentId}/assets`, {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            const errorData = (await response.json()) as { success: boolean; error?: string }
            throw new Error(errorData.error || `Не удалось загрузить ${file.name}`)
          }

          const payload = (await response.json()) as {
            success: boolean
            data: UploadedFile
          }

          if (payload.success) {
            uploadedFiles.push(payload.data)
          }
        }

        // Обновляем список файлов
        await fetchFiles()
        onUploadComplete?.()
      } catch (err) {
        console.error('Failed to upload files', err)
        setError(err instanceof Error ? err.message : 'Ошибка загрузки файлов')
      } finally {
        setIsUploading(false)
      }
    },
    [agentId, fetchFiles, onUploadComplete],
  )

  // Обработка drag & drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files)
      }
    },
    [handleUpload],
  )

  // Удаление файла
  const handleDelete = useCallback(
    async (fileId: string) => {
      try {
        const response = await fetch(`/api/agents/${agentId}/assets/${fileId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Не удалось удалить файл')
        }

        await fetchFiles()
      } catch (err) {
        console.error('Failed to delete file', err)
        setError(err instanceof Error ? err.message : 'Ошибка удаления файла')
      }
    },
    [agentId, fetchFiles],
  )

  // Загружаем файлы при монтировании
  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-rose-600" />
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-primary-600" />
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
    }
  }

  const getStatusText = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed':
        return 'Обработан'
      case 'failed':
        return 'Ошибка'
      case 'processing':
        return 'Обработка...'
      default:
        return 'Ожидание...'
    }
  }

  return (
    <div className="space-y-6">
      {/* Зона загрузки */}
      <div
        className={`rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-slate-300 bg-slate-50 hover:border-primary-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className={`mx-auto h-16 w-16 ${dragActive ? 'text-primary-600' : 'text-slate-400'}`} />
        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          {dragActive ? 'Отпустите для загрузки' : 'Перетащите файлы сюда или нажмите для выбора'}
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Поддерживаются: PDF, DOCX, TXT, HTML, Markdown (до 50 MB каждый)
        </p>
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.html,.md"
          className="hidden"
          id="file-upload"
          onChange={(e) => handleUpload(e.target.files)}
          disabled={isUploading}
        />
        <label htmlFor="file-upload">
          <Button type="button" className="mt-6 cursor-pointer" disabled={isUploading} asChild>
            <span>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Загрузка...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Выбрать файлы
              </>
            )}
          </Button>
        </label>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">
          {error}
        </div>
      )}

      {/* Список загруженных файлов */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">Загруженные файлы ({files.length})</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(file.size ?? 0)} • {getStatusText(file.status)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusIcon(file.status)}
                  <button
                    type="button"
                    onClick={() => handleDelete(file.id)}
                    className="text-slate-400 transition-colors hover:text-rose-500"
                    aria-label="Удалить файл"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

