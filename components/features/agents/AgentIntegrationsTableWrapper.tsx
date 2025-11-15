'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useToast } from '@/components/ui'
import { AgentIntegrationsTable } from './AgentIntegrationsTable'

interface AgentIntegrationsTableWrapperProps {
  agent: {
    id: string
    name: string
  }
  tenantId: string
}

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
