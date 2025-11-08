import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SidebarProvider, useSidebar } from '@/components/layout/SidebarToggle'

// Компонент SidebarToggle не существует, создаем простой тест для useSidebar
function TestSidebarToggle() {
  const { toggle, isOpen } = useSidebar()
  return (
    <button onClick={toggle} aria-label="Toggle sidebar">
      {isOpen ? 'Close' : 'Open'}
    </button>
  )
}

describe('SidebarToggle Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render sidebar toggle button', () => {
    render(
      <SidebarProvider>
        <TestSidebarToggle />
      </SidebarProvider>
    )
    
    const button = screen.getByRole('button', { name: /toggle sidebar/i })
    expect(button).toBeInTheDocument()
  })

  it('should call toggle on click', async () => {
    const user = userEvent.setup()
    
    render(
      <SidebarProvider>
        <TestSidebarToggle />
      </SidebarProvider>
    )
    
    const button = screen.getByRole('button', { name: /toggle sidebar/i })
    await user.click(button)
    
    // Проверяем что кнопка работает и состояние изменилось
    expect(button).toBeInTheDocument()
    expect(button.textContent).toBe('Close')
  })
})

