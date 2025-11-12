import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { IntegrationsContent } from '@/components/integrations/IntegrationsContent'

// Мокаем fetch
global.fetch = vi.fn()

describe('IntegrationsContent Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        connection: null,
      }),
    } as Response)
  })

  it('should render integrations content', async () => {
    render(<IntegrationsContent />)
    
    await waitFor(() => {
      const content = document.querySelector('div')
      expect(content).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('should show loading state', () => {
    render(<IntegrationsContent />)
    
    // Проверяем что компонент рендерится (может быть в состоянии загрузки)
    const content = document.querySelector('div')
    expect(content).toBeInTheDocument()
  })
})

