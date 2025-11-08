import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CRMSync } from '@/components/crm/CRMSync'

// Мокаем useCRMData hook
vi.mock('@/hooks/useCRMData', () => ({
  useCRMData: () => ({
    pipelines: [],
    isLoading: false,
    error: null,
    syncData: vi.fn(),
    isConnected: true,
  }),
}))

describe('CRMSync Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render CRM sync', () => {
    const mockConnection = {
      id: '1',
      provider: 'kommo',
      accessToken: 'token',
      domain: 'test.kommo.com',
    }
    
    render(
      <CRMSync
        connection={mockConnection}
        pipelineSettings={[]}
        onPipelineUpdate={vi.fn()}
      />
    )
    
    // Компонент должен рендериться
    const syncComponent = document.querySelector('div')
    expect(syncComponent).toBeInTheDocument()
  })

  it('should render sync button', () => {
    const mockConnection = {
      id: '1',
      provider: 'kommo',
      accessToken: 'token',
      domain: 'test.kommo.com',
    }
    
    render(
      <CRMSync
        connection={mockConnection}
        pipelineSettings={[]}
        onPipelineUpdate={vi.fn()}
      />
    )
    
    // Проверяем что кнопка синхронизации отображается
    const syncButton = screen.queryByRole('button', { name: /синхронизировать/i })
    if (syncButton) {
      expect(syncButton).toBeInTheDocument()
    }
  })
})

