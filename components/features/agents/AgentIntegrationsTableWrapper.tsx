'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useToast } from '@/components/ui'
import { AgentIntegrationsTable } from './AgentIntegrationsTable'

/**
 * Props for the AgentIntegrationsTableWrapper component
 */
interface AgentIntegrationsTableWrapperProps {
  /** Agent object with id and name */
  agent: {
    id: string
    name: string
  }
  /** Tenant/organization ID */
  tenantId: string
}

/**
 * Client component wrapper for AgentIntegrationsTable
 *
 * Handles OAuth callback success notifications by reading query parameters
 * from the URL after a successful OAuth redirect. Shows a success toast and
 * cleans up the URL to prevent notification on page refresh.
 *
 * This component is necessary because:
 * - AgentIntegrationsPage is a server component (can't use hooks)
 * - We need client-side hooks (useSearchParams, useToast) for notifications
 * - We want to clean up URL parameters after showing the notification
 *
 * @component
 * @example
 * ```tsx
 * // In server component (AgentIntegrationsPage.tsx)
 * export async function AgentIntegrationsPage({ tenantId, agentId }) {
 *   const agent = await getAgentById(agentId)
 *   return <AgentIntegrationsTableWrapper agent={agent} tenantId={tenantId} />
 * }
 * ```
 */
export function AgentIntegrationsTableWrapper({
  agent,
  tenantId,
}: AgentIntegrationsTableWrapperProps) {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Handle OAuth callback success
  useEffect(() => {
    const provider = searchParams.get('provider')
    const status = searchParams.get('status')

    if (provider && status === 'success') {
      toast({
        title: 'Успешно',
        description: `Интеграция ${provider} успешно подключена`,
      })

      // Clean up URL parameters
      const url = new URL(window.location.href)
      url.searchParams.delete('provider')
      url.searchParams.delete('status')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams, toast])

  return <AgentIntegrationsTable agent={agent} tenantId={tenantId} />
}
