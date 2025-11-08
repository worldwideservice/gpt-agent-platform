import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

describe('ConfirmDialog Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render confirm dialog', () => {
    const onOpenChange = vi.fn()
    render(
      <ConfirmDialog 
        open={true} 
        onOpenChange={onOpenChange}
        onConfirm={vi.fn()}
        title="Test Title"
      />
    )
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('should call onConfirm when confirmed', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onOpenChange = vi.fn()
    
    render(
      <ConfirmDialog 
        open={true} 
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
        title="Test Title"
      />
    )
    
    const confirmButton = screen.getByRole('button', { name: /подтвердить/i })
    await user.click(confirmButton)
    
    expect(onConfirm).toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('should call onOpenChange when cancelled', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onOpenChange = vi.fn()
    
    render(
      <ConfirmDialog 
        open={true} 
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
        title="Test Title"
      />
    )
    
    const cancelButton = screen.getByRole('button', { name: /отмена/i })
    await user.click(cancelButton)
    
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})

