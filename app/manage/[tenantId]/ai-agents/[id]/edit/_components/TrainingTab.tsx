'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Upload, X, FileText, Loader2, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/toast-context'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Asset {
  id: string
  source_name: string
  file_size: number
  created_at: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  chunks_count?: number
  processing_error?: string
}

interface TrainingTabProps {
  agentId: string
}

export function TrainingTab({ agentId }: TrainingTabProps) {
  const params = useParams()
  const { push } = useToast()
  const { register, formState: { errors }, watch, setValue } = useFormContext()
  const instructions = watch('instructions')

  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Загружаем список файлов
  const loadAssets = useCallback(async () => {
    try {
      const response = await fetch(`/api/agents/${agentId}/assets`)
      const data = await response.json()

      if (data.success) {
        setAssets(data.data || [])
      } else {
        // Не показываем ошибку если файлов просто нет
        setAssets([])
      }
    } catch (error) {
      console.error('Failed to load assets', error)
      // Не показываем ошибку пользователю - это нормально если файлов нет
      setAssets([])
    } finally {
      setLoading(false)
    }
  }, [agentId])

  useEffect(() => {
    loadAssets()
  }, [loadAssets])

  // Polling для обновления статусов обработки
  useEffect(() => {
    const interval = setInterval(() => {
      const hasProcessing = assets.some((a) => a.status === 'processing' || a.status === 'pending')
      if (hasProcessing) {
        loadAssets()
      }
    }, 3000) // Обновляем каждые 3 секунды

    return () => clearInterval(interval)
  }, [assets, loadAssets])

  // Обработка загрузки файла
  const handleFileUpload = useCallback(async (file: File) => {
    // Проверка размера (50 MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      push({
        title: 'Ошибка',
        description: 'Размер файла не должен превышать 50 MB',
        variant: 'error',
      })
      return
    }

    // Проверка типа файла
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/html', 'text/markdown']
    const allowedExtensions = /\.(pdf|docx|txt|html|md)$/i

    if (!allowedTypes.includes(file.type) && !file.name.match(allowedExtensions)) {
      push({
        title: 'Ошибка',
        description: 'Неподдерживаемый тип файла. Поддерживаются: PDF, DOCX, TXT, HTML, Markdown',
        variant: 'error',
      })
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`/api/agents/${agentId}/assets`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        push({
          title: 'Успешно',
          description: 'Файл загружен и будет обработан',
          variant: 'success',
        })
        await loadAssets()
      } else {
        throw new Error(data.error || 'Не удалось загрузить файл')
      }
    } catch (error) {
      console.error('Failed to upload file', error)
      push({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось загрузить файл',
        variant: 'error',
      })
    } finally {
      setUploading(false)
    }
  }, [agentId, push, loadAssets])

  // Drag & Drop handlers
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

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileUpload(e.dataTransfer.files[0])
      }
    },
    [handleFileUpload]
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
      e.target.value = '' // Сброс input
    }
  }

  // Удаление файла
  const handleDelete = async (assetId: string) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/assets/${assetId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        push({
          title: 'Успешно',
          description: 'Файл удален',
          variant: 'success',
        })
        await loadAssets()
      } else {
        throw new Error(data.error || 'Не удалось удалить файл')
      }
    } catch (error) {
      console.error('Failed to delete file', error)
      push({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось удалить файл',
        variant: 'error',
      })
    } finally {
      setDeleteDialogOpen(false)
      setAssetToDelete(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: Asset['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Ожидает обработки</Badge>
      case 'processing':
        return <Badge variant="default">Обрабатывается</Badge>
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Обработан</Badge>
      case 'failed':
        return <Badge variant="destructive">Ошибка</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-8 mt-6">
      {/* Секция "Инструкции для агента" */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Инструкции для агента</h2>

        <div className="space-y-2">
          <Label htmlFor="instructions">
            Инструкции для агента <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="instructions"
            {...register('instructions', {
              required: 'Инструкции для агента обязательны',
            })}
            placeholder="Начальные инструкции по тону, стилю и ответам вашего агента..."
            rows={10}
            value={instructions || ''}
            onChange={(e) => setValue('instructions', e.target.value, { shouldValidate: true })}
            className={errors.instructions ? 'border-red-500' : ''}
          />
          <p className="text-xs text-gray-500">
            Вы также можете добавить общие сведения о компании, чтобы помочь агенту отвечать
            более точно.
          </p>
          {errors.instructions && (
            <p className="text-sm text-red-500">
              {typeof errors.instructions.message === 'string'
                ? errors.instructions.message
                : 'Ошибка в поле инструкций'}
            </p>
          )}
        </div>
      </div>

      {/* Секция "Файлы для обучения" */}
      <div className="space-y-6 border-t pt-6">
        <div>
          <h2 className="text-lg font-semibold">Файлы для обучения</h2>
          <p className="text-sm text-gray-600 mt-1">
            Загрузите документы для обучения агента. Файлы будут автоматически обработаны,
            разбиты на части и проиндексированы.
          </p>
        </div>

        {/* Drag & Drop область */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.html,.md"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-sm font-medium text-gray-700 mb-2">
            Перетащите файл сюда или нажмите для выбора
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Поддерживаются: PDF, DOCX, TXT, HTML, Markdown (до 50 MB)
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Загрузка...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Загрузить файл
              </>
            )}
          </Button>
        </div>

        {/* Список загруженных файлов */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Загрузка файлов...</div>
        ) : assets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Нет загруженных файлов. Загрузите файлы для обучения агента.
          </div>
        ) : (
          <div className="space-y-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {asset.source_name}
                        </p>
                        {getStatusBadge(asset.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{formatFileSize(asset.file_size)}</span>
                        <span>{formatDate(asset.created_at)}</span>
                        {asset.status === 'completed' && asset.chunks_count && (
                          <span className="text-green-600">
                            {asset.chunks_count} chunks обработано
                          </span>
                        )}
                      </div>
                      {asset.status === 'processing' && (
                        <div className="mt-2">
                          <Progress value={50} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">Обработка файла...</p>
                        </div>
                      )}
                      {asset.status === 'failed' && asset.processing_error && (
                        <div className="mt-2 flex items-start space-x-2 text-xs text-red-600">
                          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{asset.processing_error}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setAssetToDelete(asset.id)
                      setDeleteDialogOpen(true)
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Диалог подтверждения удаления */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить файл?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить этот файл? Это действие нельзя отменить. Все
              связанные chunks и embeddings также будут удалены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => assetToDelete && handleDelete(assetToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

