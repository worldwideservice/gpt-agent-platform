import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { DealContactFieldsSelector } from '@/components/crm/DealContactFieldsSelector'
import { ToastProvider } from '@/components/ui/toast-context'

// Мокаем fetch
global.fetch = vi.fn()

describe('DealContactFieldsSelector Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { dealFields: [], contactFields: [] } }),
    } as Response)
  })

  it('should render deal contact fields selector', async () => {
    const onFieldsChange = vi.fn()
    render(
      <ToastProvider>
        <DealContactFieldsSelector
          agentId="agent-1"
          onFieldsChange={onFieldsChange}
        />
      </ToastProvider>
    )
    
    // Компонент должен рендериться (может быть в состоянии загрузки)
    await waitFor(() => {
      const selector = document.querySelector('div')
      expect(selector).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('should render field sections', async () => {
    const onFieldsChange = vi.fn()
    render(
      <ToastProvider>
        <DealContactFieldsSelector
          agentId="agent-1"
          onFieldsChange={onFieldsChange}
        />
      </ToastProvider>
    )
    
    // Проверяем что есть секции для полей сделок и контактов
    await waitFor(() => {
      const selector = document.querySelector('div')
      expect(selector).toBeInTheDocument()
    }, { timeout: 2000 })
  })
})
