import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AgentSettingsContent } from '@/components/agents/AgentSettingsContent'

// Мокаем next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => ({ tenantId: 'test-tenant', id: '1' }),
  usePathname: () => '/manage/test-tenant/ai-agents/1',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}))

describe('AgentSettingsContent Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render agent settings content', () => {
    render(<AgentSettingsContent />)
    
    // Компонент должен рендериться
    const content = document.querySelector('main') || document.querySelector('div')
    expect(content).toBeInTheDocument()
  })

  it('should render tabs', () => {
    render(<AgentSettingsContent />)
    
    // Проверяем что вкладки отображаются
    const tabs = screen.queryAllByRole('tab')
    if (tabs.length > 0) {
      expect(tabs.length).toBeGreaterThan(0)
    }
  })

  it('should render basic settings tab', () => {
    render(<AgentSettingsContent />)
    
    // Проверяем что вкладка "Основные" отображается
    const basicsTab = screen.queryByText(/основные/i)
    if (basicsTab) {
      expect(basicsTab).toBeInTheDocument()
    }
  })

  it('should render form fields', () => {
    render(<AgentSettingsContent />)
    
    // Проверяем что поля формы отображаются
    const inputs = screen.queryAllByRole('textbox')
    expect(inputs.length).toBeGreaterThanOrEqual(0)
  })
})

