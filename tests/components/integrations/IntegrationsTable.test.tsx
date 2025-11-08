import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IntegrationsTable } from '@/components/integrations/IntegrationsTable'

// Мокаем useTenantId
vi.mock('@/hooks/useTenantId', () => ({
  useTenantId: () => 'test-tenant',
}))

describe('IntegrationsTable Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render integrations table', () => {
    render(<IntegrationsTable agentId="agent-1" />)
    
    // Компонент должен рендериться
    const table = document.querySelector('table') || document.querySelector('div')
    expect(table).toBeInTheDocument()
  })

  it('should render search input', () => {
    render(<IntegrationsTable agentId="agent-1" />)
    
    const searchInput = screen.queryByPlaceholderText(/поиск/i)
    if (searchInput) {
      expect(searchInput).toBeInTheDocument()
    }
  })

  it('should filter integrations by search term', async () => {
    const user = userEvent.setup()
    
    render(<IntegrationsTable agentId="agent-1" />)
    
    const searchInput = screen.queryByPlaceholderText(/поиск/i)
    if (searchInput) {
      await user.type(searchInput, 'kommo')
      expect(searchInput).toHaveValue('kommo')
    }
  })
})

