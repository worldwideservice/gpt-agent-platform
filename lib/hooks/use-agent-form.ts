import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui'

interface UseAgentFormOptions {
  agentId: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useAgentForm({ agentId, onSuccess, onError }: UseAgentFormOptions) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitForm = async (
    endpoint: string,
    data: Record<string, any>,
    successMessage: string = 'Изменения сохранены'
  ) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update')
      }

      toast({
        title: 'Успешно',
        description: successMessage,
      })

      router.refresh()
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось сохранить изменения',
        variant: 'destructive',
      })
      onError?.(error as Error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submitForm, isSubmitting }
}
