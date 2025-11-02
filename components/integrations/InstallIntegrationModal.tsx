'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { KwidButton } from '@/components/kwid'

interface InstallIntegrationModalProps {
  isOpen: boolean
  onClose: () => void
  integrationName: string
  integrationType: string
  agentId: string
  tenantId?: string
}

export const InstallIntegrationModal = ({
  isOpen,
  onClose,
  integrationName,
  integrationType,
  agentId,
  tenantId,
}: InstallIntegrationModalProps) => {
  const router = useRouter()
  const [isInstalling, setIsInstalling] = useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    setIsInstalling(true)

    try {
      // Для Kommo - запускаем OAuth flow
      if (integrationType === 'kommo') {
        // Редиректим на страницу установки Kommo или запускаем OAuth
        const installPath = tenantId
          ? `/manage/${tenantId}/ai-agents/${agentId}/integrations/kommo/install`
          : `/agents/${agentId}/integrations/kommo/install`
        
        router.push(installPath)
        onClose()
        return
      }

      // Для других интеграций - вызываем API установки
      const response = await fetch(`/api/agents/${agentId}/integrations/${integrationType}/install`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          integration_type: integrationType,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Не удалось установить интеграцию')
      }

      // Обновляем страницу чтобы показать изменения
      router.refresh()
      onClose()
    } catch (error) {
      console.error('Error installing integration:', error)
      alert(error instanceof Error ? error.message : 'Не удалось установить интеграцию')
    } finally {
      setIsInstalling(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-md rounded-xl bg-white shadow-xl ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-end border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <button
            onClick={onClose}
            className="fi-modal-close-btn group flex items-center justify-center outline-none rounded-lg border border-transparent transition duration-75 hover:bg-gray-50 focus:bg-gray-50 dark:hover:bg-gray-900 dark:focus:bg-gray-900"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5 text-gray-400 transition duration-75 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="mb-6">
            <h2
              id="modal-title"
              className="text-lg font-semibold text-gray-950 dark:text-white"
            >
              Установить интеграцию?
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Это установит эту интеграцию для вашего аккаунта и сделает её доступной для этого Агента ИИ.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <KwidButton
              variant="secondary"
              onClick={onClose}
              disabled={isInstalling}
            >
              Отменить
            </KwidButton>
            <KwidButton
              variant="primary"
              onClick={handleConfirm}
              disabled={isInstalling}
            >
              {isInstalling ? 'Установка...' : 'Подтвердить'}
            </KwidButton>
          </div>
        </div>
      </div>
    </div>
  )
}

