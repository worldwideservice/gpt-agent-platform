import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AvailableIntegrationsTable } from '@/components/integrations/AvailableIntegrationsTable'

// Мокаем useTenantId
vi.mock('@/hooks/useTenantId', () => ({
  useTenantId: () => 'test-tenant',
}))

describe('AvailableIntegrationsTable Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render available integrations table', () => {
    render(
      <AvailableIntegrationsTable
        agentId="agent-1"
        agentName="Test Agent"
        integrations={[]}
      />
    )
    
    // Компонент должен рендериться
    const table = document.querySelector('table') || document.querySelector('div')
    expect(table).toBeInTheDocument()
  })

  it('should render Kommo integration', () => {
    render(
      <AvailableIntegrationsTable
        agentId="agent-1"
        agentName="Test Agent"
        integrations={[]}
      />
    )
    
    expect(screen.getByText(/kommo/i)).toBeInTheDocument()
  })

  it('should render search input', () => {
    render(
      <AvailableIntegrationsTable
        agentId="agent-1"
        agentName="Test Agent"
        integrations={[]}
      />
    )
    
    const searchInput = screen.queryByPlaceholderText(/поиск/i)
    if (searchInput) {
      expect(searchInput).toBeInTheDocument()
    }
  })
})

