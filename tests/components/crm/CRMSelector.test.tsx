import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CRMSelector } from '@/components/crm/CRMSelector'

describe('CRMSelector Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render CRM selector', () => {
    const onSelect = vi.fn()
    render(<CRMSelector onSelect={onSelect} connectedCRMs={[]} />)
    
    expect(screen.getByText(/выберите CRM систему/i)).toBeInTheDocument()
  })

  it('should render supported CRMs', () => {
    const onSelect = vi.fn()
    render(<CRMSelector onSelect={onSelect} connectedCRMs={[]} />)
    
    // Проверяем что отображаются поддерживаемые CRM системы
    expect(screen.getByText(/kommo crm/i)).toBeInTheDocument()
  })

  it('should call onSelect when CRM is selected', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    
    render(<CRMSelector onSelect={onSelect} connectedCRMs={[]} />)
    
    // Находим и кликаем на кнопку "Подключить" (может быть несколько кнопок)
    const connectButtons = screen.getAllByRole('button', { name: /подключить/i })
    if (connectButtons.length > 0) {
      await user.click(connectButtons[0])
      expect(onSelect).toHaveBeenCalled()
    }
  })

  it('should show connected status for connected CRMs', () => {
    const onSelect = vi.fn()
    render(<CRMSelector onSelect={onSelect} connectedCRMs={['kommo']} />)
    
    // Проверяем что подключенные CRM отмечены (может быть несколько элементов с текстом "Подключено")
    const connectedTexts = screen.queryAllByText(/подключено/i)
    expect(connectedTexts.length).toBeGreaterThan(0)
  })
})

