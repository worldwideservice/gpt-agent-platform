import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui'

interface UseCrmSyncOptions {
  agentId: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useCrmSync({ agentId, onSuccess, onError }: UseCrmSyncOptions) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSyncing, setIsSyncing] = useState(false)

  const syncCrm = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch(`/api/agents/${agentId}/sync-crm`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to sync CRM')
      }

      toast({
        title: 'Успешно',
        description: 'Синхронизация с CRM выполнена успешно',
      })

      router.refresh()
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось синхронизировать с CRM',
        variant: 'destructive',
      })
      onError?.(error as Error)
    } finally {
      setIsSyncing(false)
    }
  }

  return { syncCrm, isSyncing }
}
