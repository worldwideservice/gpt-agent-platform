import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui'

export interface AgentIntegration {
  id: string
  agent_id: string
  org_id: string
  integration_type: string
  is_installed: boolean
  is_active: boolean
  settings: Record<string, any>
  created_at?: string
  updated_at?: string
}

export interface Integration {
  id: string
  name: string
  installed: boolean
  active: boolean
  settingsUrl: string
}

/**
 * Hook для получения списка интеграций агента
 */
export function useAgentIntegrations(agentId: string) {
  return useQuery<Integration[]>({
    queryKey: ['agent-integrations', agentId],
    queryFn: async () => {
      const response = await fetch(`/api/agents/${agentId}/integrations`)
      if (!response.ok) {
        throw new Error('Failed to fetch integrations')
      }
      const data = await response.json()

      // Преобразуем данные из API в формат для UI
      const installedIntegrations = data.integrations || []

      // Список всех доступных интеграций
      const availableIntegrations = [
        { id: 'kommo', name: 'Kommo' },
        { id: 'google-calendar', name: 'Google Calendar' },
        { id: 'telegram', name: 'Telegram' },
        { id: 'whatsapp', name: 'WhatsApp' },
      ]

      return availableIntegrations.map((available) => {
        const installed = installedIntegrations.find(
          (i: AgentIntegration) => i.integration_type === available.id
        )

        return {
          id: installed?.id || available.id,
          name: available.name,
          installed: !!installed,
          active: installed?.is_active || false,
          settingsUrl: `/manage/[tenantId]/ai-agents/${agentId}/integrations/${available.id}`,
        }
      })
    },
    enabled: !!agentId,
  })
}

/**
 * Hook для установки интеграции
 */
export function useInstallIntegration(agentId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (integrationType: string) => {
      const response = await fetch(
        `/api/agents/${agentId}/integrations/${integrationType}/install`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ integration_type: integrationType }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to install integration')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-integrations', agentId] })
      toast({
        title: 'Успешно',
        description: 'Интеграция установлена',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось установить интеграцию',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook для обновления настроек интеграции
 */
export function useUpdateIntegration(agentId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({
      integrationId,
      isActive,
    }: {
      integrationId: string
      isActive: boolean
    }) => {
      const response = await fetch(`/api/agents/${agentId}/integrations/${integrationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: isActive }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update integration')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-integrations', agentId] })
      toast({
        title: 'Успешно',
        description: 'Настройки интеграции обновлены',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось обновить настройки',
        variant: 'destructive',
      })
    },
  })
}

/**
 * Hook для удаления интеграции
 */
export function useDeleteIntegration(agentId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (integrationId: string) => {
      const response = await fetch(`/api/agents/${agentId}/integrations/${integrationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete integration')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-integrations', agentId] })
      toast({
        title: 'Успешно',
        description: 'Интеграция удалена',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось удалить интеграцию',
        variant: 'destructive',
      })
    },
  })
}
