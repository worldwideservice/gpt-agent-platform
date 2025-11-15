import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui'

/**
 * Represents an agent integration record from the database
 * @interface AgentIntegration
 */
export interface AgentIntegration {
  /** Unique identifier for the integration instance */
  id: string
  /** ID of the agent this integration belongs to */
  agent_id: string
  /** ID of the organization that owns this integration */
  org_id: string
  /** Type/name of the integration (e.g., 'kommo', 'telegram') */
  integration_type: string
  /** Whether the integration has been installed */
  is_installed: boolean
  /** Whether the integration is currently active/enabled */
  is_active: boolean
  /** Integration-specific configuration settings */
  settings: Record<string, any>
  /** Timestamp when the integration was created */
  created_at?: string
  /** Timestamp when the integration was last updated */
  updated_at?: string
}

/**
 * UI-friendly representation of an integration for display in the table
 * @interface Integration
 */
export interface Integration {
  /** Integration ID or type identifier */
  id: string
  /** Display name of the integration */
  name: string
  /** Whether this integration is installed for the agent */
  installed: boolean
  /** Whether this integration is currently active */
  active: boolean
  /** URL to the integration settings page */
  settingsUrl: string
}

/**
 * React Query hook to fetch and manage agent integrations list
 *
 * Fetches all available integrations and merges them with installed integrations
 * to provide a complete view of integration status for an agent.
 *
 * @param agentId - The ID of the agent to fetch integrations for
 * @returns React Query result with Integration[] data
 *
 * @example
 * ```tsx
 * const { data: integrations, isLoading, error } = useAgentIntegrations(agentId)
 *
 * if (isLoading) return <Loader />
 * if (error) return <Error />
 *
 * return integrations.map(integration => (
 *   <IntegrationRow key={integration.id} integration={integration} />
 * ))
 * ```
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
 * React Query mutation hook to install an integration for an agent
 *
 * Sends a POST request to install the specified integration type for the agent.
 * Automatically invalidates the integrations query cache and shows a success/error toast.
 *
 * @param agentId - The ID of the agent to install the integration for
 * @returns React Query mutation result with mutate function
 *
 * @example
 * ```tsx
 * const { mutate: installIntegration, isPending } = useInstallIntegration(agentId)
 *
 * const handleInstall = () => {
 *   installIntegration('kommo', {
 *     onSuccess: () => {
 *       console.log('Integration installed successfully')
 *       closeModal()
 *     }
 *   })
 * }
 * ```
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
 * React Query mutation hook to update an integration's settings
 *
 * Sends a PATCH request to update the integration's active status or other settings.
 * Automatically invalidates the integrations query cache and shows a success/error toast.
 *
 * @param agentId - The ID of the agent whose integration to update
 * @returns React Query mutation result with mutate function accepting {integrationId, isActive}
 *
 * @example
 * ```tsx
 * const { mutate: updateIntegration, isPending } = useUpdateIntegration(agentId)
 *
 * const toggleActive = (integrationId: string, currentStatus: boolean) => {
 *   updateIntegration({
 *     integrationId,
 *     isActive: !currentStatus
 *   })
 * }
 * ```
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
 * React Query mutation hook to delete an integration
 *
 * Sends a DELETE request to remove the specified integration from the agent.
 * Automatically invalidates the integrations query cache and shows a success/error toast.
 *
 * @param agentId - The ID of the agent whose integration to delete
 * @returns React Query mutation result with mutate function accepting integrationId
 *
 * @example
 * ```tsx
 * const { mutate: deleteIntegration, isPending } = useDeleteIntegration(agentId)
 *
 * const handleDelete = (integrationId: string) => {
 *   deleteIntegration(integrationId, {
 *     onSuccess: () => {
 *       console.log('Integration deleted successfully')
 *       closeDialog()
 *     }
 *   })
 * }
 * ```
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
