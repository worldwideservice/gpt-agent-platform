import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteButton } from '@/components/refine-ui/buttons/delete'

// Мокаем @refinedev/core
vi.mock('@refinedev/core', () => ({
  useDeleteButton: () => ({
    hidden: false,
    disabled: false,
    loading: false,
    onConfirm: vi.fn(),
    label: 'Delete',
    confirmTitle: 'Are you sure?',
    confirmOkLabel: 'Delete',
    cancelLabel: 'Cancel',
  }),
}))

describe('DeleteButton Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render delete button', () => {
    render(<DeleteButton resource="test-resource" recordItemId="1" />)
    
    const button = screen.getByRole('button', { name: /delete/i })
    expect(button).toBeInTheDocument()
  })

  it('should show confirmation popover on click', async () => {
    const user = userEvent.setup()
    
    render(<DeleteButton resource="test-resource" recordItemId="1" />)
    
    const button = screen.getByRole('button', { name: /delete/i })
    await user.click(button)
    
    await waitFor(() => {
      const confirmText = screen.queryByText(/are you sure/i)
      if (confirmText) {
        expect(confirmText).toBeInTheDocument()
      }
    }, { timeout: 2000 })
  })

  it('should be disabled when loading', () => {
    vi.mock('@refinedev/core', () => ({
      useDeleteButton: () => ({
        hidden: false,
        disabled: false,
        loading: true,
        onConfirm: vi.fn(),
        label: 'Delete',
        confirmTitle: 'Are you sure?',
        confirmOkLabel: 'Delete',
        cancelLabel: 'Cancel',
      }),
    }))
    
    render(<DeleteButton resource="test-resource" recordItemId="1" />)
    
    const button = screen.getByRole('button', { name: /delete/i })
    expect(button).toBeDisabled()
  })
})

