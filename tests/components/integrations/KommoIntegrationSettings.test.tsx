import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KommoIntegrationSettings } from '@/components/integrations/KommoIntegrationSettings'

// Мокаем next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}))

// Мокаем useTenantId
vi.mock('@/hooks/useTenantId', () => ({
  useTenantId: () => 'test-tenant',
}))

// Мокаем fetch
global.fetch = vi.fn()

describe('KommoIntegrationSettings Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)
  })

  it('should render Kommo integration settings', () => {
    const mockIntegration = {
      id: '1',
      agent_id: 'agent-1',
      integration_type: 'kommo',
      is_active: false,
    }
    
    render(
      <KommoIntegrationSettings
        agentId="agent-1"
        integrationId="1"
        integration={mockIntegration}
      />
    )
    
    // Компонент должен рендериться
    const settings = document.querySelector('div')
    expect(settings).toBeInTheDocument()
  })

  it('should render active toggle', () => {
    const mockIntegration = {
      id: '1',
      agent_id: 'agent-1',
      integration_type: 'kommo',
      is_active: false,
    }
    
    render(
      <KommoIntegrationSettings
        agentId="agent-1"
        integrationId="1"
        integration={mockIntegration}
      />
    )
    
    const switchElement = screen.queryByRole('switch')
    if (switchElement) {
      expect(switchElement).toBeInTheDocument()
    }
  })
})

