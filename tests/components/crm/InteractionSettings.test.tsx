import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InteractionSettings } from '@/components/crm/InteractionSettings'

describe('InteractionSettings Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render interaction settings', () => {
    const onToggle = vi.fn()
    render(
      <InteractionSettings
        checkBeforeSending={false}
        onCheckBeforeSendingToggle={onToggle}
      />
    )
    
    expect(screen.getByText(/взаимодействие/i)).toBeInTheDocument()
    expect(screen.getByText(/проверять перед отправкой/i)).toBeInTheDocument()
  })

  it('should render switch', () => {
    const onToggle = vi.fn()
    render(
      <InteractionSettings
        checkBeforeSending={false}
        onCheckBeforeSendingToggle={onToggle}
      />
    )
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeInTheDocument()
  })

  it('should toggle switch on click', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    
    render(
      <InteractionSettings
        checkBeforeSending={false}
        onCheckBeforeSendingToggle={onToggle}
      />
    )
    
    const switchElement = screen.getByRole('switch')
    await user.click(switchElement)
    
    expect(onToggle).toHaveBeenCalledWith(true)
  })

  it('should show switch as checked when enabled', () => {
    const onToggle = vi.fn()
    render(
      <InteractionSettings
        checkBeforeSending={true}
        onCheckBeforeSendingToggle={onToggle}
      />
    )
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('aria-checked', 'true')
  })
})

